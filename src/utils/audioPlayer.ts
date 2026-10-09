// High-Reliability Universal Audio Player for Arabic & Urdu Pronunciation
// Supports: Serverless /api/tts Proxy, No-Referrer Direct TTS Fallback,
// Native Web Speech Synthesis with Cross-Platform Voice Matcher,
// Chunked Sequential Playback for Entire Chapters, and Instant Error Recovery.

export interface AudioPlaybackState {
  isPlaying: boolean;
  activeId: string | null;
  lang: 'ar' | 'ur' | null;
  currentText?: string;
  chunkProgress?: { current: number; total: number };
  error?: string | null;
}

type StateListener = (state: AudioPlaybackState) => void;
const listeners: Set<StateListener> = new Set();

let currentState: AudioPlaybackState = {
  isPlaying: false,
  activeId: null,
  lang: null,
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

// Reusable unlocked audio element & warm-up for mobile/Safari autoplay restrictions
let unlockedAudioEl: HTMLAudioElement | null = null;
let preferredStrategy: 'proxy' | 'direct' | 'webspeech' = 'proxy';

// Preload voices when available
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    window.speechSynthesis.onvoiceschanged = () => {
      // Warm up voices cache
      window.speechSynthesis.getVoices();
    };
  } catch {
    // ignore
  }
}

/**
 * Unlocks browser audio context and Web Speech on user gesture (click/touch).
 * Must be executed synchronously in the click handler for iOS Safari / Mobile Chrome.
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
  // Abort any ongoing queue or async fetches
  if (playbackAbortController) {
    playbackAbortController.abort();
    playbackAbortController = null;
  }

  // Stop HTML audio
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

  // Stop SpeechSynthesis
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

/**
 * Split long Arabic or Urdu text into natural phrases/sentences of <= 140 chars.
 * Ensures the TTS provider receives crisp, natural segments without truncation.
 */
function splitTextIntoSentences(text: string, maxLen: number = 140): string[] {
  const clean = stripHtml(text);
  if (!clean) return [];
  if (clean.length <= maxLen) return [clean];

  // Split by common Arabic / Urdu / Latin sentence delimiters
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
        // Fallback: split long clause at words
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
 * Plays a single audio chunk via HTML Audio with timeout and no-referrer header
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

    try {
      const audio = new Audio();
      activeAudio = audio;
      audio.playbackRate = rate;
      audio.preload = 'auto';
      // Suppress referer so Google Translate does not block hotlinked streams
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

      // Set safety timeout of 3500ms for network response
      loadTimeoutTimer = setTimeout(() => {
        if (!ended) {
          signal.removeEventListener('abort', onAbort);
          cleanup();
          try {
            audio.pause();
          } catch {}
          resolve(false);
        }
      }, 3500);

      audio.onplaying = () => {
        // Audio is actively playing, clear load timeout
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
 * Web Speech API playback for a chunk with automatic language/voice fallbacks
 */
function playWebSpeechChunk(
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
        utterance.rate = Math.max(0.75, rate * 0.9);
        const arVoice = voices.find((v) =>
          v.lang.toLowerCase().startsWith('ar')
        );
        if (arVoice) utterance.voice = arVoice;
      } else {
        const urVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('ur') ||
            v.lang.toLowerCase().includes('urdu')
        );
        const hiVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('hi') ||
            v.lang.toLowerCase().includes('hindi')
        );

        if (urVoice) {
          utterance.voice = urVoice;
          utterance.lang = urVoice.lang || 'ur-PK';
        } else if (hiVoice) {
          utterance.voice = hiVoice;
          utterance.lang = hiVoice.lang || 'hi-IN';
        } else {
          utterance.lang = 'ur-PK';
        }
        utterance.rate = Math.max(0.8, rate * 0.95);
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

      // Safeguard against browser hanging on speech synthesis onend
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
 * Plays words, sentences, or multi-paragraph texts reliably across all browsers.
 * Chunking enables studio-quality speech for long passages without cutoff.
 */
export async function playVoice(
  text: string,
  lang: 'ar' | 'ur',
  id: string,
  rate: number = 1.0
): Promise<void> {
  // Always unlock browser audio context on user gesture immediately
  unlockAudioContext();

  // If already playing this ID, stop and toggle off
  if (currentState.isPlaying && currentState.activeId === id) {
    stopAllAudio();
    return;
  }

  stopAllAudio();

  const clean = stripHtml(text).trim();
  if (!clean) return;

  const controller = new AbortController();
  playbackAbortController = controller;
  const signal = controller.signal;

  const chunks = splitTextIntoSentences(clean, 140);

  notify({
    isPlaying: true,
    activeId: id,
    lang,
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
      currentText: chunk,
      chunkProgress: { current: i + 1, total: chunks.length },
      error: null,
    });

    const encoded = encodeURIComponent(chunk);
    let success = false;

    // Strategy 1: Serverless proxy /api/tts
    if (preferredStrategy === 'proxy' || preferredStrategy === 'direct') {
      const serverUrl = `/api/tts?tl=${lang}&q=${encoded}`;
      success = await playAudioUrlSingle(serverUrl, rate, signal);
      if (success) {
        preferredStrategy = 'proxy';
      }
    }

    // Strategy 2: Direct Google Translate TTS endpoint with no-referrer
    if (!success && !signal.aborted) {
      const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encoded}`;
      success = await playAudioUrlSingle(directUrl, rate, signal);
      if (success) {
        preferredStrategy = 'direct';
      }
    }

    // Strategy 3: Web Speech API synthesis
    if (!success && !signal.aborted) {
      success = await playWebSpeechChunk(chunk, lang, rate, signal);
      if (success) {
        preferredStrategy = 'webspeech';
      }
    }

    if (signal.aborted) break;
  }

  // Cleanup after whole sequence completes
  if (!signal.aborted) {
    stopAllAudio();
  }
}
