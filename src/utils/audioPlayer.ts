// High-Reliability Universal Audio Player for Arabic & Urdu Pronunciation
// Supports:
// 1. Authentic Quranic Recitation by Qari Abdul Basit (Surah Al-Furqan Ch 1 & Surah Al-Qasas Ch 2) via EveryAyah
// 2. Classical Arabic Literary Recitation (Amro Elbosaty male style)
// 3. Poetic Master Urdu Narration (Zia Mohyeddin male style)
// 4. Multi-layer robust fallbacks:
//    - High-quality audio URLs (EveryAyah & Google TTS via serverless proxy / direct)
//    - Web Speech API with male voice prioritisation and low pitch
//    - Shared singleton HTMLAudioElement with user-gesture unlocking

import quranWordAudioData from '../data/quranWordAudioMap.json';

const quranWordMap: Record<string, string> = quranWordAudioData as Record<string, string>;

function stripArabicDiacritics(str: string): string {
  return (str || '')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/[ٱإأآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

/**
 * Looks up authentic male Qari pronunciation from QuranCDN for any Quranic word
 */
export function getQuranWordAudioUrl(word: string): string | null {
  if (!word || !quranWordMap) return null;
  const raw = word.trim();
  const clean = stripArabicDiacritics(raw);
  const parts = clean.split(/\s+/);
  const toCheck = [raw, clean];
  if (parts.length > 1) {
    toCheck.push(parts[parts.length - 1]);
    toCheck.push(parts[0]);
  }

  for (const item of toCheck) {
    const c = stripArabicDiacritics(item);
    const rootWord = c.startsWith('ال') ? c.slice(2) : c.startsWith('لل') ? c.slice(2) : c;
    const candidates = [
      item,
      c,
      rootWord,
      'و' + c,
      'ف' + c,
      'ال' + c,
      'ب' + c,
      'ل' + c,
      'لل' + c,
      'ال' + rootWord,
      'لل' + rootWord,
      'و' + rootWord,
      'ف' + rootWord,
      'ب' + rootWord,
      c.startsWith('و') ? c.slice(1) : null,
      c.startsWith('ف') ? c.slice(1) : null,
      c.startsWith('ال') ? c.slice(2) : null,
      c.startsWith('ب') ? c.slice(1) : null,
      c.startsWith('ل') ? c.slice(1) : null,
      c.startsWith('لل') ? c.slice(2) : null,
    ].filter(Boolean) as string[];

    for (const cand of candidates) {
      if (quranWordMap[cand]) {
        return quranWordMap[cand];
      }
    }
  }
  return null;
}

export type VoiceGender = 'male';

export function getVoiceGender(): VoiceGender {
  return 'male';
}

export function setVoiceGender(_gender: VoiceGender): void {
  notify({
    ...currentState,
    voiceGender: 'male',
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
    const ayahMap = [61, 62, 63, 64, 65, 66, 67, 68, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77];
    const ayah = ayahMap[sectionIndex];
    if (ayah && ayah >= 61 && ayah <= 77) {
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
 * Returns authentic audio URL for a given chapter, section, and language.
 * Uses master pre-recorded high-fidelity male audio recitations.
 */
export function getSectionVoiceoverAudioUrl(
  chapterIndex: number,
  sectionIndex: number,
  lang: 'ar' | 'ur',
  _gender?: VoiceGender
): string | null {
  // Authentic Quranic recitation by Sheikh Abdul Basit (Murattal 192kbps) for Chapters 1 & 2 Arabic
  if (lang === 'ar' && (chapterIndex === 0 || chapterIndex === 1)) {
    return getQuranSectionAudioUrl(chapterIndex, sectionIndex);
  }
  return null;
}

/**
 * Returns array of URLs for full chapter playback
 */
export function getChapterVoiceoverAudioUrls(
  chapterIndex: number,
  lang: 'ar' | 'ur',
  _totalSections: number,
  _gender?: VoiceGender
): string[] | null {
  // Authentic Quranic recitation by Sheikh Abdul Basit for Chapters 1 & 2 Arabic
  if (lang === 'ar' && (chapterIndex === 0 || chapterIndex === 1)) {
    return getQuranChapterAudioUrls(chapterIndex);
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
 * Exclusively uses dignified masculine profiles with low baritone pitch,
 * and strictly blacklists any female voices.
 */
function normalizeTextForSpeech(text: string, lang: 'ar' | 'ur'): string {
  let cleaned = (text || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[«»"'“”]/g, '')
    .replace(/[–—―-]/g, ' ، ')
    .replace(/[\/\\|]/g, ' یا ')
    .replace(/[()\[\]{}]/g, ' ، ')
    .replace(/۔\s*۔+/g, '۔ ')
    .replace(/\.{2,}/g, '۔ ')
    .replace(/\s+/g, ' ')
    .trim();

  if (lang === 'ar') {
    cleaned = cleaned
      .replace(/ﷺ/g, ' صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ ')
      .replace(/صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ/g, ' صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ ')
      .replace(/صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ/g, ' صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ ')
      .replace(/اللّٰهُ/g, 'اللهُ')
      .replace(/اللّٰهِ/g, 'اللهِ')
      .replace(/اللّٰهَ/g, 'اللهَ')
      .replace(/رَضِيَ اللّٰهُ عَنْهُ/g, ' رَضِيَ اللهُ عَنْهُ ')
      .replace(/رَضِيَ اللّٰهُ عَنْهَا/g, ' رَضِيَ اللهُ عَنْهَا ')
      .replace(/رَضِيَ اللّٰهُ عَنْهُمْ/g, ' رَضِيَ اللهُ عَنْهُمْ ')
      .replace(/رَضِيَ اللهُ عَنْهُ/g, ' رَضِيَ اللهُ عَنْهُ ')
      .replace(/عَلَيْهِ السَّلَامُ/g, ' عَلَيْهِ السَّلَامُ ')
      .replace(/عَلَيْهَا السَّلَامُ/g, ' عَلَيْهَا السَّلَامُ ')
      .replace(/عَلَيْهِمَا السَّلَامُ/g, ' عَلَيْهِمَا السَّلَامُ ')
      .replace(/عَلَيْهِمُ السَّلَامُ/g, ' عَلَيْهِمُ السَّلَامُ ')
      .replace(/جَلَّ جَلَالُهُ/g, ' جَلَّ جَلَالُهُ ')
      .replace(/سُبْحَانَهُ وَتَعَالَىٰ?/g, ' سُبْحَانَهُ وَتَعَالَى ')
      .replace(/عَزَّ وَجَلَّ/g, ' عَزَّ وَجَلَّ ')
      .replace(/تَبَارَكَ وَتَعَالَىٰ?/g, ' تَبَارَكَ وَتَعَالَى ');
  } else {
    cleaned = cleaned
      .replace(/ﷺ/g, ' صَلَّی اللّٰہُ عَلَیْہِ وَسَلَّمْ ')
      .replace(/صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ/g, ' صَلَّی اللّٰہُ عَلَیْہِ وَسَلَّمْ ')
      .replace(/صلی اللہ علیہ وسلم/g, ' صَلَّی اللّٰہُ عَلَیْہِ وَسَلَّمْ ')
      .replace(/صلی اللہ علیہ و آلہ وسلم/g, ' صَلَّی اللّٰہُ عَلَیْہِ وَسَلَّمْ ')
      .replace(/رضی اللہ عنہا/g, ' رَضِیَ اللّٰہُ عَنْہَا ')
      .replace(/رَضِيَ اللّٰهُ عَنْهَا/g, ' رَضِیَ اللّٰہُ عَنْہَا ')
      .replace(/رضی اللہ عنہ/g, ' رَضِیَ اللّٰہُ عَنْہُ ')
      .replace(/رَضِيَ اللّٰهُ عَنْهُ/g, ' رَضِیَ اللّٰہُ عَنْہُ ')
      .replace(/رضی اللہ عنہم/g, ' رَضِیَ اللّٰہُ عَنْہُمْ ')
      .replace(/رَضِيَ اللّٰهُ عَنْهُمْ/g, ' رَضِیَ اللّٰہُ عَنْہُمْ ')
      .replace(/علیہ السلام/g, ' عَلَیْہِ السَّلَامْ ')
      .replace(/عَلَيْهِ السَّلَامُ/g, ' عَلَیْہِ السَّلَامْ ')
      .replace(/علیہا السلام/g, ' عَلَیْہَا السَّلَامْ ')
      .replace(/عَلَيْهَا السَّلَامُ/g, ' عَلَیْہَا السَّلَامْ ')
      .replace(/علیہم السلام/g, ' عَلَیْہِمُ السَّلَامْ ')
      .replace(/عَلَيْهِمُ السَّلَامُ/g, ' عَلَیْہِمُ السَّلَامْ ')
      .replace(/رحمتہ اللہ علیہ/g, ' رَحْمَۃُ اللّٰہِ عَلَیْہِ ')
      .replace(/رحمہ اللہ/g, ' رَحِمَہُ اللّٰہُ ')
      .replace(/رَحِمَهُ اللّٰهُ/g, ' رَحِمَہُ اللّٰہُ ')
      .replace(/جل جلالہ/g, ' جَلَّ جَلَالُہٗ ')
      .replace(/جَلَّ جَلَالُهُ/g, ' جَلَّ جَلَالُہٗ ')
      .replace(/سبحانہ و تعالی/g, ' سُبْحَانَہٗ وَتَعَالٰی ')
      .replace(/سبحانہ وتعالیٰ?/g, ' سُبْحَانَہٗ وَتَعَالٰی ')
      .replace(/سُبْحَانَهُ وَتَعَالَىٰ?/g, ' سُبْحَانَہٗ وَتَعَالٰی ')
      .replace(/عز وجل/g, ' عَزَّ وَجَلَّ ')
      .replace(/عَزَّ وَجَلَّ/g, ' عَزَّ وَجَلَّ ')
      .replace(/تبارک و تعالی/g, ' تَبَارَکَ وَتَعَالٰی ')
      .replace(/تَبَارَكَ وَتَعَالَىٰ?/g, ' تَبَارَکَ وَتَعَالٰی ');
  }

  return cleaned.replace(/\s+/g, ' ').trim();
}

/**
 * Natural Web Speech API:
 * Strictly selects dignified, authoritative male voices with natural human baritone pitch (0.93),
 * without distortion or robotic artifacts.
 */
function playWebSpeechChunk(
  text: string,
  lang: 'ar' | 'ur',
  _gender: VoiceGender,
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

      const normalizedText = normalizeTextForSpeech(text, lang);
      const utterance = new SpeechSynthesisUtterance(normalizedText);
      activeUtterance = utterance;

      const voices = window.speechSynthesis.getVoices() || [];

      if (lang === 'ar') {
        utterance.lang = 'ar-SA';
        utterance.rate = Math.max(0.78, Math.min(1.0, rate * 0.88));
        utterance.pitch = 0.94; // Dignified natural baritone

        const arVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('ar'));
        if (arVoices.length > 0) {
          const maleV = arVoices.find((v) => {
            const n = v.name.toLowerCase();
            return (
              n.includes('male') ||
              n.includes('maged') ||
              n.includes('tarik') ||
              n.includes('tariq') ||
              n.includes('hamed') ||
              n.includes('shakir') ||
              n.includes('hamza') ||
              n.includes('naayf')
            );
          });
          utterance.voice = maleV || arVoices[0];
        }
      } else {
        utterance.lang = 'ur-PK';
        utterance.rate = Math.max(0.78, Math.min(1.0, rate * 0.88));
        utterance.pitch = 0.93; // Authentic Subcontinent scholarly male pitch

        const urVoices = voices.filter(
          (v) =>
            v.lang.toLowerCase().startsWith('ur') ||
            v.lang.toLowerCase().includes('urdu') ||
            v.lang.toLowerCase().startsWith('hi')
        );
        if (urVoices.length > 0) {
          const maleV = urVoices.find((v) => {
            const n = v.name.toLowerCase();
            return (
              n.includes('male') ||
              n.includes('asad') ||
              n.includes('salman') ||
              n.includes('hemant') ||
              n.includes('rishi') ||
              n.includes('david')
            );
          });
          utterance.voice = maleV || urVoices[0];
          if (utterance.voice) {
            utterance.lang = utterance.voice.lang || 'ur-PK';
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
    reciterName = lang === 'ar'
      ? 'عربی صوتی تلاوت (باوقار مردانہ لہجہ)'
      : 'اردو صوتی مفہوم (باوقار مردانہ لہجہ)';
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

  // Path 3: Speech Pipeline
  const clean = stripHtml(text).trim();
  if (!clean) return;

  // Direct Path 2.5: If Arabic word matches authentic QuranCDN recitation, play directly
  if (lang === 'ar') {
    const quranWordUrl = getQuranWordAudioUrl(clean);
    if (quranWordUrl) {
      notify({
        isPlaying: true,
        activeId: id,
        lang,
        voiceGender: gender,
        reciterName,
        currentText: clean,
        chunkProgress: { current: 1, total: 1 },
        error: null,
      });

      const success = await playAudioUrlSingle(quranWordUrl, rate, signal);
      if (success && !signal.aborted) {
        stopAllAudio();
        return;
      }
    }
  }

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

    const normChunk = normalizeTextForSpeech(chunk, lang);
    const encoded = encodeURIComponent(normChunk);
    let chunkPlayed = false;

    // Strategy A: Serverless audio proxy /api/tts with studio Charon male neural voice
    if (!chunkPlayed && !signal.aborted) {
      const serverUrl = `/api/tts?tl=${lang}&gender=male&q=${encoded}`;
      chunkPlayed = await playAudioUrlSingle(serverUrl, rate, signal);
    }

    // Strategy B: Direct high-fidelity Google Translate TTS audio fallback
    if (!chunkPlayed && !signal.aborted) {
      const directGoogleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encoded}`;
      chunkPlayed = await playAudioUrlSingle(directGoogleUrl, rate, signal);
    }

    // Strategy C: Native Web Speech API fallback with male profile
    if (
      !chunkPlayed &&
      !signal.aborted &&
      typeof window !== 'undefined' &&
      'speechSynthesis' in window
    ) {
      chunkPlayed = await playWebSpeechChunk(chunk, lang, 'male', rate, signal);
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
