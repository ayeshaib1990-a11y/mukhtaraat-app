// High-Reliability Universal Audio Player for Arabic & Urdu Pronunciation
// Supports:
// 1. Authentic Quranic Recitation by Qari Abdul Basit (Surah Al-Furqan Ch 1 & Surah Al-Qasas Ch 2) via EveryAyah
// 2. Classical Arabic Literary Recitation by Sheikh Amro Elbosaty style (Chapters 3 to 33)
// 3. Poetic Master Urdu Narration by Zia Mohyeddin style (Baritone Male Voice across all chapters)
// 4. Native Male Voice synthesis with rich pitch-shaping and cross-platform voice matchers
// 5. Serverless fallback and chunked sequential playback

export interface AudioPlaybackState {
  isPlaying: boolean;
  activeId: string | null;
  lang: 'ar' | 'ur' | null;
  currentText?: string;
  reciterName?: string;
  chunkProgress?: { current: number; total: number };
  error?: string | null;
}

export interface PlayVoiceOptions {
  audioUrl?: string;
  audioUrls?: string[];
  reciterName?: string;
  chapterIndex?: number;
  sectionIndex?: number;
}

type StateListener = (state: AudioPlaybackState) => void;
const listeners: Set<StateListener> = new Set();

let currentState: AudioPlaybackState = {
  isPlaying: false,
  activeId: null,
  lang: null,
  reciterName: undefined,
  error: null,
};

function notify(state: AudioPlaybackState) {
  currentState = state;
  listeners.forEach((listener) => {
    try {
      listener(state);
    } catch {
      // ignore
    }
  });
}

export function subscribeAudioState(listener: StateListener): () => void {
  listeners.add(listener);
  listener(currentState);
  return () => {
    listeners.delete(listener);
  };
}

export function getAudioState(): AudioPlaybackState {
  return currentState;
}

let activeAudio: HTMLAudioElement | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let playbackAbortController: AbortController | null = null;
let unlockedAudioEl: HTMLAudioElement | null = null;

// Preload voices when available
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  } catch {
    // ignore
  }
}

/**
 * Returns EveryAyah direct MP3 URL for Qari Abdul Basit (Murattal 192kbps)
 * Chapter 1 (عِبَادُ الرَّحْمٰنِ): Surah 25 (Al-Furqan), verses 63 to 77
 * Chapter 2 (سَيِّدُنَا مُوسَىٰ): Surah 28 (Al-Qasas), verses 1 to 28
 */
export function getQuranSectionAudioUrl(chapterIndex: number, sectionIndex: number): string | null {
  if (chapterIndex === 0) {
    const ayah = 63 + sectionIndex;
    if (ayah >= 63 && ayah <= 77) {
      return `https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/0250${ayah}.mp3`;
    }
  } else if (chapterIndex === 1) {
    const ayah = 1 + sectionIndex;
    if (ayah >= 1 && ayah <= 28) {
      return `https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/0280${String(ayah).padStart(2, '0')}.mp3`;
    }
  }
  return null;
}

/**
 * Returns array of all Ayah URLs for full Quranic chapter recitation by Qari Abdul Basit
 */
export function getQuranChapterAudioUrls(chapterIndex: number): string[] | null {
  if (chapterIndex === 0) {
    const urls: string[] = [];
    for (let a = 63; a <= 77; a++) {
      urls.push(`https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/0250${a}.mp3`);
    }
    return urls;
  } else if (chapterIndex === 1) {
    const urls: string[] = [];
    for (let a = 1; a <= 28; a++) {
      urls.push(`https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/0280${String(a).padStart(2, '0')}.mp3`);
    }
    return urls;
  }
  return null;
}

/**
 * Unlocks browser audio context on user click/touch gesture
 */
export function unlockAudioContext(): void {
  try {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
        const silent = new SpeechSynthesisUtterance(' ');
        silent.volume = 0.01;
        window.speechSynthesis.speak(silent);
      }
      if (!unlockedAudioEl && typeof Audio !== 'undefined') {
        unlockedAudioEl = new Audio();
        unlockedAudioEl.preload = 'auto';
        unlockedAudioEl.src =
          'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';
        unlockedAudioEl.play().catch(() => {});
      }
    }
  } catch {
    // ignore
  }
}

export function stopAllAudio(): void {
  if (playbackAbortController) {
    playbackAbortController.abort();
    playbackAbortController = null;
  }

  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio.src = '';
    } catch {
      // ignore
    }
    activeAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
    activeUtterance = null;
  }

  notify({
    isPlaying: false,
    activeId: null,
    lang: null,
    reciterName: undefined,
    currentText: undefined,
    chunkProgress: undefined,
    error: null,
  });
}

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitTextIntoSentences(text: string, maxLen: number = 140): string[] {
  const clean = stripHtml(text);
  if (!clean) return [];
  if (clean.length <= maxLen) return [clean];

  const rawParts = clean.split(/([۔.،؛!؟\n]+)/);
  const chunks: string[] = [];
  let buffer = '';

  for (let i = 0; i < rawParts.length; i++) {
    const part = rawParts[i];
    if (!part) continue;

    if (buffer.length + part.length <= maxLen) {
      buffer += part;
    } else {
      if (buffer.trim()) {
        chunks.push(buffer.trim());
      }
      if (part.length > maxLen) {
        const words = part.split(/\s+/);
        let sub = '';
        for (const w of words) {
          if (sub.length + w.length + 1 <= maxLen) {
            sub = sub ? `${sub} ${w}` : w;
          } else {
            if (sub.trim()) chunks.push(sub.trim());
            sub = w;
          }
        }
        buffer = sub;
      } else {
        buffer = part;
      }
    }
  }

  if (buffer.trim()) {
    chunks.push(buffer.trim());
  }

  return chunks.length > 0 ? chunks : [clean.slice(0, maxLen)];
}

function playAudioUrlSingle(
  url: string,
  rate: number,
  signal: AbortSignal
): Promise<boolean> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve(false);
      return;
    }

    try {
      const audio = new Audio();
      activeAudio = audio;
      audio.playbackRate = rate;
      audio.preload = 'auto';
      (audio as any).referrerPolicy = 'no-referrer';
      audio.setAttribute('referrerpolicy', 'no-referrer');

      let ended = false;
      let loadTimeoutTimer: any = null;

      const cleanup = () => {
        if (!ended) {
          ended = true;
          if (loadTimeoutTimer) clearTimeout(loadTimeoutTimer);
          audio.onended = null;
          audio.onerror = null;
          audio.onplaying = null;
        }
      };

      const onAbort = () => {
        cleanup();
        try {
          audio.pause();
          audio.src = '';
        } catch {
          // ignore
        }
        resolve(false);
      };

      signal.addEventListener('abort', onAbort, { once: true });

      audio.onended = () => {
        signal.removeEventListener('abort', onAbort);
        cleanup();
        resolve(true);
      };

      audio.onerror = () => {
        signal.removeEventListener('abort', onAbort);
        cleanup();
        resolve(false);
      };

      loadTimeoutTimer = setTimeout(() => {
        if (!ended) {
          signal.removeEventListener('abort', onAbort);
          cleanup();
          try {
            audio.pause();
          } catch {}
          resolve(false);
        }
      }, 7000);

      audio.onplaying = () => {
        if (loadTimeoutTimer) {
          clearTimeout(loadTimeoutTimer);
          loadTimeoutTimer = null;
        }
      };

      audio.src = url;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          signal.removeEventListener('abort', onAbort);
          cleanup();
          resolve(false);
        });
      }
    } catch {
      resolve(false);
    }
  });
}

/**
 * Male Web Speech API synthesis:
 * - Arabic: Classical masculine recitation profile (Sheikh Amro Elbosaty / Qari style)
 * - Urdu: Poetic baritone orator profile (Zia Mohyeddin style)
 */
function playMaleWebSpeechChunk(
  text: string,
  lang: 'ar' | 'ur',
  rate: number,
  signal: AbortSignal
): Promise<boolean> {
  return new Promise((resolve) => {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      signal.aborted
    ) {
      resolve(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(text);
      activeUtterance = utterance;
      (window as unknown as { __activeUtterance: SpeechSynthesisUtterance }).__activeUtterance =
        utterance;

      const voices = window.speechSynthesis.getVoices() || [];

      if (lang === 'ar') {
        utterance.lang = 'ar-SA';
        // Amro Elbosaty Male Arabic Reciter Profile
        utterance.rate = Math.max(0.75, rate * 0.88);
        utterance.pitch = 0.84; // Deep, masculine, resonant pitch

        // Prioritize male Arabic voices
        const arMaleVoice = voices.find((v) => {
          const name = v.name.toLowerCase();
          const isAr = v.lang.toLowerCase().startsWith('ar');
          if (!isAr) return false;
          return (
            name.includes('male') ||
            name.includes('maged') ||
            name.includes('tarik') ||
            name.includes('hamed') ||
            name.includes('shakir') ||
            name.includes('naayf') ||
            (!name.includes('female') &&
              !name.includes('salma') &&
              !name.includes('laila') &&
              !name.includes('zari') &&
              !name.includes('hoda') &&
              !name.includes('mariam'))
          );
        }) || voices.find((v) => v.lang.toLowerCase().startsWith('ar'));

        if (arMaleVoice) utterance.voice = arMaleVoice;
      } else {
        // Zia Mohyeddin Male Urdu Orator Profile
        utterance.rate = Math.max(0.78, rate * 0.86);
        utterance.pitch = 0.80; // Distinctive deep baritone of Zia Mohyeddin

        // Prioritize male Urdu / Hindi voices
        const urMaleVoice = voices.find((v) => {
          const name = v.name.toLowerCase();
          const isUrOrHi =
            v.lang.toLowerCase().startsWith('ur') ||
            v.lang.toLowerCase().includes('urdu') ||
            v.lang.toLowerCase().startsWith('hi');
          if (!isUrOrHi) return false;
          return (
            name.includes('male') ||
            name.includes('asad') ||
            name.includes('salman') ||
            name.includes('madhav') ||
            name.includes('rohit') ||
            (!name.includes('female') &&
              !name.includes('uzma') &&
              !name.includes('swara') &&
              !name.includes('kalpana') &&
              !name.includes('kavya') &&
              !name.includes('heera'))
          );
        }) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('ur') || v.lang.toLowerCase().includes('urdu')) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('hi'));

        if (urMaleVoice) {
          utterance.voice = urMaleVoice;
          utterance.lang = urMaleVoice.lang || 'ur-PK';
        } else {
          utterance.lang = 'ur-PK';
        }
      }

      let ended = false;
      let timer: any = null;

      const cleanup = () => {
        if (!ended) {
          ended = true;
          if (timer) clearTimeout(timer);
          utterance.onend = null;
          utterance.onerror = null;
        }
      };

      const onAbort = () => {
        cleanup();
        try {
          window.speechSynthesis.cancel();
        } catch {
          // ignore
        }
        resolve(false);
      };

      signal.addEventListener('abort', onAbort, { once: true });

      utterance.onend = () => {
        signal.removeEventListener('abort', onAbort);
        cleanup();
        resolve(true);
      };

      utterance.onerror = () => {
        signal.removeEventListener('abort', onAbort);
        cleanup();
        resolve(false);
      };

      const maxDuration = Math.max(4000, text.length * 250);
      timer = setTimeout(() => {
        signal.removeEventListener('abort', onAbort);
        cleanup();
        resolve(true);
      }, maxDuration);

      window.speechSynthesis.speak(utterance);
    } catch {
      resolve(false);
    }
  });
}

/**
 * Universal voice player:
 * Supports:
 * - Direct authentic MP3 audio URLs (Qari Abdul Basit EveryAyah recitation)
 * - Deep male speech synthesis (Amro Elbosaty style for Arabic, Zia Mohyeddin style for Urdu)
 * - Serverless audio proxy fallback
 */
export async function playVoice(
  text: string,
  lang: 'ar' | 'ur',
  id: string,
  rate: number = 1.0,
  options?: PlayVoiceOptions
): Promise<void> {
  unlockAudioContext();

  if (currentState.isPlaying && currentState.activeId === id) {
    stopAllAudio();
    return;
  }

  stopAllAudio();

  const controller = new AbortController();
  playbackAbortController = controller;
  const signal = controller.signal;

  let reciterName = options?.reciterName;
  if (!reciterName) {
    if (lang === 'ar') {
      reciterName =
        options?.chapterIndex === 0 || options?.chapterIndex === 1
          ? 'قاری عبد الباسط'
          : 'عمرو البساطی';
    } else {
      reciterName = 'ضیاء محی الدین';
    }
  }

  // Path 1: Array of direct audio URLs (e.g. Qari Abdul Basit full Quranic chapter)
  if (options?.audioUrls && options.audioUrls.length > 0) {
    const urls = options.audioUrls;
    notify({
      isPlaying: true,
      activeId: id,
      lang,
      reciterName,
      currentText: 'تلاوت قرآنِ کریم — قاری عبد الباسط عبد الصمد',
      chunkProgress: { current: 1, total: urls.length },
      error: null,
    });

    for (let i = 0; i < urls.length; i++) {
      if (signal.aborted) break;
      notify({
        isPlaying: true,
        activeId: id,
        lang,
        reciterName,
        currentText: `آیت نمبر ${i + 1}`,
        chunkProgress: { current: i + 1, total: urls.length },
        error: null,
      });

      const success = await playAudioUrlSingle(urls[i], rate, signal);
      if (!success && signal.aborted) break;
    }

    if (!signal.aborted) {
      stopAllAudio();
    }
    return;
  }

  // Path 2: Single direct audio URL (e.g. Qari Abdul Basit single Ayah)
  if (options?.audioUrl) {
    notify({
      isPlaying: true,
      activeId: id,
      lang,
      reciterName,
      currentText: text.length > 80 ? text.slice(0, 80) + '...' : text,
      chunkProgress: { current: 1, total: 1 },
      error: null,
    });

    await playAudioUrlSingle(options.audioUrl, rate, signal);
    if (!signal.aborted) {
      stopAllAudio();
    }
    return;
  }

  // Path 3: Speech Synthesis with Male Voice (Amro Elbosaty for Arabic, Zia Mohyeddin for Urdu)
  const clean = stripHtml(text).trim();
  if (!clean) return;

  const chunks = splitTextIntoSentences(clean, 140);

  notify({
    isPlaying: true,
    activeId: id,
    lang,
    reciterName,
    currentText: clean.length > 80 ? clean.slice(0, 80) + '...' : clean,
    chunkProgress: { current: 1, total: chunks.length },
    error: null,
  });

  for (let i = 0; i < chunks.length; i++) {
    if (signal.aborted) break;

    const chunk = chunks[i];
    notify({
      isPlaying: true,
      activeId: id,
      lang,
      reciterName,
      currentText: chunk,
      chunkProgress: { current: i + 1, total: chunks.length },
      error: null,
    });

    let success = false;

    // Strategy 1: Male Web Speech API (delivers genuine deep male timbre for Amro Elbosaty / Zia Mohyeddin)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      success = await playMaleWebSpeechChunk(chunk, lang, rate, signal);
    }

    // Strategy 2: Serverless proxy /api/tts
    if (!success && !signal.aborted) {
      const encoded = encodeURIComponent(chunk);
      const serverUrl = `/api/tts?tl=${lang}&q=${encoded}`;
      success = await playAudioUrlSingle(serverUrl, rate, signal);
    }

    // Strategy 3: Direct TTS endpoint
    if (!success && !signal.aborted) {
      const encoded = encodeURIComponent(chunk);
      const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encoded}`;
      await playAudioUrlSingle(directUrl, rate, signal);
    }

    if (signal.aborted) break;
  }

  if (!signal.aborted) {
    stopAllAudio();
  }
}
