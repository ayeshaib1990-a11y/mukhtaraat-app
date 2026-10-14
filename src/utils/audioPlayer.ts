// High-Reliability Universal Audio Player for Arabic & Urdu Pronunciation
// Supports:
// 1. Authentic Quranic Recitation by Qari Abdul Basit (Surah Al-Furqan Ch 1 & Surah Al-Qasas Ch 2) via EveryAyah
// 2. Classical Arabic Literary Recitation (Amro Elbosaty male style)
// 3. Poetic Master Urdu Narration (Zia Mohyeddin male style)
// 4. Multi-layer robust fallbacks:
//    - High-quality audio URLs (EveryAyah & Google TTS via serverless proxy / direct)
//    - Web Speech API with male voice prioritisation and low pitch
//    - Shared singleton HTMLAudioElement with user-gesture unlocking

export type VoiceGender = 'female' | 'male';

export function getVoiceGender(): VoiceGender {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('app_voice_gender');
      if (saved === 'female' || saved === 'male') return saved;
    } catch {
      // ignore
    }
  }
  return 'female'; // Default to strong female voice per user request
}

export function setVoiceGender(gender: VoiceGender): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('app_voice_gender', gender);
    } catch {
      // ignore
    }
  }
  notify({
    ...currentState,
    voiceGender: gender,
  });
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  activeId: string | null;
  lang: 'ar' | 'ur' | null;
  voiceGender?: VoiceGender;
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
  gender?: VoiceGender;
}

type StateListener = (state: AudioPlaybackState) => void;
const listeners: Set<StateListener> = new Set();

let currentState: AudioPlaybackState = {
  isPlaying: false,
  activeId: null,
  lang: null,
  voiceGender: getVoiceGender(),
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

// Global singleton audio element & abort controller
let globalAudio: HTMLAudioElement | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let playbackAbortController: AbortController | null = null;
let preferredStrategy: 'audioUrl' | 'speechSynthesis' = 'audioUrl';

function getOrCreateAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!globalAudio) {
    try {
      globalAudio = new Audio();
      globalAudio.preload = 'auto';
      (globalAudio as any).referrerPolicy = 'no-referrer';
      globalAudio.setAttribute('referrerpolicy', 'no-referrer');
    } catch {
      // ignore
    }
  }
  return globalAudio;
}

// Preload voices when available
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.getVoices();
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
    const ayah = 61 + sectionIndex; // Section 0 is verse 61 ("تَبَارَكَ الَّذِي جَعَلَ فِي السَّمَاءِ بُرُوجًا") through verse 77
    if (ayah >= 61 && ayah <= 77) {
      return `https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/0250${ayah}.mp3`;
    }
  } else if (chapterIndex === 1) {
    const ayah = 1 + sectionIndex; // Section 0 is verse 1 ("طسٓمٓ") through verse 28
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
    for (let a = 61; a <= 77; a++) {
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
 * Returns authentic male audio URL for a given chapter, section, and language.
 * - Chapters 1 & 2 Arabic: EveryAyah Qari Abdul Basit recitation
 * - Chapter 3 Arabic (Hadith): Dedicated male Hadith recitation
 * - Chapters 1, 2, 3 Urdu: Dedicated male Urdu translation voiceover
 */
/**
 * Returns authentic audio URL for a given chapter, section, language, and gender.
 * - When female voice is selected, dynamic studio audio is generated via /api/tts?gender=female
 * - When male voice is selected, master pre-recorded files are prioritized where available
 */
export function getSectionVoiceoverAudioUrl(
  chapterIndex: number,
  sectionIndex: number,
  lang: 'ar' | 'ur',
  gender?: VoiceGender
): string | null {
  const currentGender = gender || getVoiceGender();

  // If user selected Strong Female voice, dynamically stream via /api/tts?gender=female
  if (currentGender === 'female') {
    return null;
  }

  // Pre-recorded master Male audio sources:
  if (lang === 'ar') {
    if (chapterIndex === 0 || chapterIndex === 1) {
      return getQuranSectionAudioUrl(chapterIndex, sectionIndex);
    }
    if (chapterIndex === 2) {
      return `/audio/ch2_ar_sec${sectionIndex}.mp3`;
    }
    if (chapterIndex === 3) {
      return `/audio/ch3_ar_sec${sectionIndex}.mp3`;
    }
  } else {
    if (chapterIndex === 0) {
      return `/audio/ch0_ur_sec${sectionIndex}.mp3`;
    }
    if (chapterIndex === 1) {
      return `/audio/ch1_ur_sec${sectionIndex}.mp3`;
    }
    if (chapterIndex === 2) {
      return `/audio/ch2_ur_sec${sectionIndex}.mp3`;
    }
    if (chapterIndex === 3) {
      return `/audio/ch3_ur_sec${sectionIndex}.mp3`;
    }
  }
  return null;
}

/**
 * Returns array of URLs for full chapter playback
 */
export function getChapterVoiceoverAudioUrls(
  chapterIndex: number,
  lang: 'ar' | 'ur',
  totalSections: number,
  gender?: VoiceGender
): string[] | null {
  const currentGender = gender || getVoiceGender();
  if (currentGender === 'female') {
    return null; // Will stream full chapter via sequential studio chunks
  }

  if (lang === 'ar') {
    if (chapterIndex === 0 || chapterIndex === 1) {
      return getQuranChapterAudioUrls(chapterIndex);
    }
    if (chapterIndex === 2 || chapterIndex === 3) {
      const urls: string[] = [];
      for (let i = 0; i < totalSections; i++) {
        urls.push(`/audio/ch${chapterIndex}_ar_sec${i}.mp3`);
      }
      return urls;
    }
  } else {
    if (chapterIndex >= 0 && chapterIndex <= 3) {
      const urls: string[] = [];
      for (let i = 0; i < totalSections; i++) {
        urls.push(`/audio/ch${chapterIndex}_ur_sec${i}.mp3`);
      }
      return urls;
    }
  }
  return null;
}

/**
 * Synchronous Audio unlocker executed directly on user touch/click gesture.
 * Crucial for iOS Safari, Android Chrome, and modern desktop browser autoplay policies.
 */
export function unlockAudioContext(): void {
  try {
    const audio = getOrCreateAudio();
    if (audio) {
      // Warm up singleton audio element with a tiny silent data URI
      if (!audio.src || audio.src === '' || audio.paused) {
        audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';
        const p = audio.play();
        if (p !== undefined) {
          p.catch(() => {});
        }
      }
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
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

  if (globalAudio) {
    try {
      globalAudio.pause();
      globalAudio.currentTime = 0;
      globalAudio.removeAttribute('src');
      globalAudio.load();
    } catch {
      // ignore
    }
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

/**
 * Plays an audio URL using the singleton HTMLAudioElement.
 * Includes timeout safeguards, user abort handlers, and error catching.
 */
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

    const audio = getOrCreateAudio();
    if (!audio) {
      resolve(false);
      return;
    }

    try {
      audio.playbackRate = rate;
      audio.src = url;

      let ended = false;
      let loadTimeoutTimer: any = null;

      const cleanup = () => {
        if (!ended) {
          ended = true;
          if (loadTimeoutTimer) {
            clearTimeout(loadTimeoutTimer);
            loadTimeoutTimer = null;
          }
          audio.onended = null;
          audio.onerror = null;
          audio.onplaying = null;
        }
      };

      const onAbort = () => {
        cleanup();
        try {
          audio.pause();
          audio.removeAttribute('src');
          audio.load();
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

      audio.onplaying = () => {
        if (loadTimeoutTimer) {
          clearTimeout(loadTimeoutTimer);
          loadTimeoutTimer = null;
        }
      };

      // 25 second timeout for pristine server-side neural male generation
      loadTimeoutTimer = setTimeout(() => {
        if (!ended) {
          signal.removeEventListener('abort', onAbort);
          cleanup();
          try {
            audio.pause();
          } catch {
            // ignore
          }
          resolve(false);
        }
      }, 25000);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
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
 * Web Speech API fallback:
 * Supports both pristine Female and resonant Male profiles.
 */
function playWebSpeechChunk(
  text: string,
  lang: 'ar' | 'ur',
  gender: VoiceGender,
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

      const voices = window.speechSynthesis.getVoices() || [];

      if (lang === 'ar') {
        utterance.lang = 'ar-SA';
        utterance.rate = Math.max(0.75, rate * 0.90);
        utterance.pitch = gender === 'female' ? 1.05 : 0.50;

        const arVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('ar'));
        if (gender === 'female') {
          const arFemale = arVoices.find((v) => {
            const name = v.name.toLowerCase();
            return (
              name.includes('female') ||
              name.includes('hoda') ||
              name.includes('salma') ||
              name.includes('zeina') ||
              name.includes('mariam') ||
              name.includes('leila') ||
              name.includes('zari')
            );
          }) || arVoices[0];
          if (arFemale) utterance.voice = arFemale;
        } else {
          const arMale = arVoices.find((v) => {
            const name = v.name.toLowerCase();
            return (
              name.includes('male') ||
              name.includes('maged') ||
              name.includes('tarik') ||
              name.includes('hamed') ||
              name.includes('shakir') ||
              name.includes('naayf')
            );
          });
          if (arMale) utterance.voice = arMale;
        }
      } else {
        utterance.lang = 'ur-PK';
        utterance.rate = Math.max(0.75, rate * 0.88);
        utterance.pitch = gender === 'female' ? 1.05 : 0.50;

        const urVoices = voices.filter(
          (v) =>
            v.lang.toLowerCase().startsWith('ur') ||
            v.lang.toLowerCase().includes('urdu') ||
            v.lang.toLowerCase().startsWith('hi')
        );
        if (gender === 'female') {
          const urFemale = urVoices.find((v) => {
            const name = v.name.toLowerCase();
            return (
              name.includes('female') ||
              name.includes('uzma') ||
              name.includes('swara') ||
              name.includes('kalpana') ||
              name.includes('ananya')
            );
          }) || urVoices[0];
          if (urFemale) {
            utterance.voice = urFemale;
            utterance.lang = urFemale.lang || 'ur-PK';
          }
        } else {
          const urMale = urVoices.find((v) => {
            const name = v.name.toLowerCase();
            return (
              name.includes('male') ||
              name.includes('asad') ||
              name.includes('salman') ||
              name.includes('madhav') ||
              name.includes('rohit')
            );
          });
          if (urMale) {
            utterance.voice = urMale;
            utterance.lang = urMale.lang || 'ur-PK';
          }
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

      const maxDuration = Math.max(3500, text.length * 200);
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
 * Prioritizes high-quality audio playback and automatically falls back to Web Speech synthesis
 * ensuring that sound is NEVER silent.
 */
export async function playVoice(
  text: string,
  lang: 'ar' | 'ur',
  id: string,
  rate: number = 1.0,
  options?: PlayVoiceOptions
): Promise<void> {
  // 1. Immediately unlock browser audio context on user gesture
  unlockAudioContext();

  // 2. If already playing this ID, stop and toggle off
  if (currentState.isPlaying && currentState.activeId === id) {
    stopAllAudio();
    return;
  }

  stopAllAudio();

  const controller = new AbortController();
  playbackAbortController = controller;
  const signal = controller.signal;

  const gender = options?.gender || getVoiceGender();

  let reciterName = options?.reciterName;
  if (!reciterName) {
    if (gender === 'female') {
      reciterName = lang === 'ar' ? 'عربی صوتی تلفظ' : 'اردو صوتی تلفظ';
    } else {
      reciterName = lang === 'ar' ? 'عربی صوتی تلفظ' : 'اردو صوتی تلفظ';
    }
  }

  // Path 1: Array of direct audio URLs (e.g. Master recitation)
  if (options?.audioUrls && options.audioUrls.length > 0) {
    const urls = options.audioUrls;
    notify({
      isPlaying: true,
      activeId: id,
      lang,
      voiceGender: gender,
      reciterName,
      currentText: lang === 'ar' ? 'تلاوتِ عربی کلام' : 'اردو ترجمہ و مفہوم',
      chunkProgress: { current: 1, total: urls.length },
      error: null,
    });

    for (let i = 0; i < urls.length; i++) {
      if (signal.aborted) break;
      notify({
        isPlaying: true,
        activeId: id,
        lang,
        voiceGender: gender,
        reciterName,
        currentText: `حصہ نمبر ${i + 1}`,
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

  // Path 2: Single direct audio URL
  if (options?.audioUrl) {
    notify({
      isPlaying: true,
      activeId: id,
      lang,
      voiceGender: gender,
      reciterName,
      currentText: text.length > 80 ? text.slice(0, 80) + '...' : text,
      chunkProgress: { current: 1, total: 1 },
      error: null,
    });

    const success = await playAudioUrlSingle(options.audioUrl, rate, signal);
    if (success && !signal.aborted) {
      stopAllAudio();
      return;
    }
  }

  // Path 3: Speech Pipeline (Serverless Studio Equalizer -> Web Speech Fallback)
  const clean = stripHtml(text).trim();
  if (!clean) return;

  const chunks = splitTextIntoSentences(clean, 95);

  notify({
    isPlaying: true,
    activeId: id,
    lang,
    voiceGender: gender,
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
      voiceGender: gender,
      reciterName,
      currentText: chunk,
      chunkProgress: { current: i + 1, total: chunks.length },
      error: null,
    });

    const encoded = encodeURIComponent(chunk);
    let chunkPlayed = false;

    // Strategy A: Serverless audio proxy /api/tts with studio equalization
    if (!chunkPlayed && !signal.aborted) {
      const serverUrl = `/api/tts?tl=${lang}&gender=${gender}&q=${encoded}`;
      chunkPlayed = await playAudioUrlSingle(serverUrl, rate, signal);
    }

    // Strategy B: Native Web Speech API fallback
    if (
      !chunkPlayed &&
      !signal.aborted &&
      typeof window !== 'undefined' &&
      'speechSynthesis' in window
    ) {
      chunkPlayed = await playWebSpeechChunk(chunk, lang, gender, rate, signal);
    }

    if (!chunkPlayed && !signal.aborted) {
      notify({
        ...currentState,
        error: 'آواز لوڈ نہیں ہو سکی، براہِ کرم انٹرنیٹ یا والیوم چیک کریں۔',
      });
      break;
    }

    if (signal.aborted) break;
  }

  if (!signal.aborted) {
    stopAllAudio();
  }
}
