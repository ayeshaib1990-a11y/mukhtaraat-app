import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen,
  Share2, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  Volume2, 
  Bookmark, 
  Printer, 
  Copy, 
  Check, 
  Square, 
  ChevronDown,
  GraduationCap
} from 'lucide-react';
import { CHAPTERS, WordItem } from './data/chaptersData';
import { getDictionaryEntry, CLASSICAL_DICTIONARY } from './data/dictionaryData';
import { playVoice, stopAllAudio, subscribeAudioState, AudioPlaybackState } from './utils/audioPlayer';

// Theme Definitions
export type Theme = 'sepia' | 'sapphire' | 'emerald' | 'dark';
export type FontChoice = 'amiri' | 'naskh' | 'scheherazade';
export type ViewMode = 'stacked' | 'split' | 'arabic-only';

interface ThemeStyles {
  name: string;
  nameUrdu: string;
  bg: string;
  cardBg: string;
  cardBorder: string;
  cardAccentBorder: string;
  headerBg: string;
  headerBorder: string;
  primaryText: string;
  secondaryText: string;
  arabicColor: string;
  urduColor: string;
  accentGold: string;
  badgeBg: string;
  activeAccent: string;
  modalBg: string;
  modalHeaderBg: string;
  infoLabelColor: string;
  bannerGradient: string;
}

const THEMES: Record<Theme, ThemeStyles> = {
  emerald: {
    name: 'Andalusian Emerald',
    nameUrdu: 'زُمُرّدِ اَندَلُس و ذَہَب',
    bg: '#FAF7F0',
    cardBg: '#FFFFFF',
    cardBorder: '#E6DFD3',
    cardAccentBorder: '#0C4A38',
    headerBg: '#FFFFFF',
    headerBorder: '#E3DCCE',
    primaryText: '#0C4A38',
    secondaryText: '#526071',
    arabicColor: '#0E1726',
    urduColor: '#2B394A',
    accentGold: '#C59B27',
    badgeBg: '#EDF5F2',
    activeAccent: '#0C4A38',
    modalBg: '#FFFFFF',
    modalHeaderBg: 'linear-gradient(135deg, #0C4A38, #166534)',
    infoLabelColor: '#0C4A38',
    bannerGradient: 'linear-gradient(135deg, rgba(12, 74, 56, 0.04) 0%, rgba(197, 155, 39, 0.08) 100%)'
  },
  sapphire: {
    name: 'Damascus Sapphire',
    nameUrdu: 'نِیْلَمِ دِمَشْق و عَقِیْق',
    bg: '#F4F7FB',
    cardBg: '#FFFFFF',
    cardBorder: '#D8E2EE',
    cardAccentBorder: '#16325C',
    headerBg: '#FFFFFF',
    headerBorder: '#D8E2EE',
    primaryText: '#16325C',
    secondaryText: '#50637F',
    arabicColor: '#0F172A',
    urduColor: '#1E293B',
    accentGold: '#D97706',
    badgeBg: '#EBF2FA',
    activeAccent: '#16325C',
    modalBg: '#FFFFFF',
    modalHeaderBg: 'linear-gradient(135deg, #16325C, #2563EB)',
    infoLabelColor: '#16325C',
    bannerGradient: 'linear-gradient(135deg, rgba(22, 50, 92, 0.04) 0%, rgba(217, 119, 6, 0.08) 100%)'
  },
  sepia: {
    name: 'Bukhara Sepia',
    nameUrdu: 'قِرْطَاسِ بُخَارَا و عَنْبَر',
    bg: '#F5EFE3',
    cardBg: '#FAF5EC',
    cardBorder: '#E2D5C0',
    cardAccentBorder: '#634832',
    headerBg: '#FAF5EC',
    headerBorder: '#E2D5C0',
    primaryText: '#4A3423',
    secondaryText: '#6D5B4B',
    arabicColor: '#2C1810',
    urduColor: '#3D2817',
    accentGold: '#B45309',
    badgeBg: '#EFE7D8',
    activeAccent: '#634832',
    modalBg: '#FAF5EC',
    modalHeaderBg: 'linear-gradient(135deg, #4A3423, #78350F)',
    infoLabelColor: '#4A3423',
    bannerGradient: 'linear-gradient(135deg, rgba(99, 72, 50, 0.05) 0%, rgba(180, 83, 9, 0.08) 100%)'
  },
  dark: {
    name: 'Madinah Night',
    nameUrdu: 'لَیْلِ مَدِینَہ و نُوْر',
    bg: '#0F172A',
    cardBg: '#1E293B',
    cardBorder: '#334155',
    cardAccentBorder: '#38BDF8',
    headerBg: '#1E293B',
    headerBorder: '#334155',
    primaryText: '#F8FAFC',
    secondaryText: '#94A3B8',
    arabicColor: '#F1F5F9',
    urduColor: '#CBD5E1',
    accentGold: '#FBBF24',
    badgeBg: '#334155',
    activeAccent: '#0284C7',
    modalBg: '#1E293B',
    modalHeaderBg: 'linear-gradient(135deg, #0F172A, #1E293B)',
    infoLabelColor: '#38BDF8',
    bannerGradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%)'
  }
};

function normalize(s: string): string {
  if (!s) return '';
  return s
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

function stripTags(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').trim();
}

function escapeHtml(text: string): string {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function tahqeeqSpan(it: WordItem, word: string): string {
  const attrs = [
    `data-word="${escapeHtml(word)}"`,
    it.root ? `data-root="${escapeHtml(it.root)}"` : '',
    it.seegha ? `data-seegha="${escapeHtml(it.seegha)}"` : '',
    it.bab ? `data-bab="${escapeHtml(it.bab)}"` : '',
    it.meaning ? `data-meaning="${escapeHtml(it.meaning)}"` : '',
    it.qism ? `data-qism="${escapeHtml(it.qism)}"` : '',
    it.bahas ? `data-bahas="${escapeHtml(it.bahas)}"` : '',
    it.shash ? `data-shash="${escapeHtml(it.shash)}"` : '',
    it.haft ? `data-haft="${escapeHtml(it.haft)}"` : '',
    it.wazn ? `data-wazn="${escapeHtml(it.wazn)}"` : '',
    it.singular ? `data-singular="${escapeHtml(it.singular)}"` : '',
    it.plural ? `data-plural="${escapeHtml(it.plural)}"` : '',
    it.extra ? `data-extra="${escapeHtml(it.extra)}"` : ''
  ].filter(Boolean).join(' ');

  return `<span class="word-token" ${attrs}>${word}</span>`;
}

function tokenizeArabic(
  arabic: string,
  wordsPool: WordItem[],
  sharedUsed?: Set<string>
): string {
  const map: Record<string, WordItem> = {};
  for (const item of wordsPool) {
    const text = item.w || item.word || '';
    const norm = normalize(text);
    if (norm && !map[norm]) {
      map[norm] = item;
    }
  }

  const wordRe = /[\u0621-\u065F\u0670\u0640\u0671-\u06D3]+/g;
  let result = '';
  let pos = 0;
  let m: RegExpExecArray | null;

  while ((m = wordRe.exec(arabic)) !== null) {
    result += arabic.substring(pos, m.index);
    const word = m[0];
    const key = normalize(word);
    const it = map[key] || null;

    if (it) {
      if (sharedUsed) {
        if (sharedUsed.has(key)) {
          result += word;
        } else {
          sharedUsed.add(key);
          result += tahqeeqSpan(it, word);
        }
      } else {
        result += tahqeeqSpan(it, word);
      }
    } else {
      result += word;
    }
    pos = m.index + word.length;
  }
  result += arabic.substring(pos);
  return result;
}

const LATEST_UPDATED_CHAPTER_INDEX = 32; // سبق 33: الْفِرْدَوْسُ الْإِسْلَامِيُّ فِي قَارَّةِ آسِيَا (53 کلمات کی مکمل صرفی و لغوی تحقیق)
const APP_DATA_VERSION = 'v15_proofreading_words_default_live';

export default function App() {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const chParam = params.get('chapter') || params.get('ch');
        if (chParam) {
          const num = parseInt(chParam, 10);
          if (!isNaN(num) && num >= 1 && num <= CHAPTERS.length) {
            return num - 1;
          }
        }
        const hashMatch = window.location.hash.match(/(?:chapter-?|ch-?)?(\d+)/i);
        if (hashMatch && hashMatch[1]) {
          const num = parseInt(hashMatch[1], 10);
          if (!isNaN(num) && num >= 1 && num <= CHAPTERS.length) {
            return num - 1;
          }
        }
        const lastVersion = localStorage.getItem('mukhtaraat_data_version');
        const manuallySelected = sessionStorage.getItem('mukhtaraat_user_manually_selected');
        const saved = localStorage.getItem('mukhtaraat_selected_chapter');

        // If new version active or user has not explicitly navigated in current session, open the latest updated chapter!
        if (lastVersion !== APP_DATA_VERSION) {
          localStorage.setItem('mukhtaraat_data_version', APP_DATA_VERSION);
          localStorage.setItem('mukhtaraat_selected_chapter', LATEST_UPDATED_CHAPTER_INDEX.toString());
          return LATEST_UPDATED_CHAPTER_INDEX;
        }

        if (manuallySelected && saved !== null) {
          const num = parseInt(saved, 10);
          if (!isNaN(num) && num >= 0 && num < CHAPTERS.length) {
            return num;
          }
        }

        if (saved !== null) {
          const num = parseInt(saved, 10);
          if (!isNaN(num) && num >= 0 && num < CHAPTERS.length) {
            return num;
          }
        }
      } catch {
        // ignore
      }
    }
    // Default directly to latest updated chapter
    return LATEST_UPDATED_CHAPTER_INDEX;
  });
  const [activeTab, setActiveTab] = useState<'text' | 'words' | 'dictionary' | 'bookmarks'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const t = params.get('tab');
        if (t === 'text') return 'text';
        if (t === 'words' || t === 'tahqeeq' || t === 'sarf') return 'words';
        if (t === 'dictionary') return 'dictionary';
        if (t === 'bookmarks') return 'bookmarks';
      } catch {
        // ignore
      }
    }
    // Default directly to 'words' so the proofreader immediately sees all Sarfi Tahqeeq cards!
    return 'words';
  });
  const [modalViewTab, setModalViewTab] = useState<'sarf' | 'dictionary'>('sarf');
  const [dictionarySearchQuery, setDictionarySearchQuery] = useState<string>('');
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('mukhtaraat_theme');
      if (saved === 'sepia' || saved === 'sapphire' || saved === 'emerald' || saved === 'dark') {
        return saved as Theme;
      }
    } catch {
      // ignore
    }
    return 'sepia';
  });
  const [fontChoice, setFontChoice] = useState<FontChoice>(() => {
    try {
      const saved = localStorage.getItem('mukhtaraat_font_choice');
      if (saved === 'scheherazade' || saved === 'amiri' || saved === 'naskh') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'scheherazade';
  });
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);
  const [hideTranslation, setHideTranslation] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [wordFilterQuery, setWordFilterQuery] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeWord, setActiveWord] = useState<WordItem | null>(null);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false);
  const [customShareUrl, setCustomShareUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('mukhtaraat_custom_share_url') || '';
    } catch {
      return '';
    }
  });

  // Smart Share URL Resolver:
  // Features permanent Vercel deployment URL (mukhtaraat-app.vercel.app)
  // as the primary recommended share URL for students and teachers worldwide.
  const currentWindowUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
  const vercelPermanentUrl = 'https://mukhtaraat-app.vercel.app';
  const autoResolvedPublicUrl = currentWindowUrl.includes('vercel.app')
    ? currentWindowUrl
    : currentWindowUrl.includes('ais-dev-')
    ? vercelPermanentUrl
    : (currentWindowUrl || vercelPermanentUrl);
  const effectiveShareUrl = customShareUrl.trim() || autoResolvedPublicUrl;
  const isDevUrl = currentWindowUrl.includes('ais-dev-');
  const [revealedTranslations, setRevealedTranslations] = useState<Record<number, boolean>>({});
  const [copiedSentenceIndex, setCopiedSentenceIndex] = useState<number | null>(null);
  const [copiedWordIndex, setCopiedWordIndex] = useState<number | null>(null);
  const [copiedAllWords, setCopiedAllWords] = useState<boolean>(false);
  const [copiedModalWord, setCopiedModalWord] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  const [bookmarkedWords, setBookmarkedWords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mukhtaraat_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Audio Playback State from audioPlayer
  const [audioState, setAudioState] = useState<AudioPlaybackState>({
    isPlaying: false,
    activeId: null,
    lang: null
  });

  useEffect(() => {
    const unsubscribe = subscribeAudioState((state) => {
      setAudioState(state);
    });
    return () => unsubscribe();
  }, []);

  const currentTheme = THEMES[theme];
  const chapter = CHAPTERS[selectedChapterIndex] || CHAPTERS[0];

  useEffect(() => {
    try {
      localStorage.setItem('mukhtaraat_bookmarks', JSON.stringify(bookmarkedWords));
    } catch {
      // ignore
    }
  }, [bookmarkedWords]);

  useEffect(() => {
    try {
      localStorage.setItem('mukhtaraat_font_choice', fontChoice);
    } catch {
      // ignore
    }
  }, [fontChoice]);

  useEffect(() => {
    try {
      localStorage.setItem('mukhtaraat_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    stopAllAudio();
  }, [selectedChapterIndex]);

  // Cross-chapter vocabulary lookup
  const GLOBAL_TAHQEEQ = useMemo(() => {
    const map: Record<string, WordItem> = {};
    const FIELDS = ['root', 'seegha', 'bab', 'qism', 'bahas', 'shash', 'haft', 'wazn', 'meaning'];
    const score = (o: WordItem) => {
      let n = 0;
      for (const f of FIELDS) if (o[f]) n++;
      return n;
    };

    for (const ch of CHAPTERS) {
      if (ch.words && ch.words.length) {
        for (const w of ch.words) {
          const text = (w.w || w.word || '').trim();
          const norm = normalize(text);
          if (norm) {
            if (!map[norm] || score(w) > score(map[norm])) {
              map[norm] = w;
            }
          }
        }
      }
    }
    return Object.values(map);
  }, []);

  // Chapter specific words
  const chapterWords = useMemo<WordItem[]>(() => {
    const seen = new Set<string>();
    const list: WordItem[] = [];

    if (chapter.words && chapter.words.length > 0) {
      for (const item of chapter.words) {
        const text = (item.w || item.word || '').trim();
        const norm = normalize(text);
        if (text && !seen.has(norm)) {
          seen.add(norm);
          list.push(item);
        }
      }
    }

    for (const sec of chapter.sections) {
      const regex = /<span\s+class="word-token"[^>]*data-word="([^"]+)"[^>]*>/g;
      let match;
      while ((match = regex.exec(sec.arabic)) !== null) {
        const tag = match[0];
        const w = match[1];
        const norm = normalize(w);
        if (w && !seen.has(norm)) {
          seen.add(norm);
          const getAttr = (name: string) => {
            const m = tag.match(new RegExp(`data-${name}="([^"]*)"`));
            return m ? m[1] : '';
          };
          list.push({
            w: w,
            meaning: getAttr('meaning'),
            qism: getAttr('qism'),
            root: getAttr('root'),
            seegha: getAttr('seegha'),
            bahas: getAttr('bahas'),
            shash: getAttr('shash'),
            bab: getAttr('bab'),
            haft: getAttr('haft'),
            wazn: getAttr('wazn') || '-------',
            singular: getAttr('singular'),
            plural: getAttr('plural'),
            extra: getAttr('extra')
          });
        }
      }
    }

    if (!chapter.ownTahqeeqOnly) {
      const chapterFullText = chapter.sections.map(s => stripTags(s.arabic)).join(' ');
      const wordsInText = new Set(
        (chapterFullText.match(/[\u0621-\u065F\u0670\u0640\u0671-\u06D3]+/g) || []).map(normalize)
      );

      for (const gItem of GLOBAL_TAHQEEQ) {
        const text = (gItem.w || gItem.word || '').trim();
        const norm = normalize(text);
        if (wordsInText.has(norm) && !seen.has(norm)) {
          seen.add(norm);
          list.push(gItem);
        }
      }
    }

    return list;
  }, [chapter, GLOBAL_TAHQEEQ]);

  // Tokenize each section
  const tokenizedSections = useMemo(() => {
    const sharedUsed = new Set<string>();
    const pool = chapter.ownTahqeeqOnly 
      ? (chapter.words || []) 
      : (chapter.words && chapter.words.length ? [...chapter.words, ...GLOBAL_TAHQEEQ] : GLOBAL_TAHQEEQ);

    return chapter.sections.map(sec => {
      if (sec.arabic.includes('class="word-token"')) {
        return sec.arabic;
      }
      return tokenizeArabic(stripTags(sec.arabic), pool, sharedUsed);
    });
  }, [chapter, GLOBAL_TAHQEEQ, selectedChapterIndex]);

  // Filtered words for words tab
  const filteredWords = useMemo(() => {
    if (!wordFilterQuery.trim()) return chapterWords;
    const q = wordFilterQuery.toLowerCase().trim();
    return chapterWords.filter(w => {
      const wordText = (w.w || w.word || '').toLowerCase();
      const meaningText = (w.meaning || '').toLowerCase();
      const rootText = (w.root || '').toLowerCase();
      const babText = (w.bab || '').toLowerCase();
      return wordText.includes(q) || meaningText.includes(q) || rootText.includes(q) || babText.includes(q);
    });
  }, [chapterWords, wordFilterQuery]);

  // Filtered bookmarked words
  const bookmarkedItems = useMemo(() => {
    return chapterWords.filter(w => {
      const key = (w.w || w.word || '').trim();
      return bookmarkedWords.includes(key);
    });
  }, [chapterWords, bookmarkedWords]);

  const toggleBookmark = (wordText: string) => {
    const clean = wordText.trim();
    if (!clean) return;
    setBookmarkedWords(prev => 
      prev.includes(clean) ? prev.filter(item => item !== clean) : [...prev, clean]
    );
  };

  const handleOpenWord = (wObj: WordItem) => {
    setActiveWord(wObj);
    setModalViewTab('sarf');
  };

  const handleSelectChapter = (index: number) => {
    setSelectedChapterIndex(index);
    setIsDrawerOpen(false);
    setRevealedTranslations({});
    stopAllAudio();
    try {
      sessionStorage.setItem('mukhtaraat_user_manually_selected', 'true');
      localStorage.setItem('mukhtaraat_selected_chapter', index.toString());
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('ch', (index + 1).toString());
        window.history.replaceState({}, '', url.toString());
      }
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextChapter = () => {
    if (selectedChapterIndex < CHAPTERS.length - 1) {
      handleSelectChapter(selectedChapterIndex + 1);
    }
  };

  const handlePrevChapter = () => {
    if (selectedChapterIndex > 0) {
      handleSelectChapter(selectedChapterIndex - 1);
    }
  };

  const toggleReveal = (idx: number) => {
    setRevealedTranslations(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const copySentence = (text: string, idx: number) => {
    const clean = stripTags(text).trim();
    navigator.clipboard.writeText(clean);
    setCopiedSentenceIndex(idx);
    setTimeout(() => setCopiedSentenceIndex(null), 2000);
  };

  const handlePlayVoice = (text: string, lang: 'ar' | 'ur', id: string) => {
    if (audioState.isPlaying && audioState.activeId === id) {
      stopAllAudio();
    } else {
      playVoice(text, lang, id, speechRate);
    }
  };

  // Format single word tahqeeq as authentic text
  const formatWordAsText = (w: WordItem, index?: number): string => {
    const numPrefix = index !== undefined ? `${index + 1}. ` : '';
    const wordTitle = w.w || w.word || '';
    let out = `${numPrefix}${wordTitle}\nصرفی و لغوی تحقیق\n`;
    if (w.qism) out += `سہ اقسام: ${w.qism}\n`;
    if (w.singular) out += `مفرد: ${w.singular}\n`;
    if (w.plural) out += `جمع: ${w.plural}\n`;
    if (w.root) out += `مَادَّہ: ${w.root}\n`;
    if (w.seegha) out += `صِّیغَہ: ${w.seegha}\n`;
    if (w.bahas) out += `بَحْث: ${w.bahas}\n`;
    if (w.shash) out += `شُشَّ اِقْسَام: ${w.shash}\n`;
    if (w.bab) out += `بَاب: ${w.bab}\n`;
    if (w.haft) out += `ہَفْتِ اِقْسَام: ${w.haft}\n`;
    out += `وزن: ${w.wazn || '-------'}\n`;
    out += `معنی: ${w.meaning || '---'}\n`;
    if (w.extra) out += `فائدہ: ${w.extra}\n`;
    return out;
  };

  const copySingleWord = (w: WordItem, idx: number) => {
    const text = formatWordAsText(w, idx);
    navigator.clipboard.writeText(text);
    setCopiedWordIndex(idx);
    setTimeout(() => setCopiedWordIndex(null), 2000);
  };

  const copyModalWord = () => {
    if (!activeWord) return;
    const text = formatWordAsText(activeWord);
    navigator.clipboard.writeText(text);
    setCopiedModalWord(true);
    setTimeout(() => setCopiedModalWord(false), 2000);
  };

  const copyAllChapterWords = () => {
    let out = `سبق نمبر ${(selectedChapterIndex + 1)}: ${chapter.title} (مستند صرفی و لغوی تحقیق)\n\n`;
    chapterWords.forEach((w, i) => {
      out += formatWordAsText(w, i) + '\n';
    });
    navigator.clipboard.writeText(out);
    setCopiedAllWords(true);
    setTimeout(() => setCopiedAllWords(false), 2500);
  };

  const fontClass = 
    fontChoice === 'scheherazade' ? 'font-scheherazade' : 
    fontChoice === 'naskh' ? 'font-naskh' : 'font-arabic';

  // Render Arabic text with interactive word tokens click delegation
  const renderArabicHtml = (rawHtml: string) => {
    return (
      <div 
        className={`${fontClass} leading-[2.8] select-text`}
        style={{ 
          fontSize: `${1.7 + fontSizeOffset * 0.15}rem`,
          color: currentTheme.arabicColor 
        }}
        onClick={(e) => {
          const target = (e.target as HTMLElement).closest('.word-token');
          if (target) {
            const w = target.getAttribute('data-word') || target.textContent || '';
            const meaning = target.getAttribute('data-meaning') || '';
            const root = target.getAttribute('data-root') || '';
            const seegha = target.getAttribute('data-seegha') || '';
            const bahas = target.getAttribute('data-bahas') || '';
            const shash = target.getAttribute('data-shash') || '';
            const bab = target.getAttribute('data-bab') || '';
            const haft = target.getAttribute('data-haft') || '';
            const qism = target.getAttribute('data-qism') || '';
            const wazn = target.getAttribute('data-wazn') || '';
            const singular = target.getAttribute('data-singular') || '';
            const plural = target.getAttribute('data-plural') || '';
            const extra = target.getAttribute('data-extra') || '';

            const norm = normalize(w);
            const existing = chapterWords.find(item => normalize(item.w || item.word || '') === norm);
            if (existing) {
              handleOpenWord(existing);
            } else {
              handleOpenWord({
                w,
                meaning,
                root,
                seegha,
                bahas,
                shash,
                bab,
                haft,
                qism,
                wazn: wazn || '-------',
                singular,
                plural,
                extra
              });
            }
          }
        }}
        dangerouslySetInnerHTML={{ __html: rawHtml }}
      />
    );
  };

  return (
    <div 
      className="min-h-screen flex flex-col transition-colors duration-300 font-sans"
      style={{ backgroundColor: currentTheme.bg, color: currentTheme.primaryText }}
      dir="rtl"
    >
      {/* 
        ========================================================================
        TOP NAVIGATION & TITLE BAR
        ========================================================================
      */}
      <header 
        className="sticky top-0 z-30 border-b backdrop-blur-md shadow-2xs transition-colors duration-200"
        style={{ 
          backgroundColor: currentTheme.headerBg, 
          borderColor: currentTheme.headerBorder 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          
          {/* Right: Drawer Button & Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-xl transition cursor-pointer hover:bg-black/5 flex items-center gap-2"
              title="ابواب کی فہرست کھولیں"
            >
              <Menu className="w-5 h-5" />
              <span className="hidden sm:inline font-arabic font-bold text-sm">فہرست ابواب</span>
            </button>

            <div className="h-5 w-px bg-slate-300 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs font-arabic font-bold text-base"
                style={{ backgroundColor: currentTheme.activeAccent }}
              >
                م
              </div>
              <div className="hidden md:block">
                <h1 className="font-arabic font-bold text-base leading-tight tracking-wide">
                  مُخْتَارَاتُ الْأَدَبِ الْعَرَبِيِّ
                </h1>
                <p className="font-urdu text-[11px] opacity-70 leading-none">
                  مع مستند صرفی و لغوی تحقیق اور صوتی تلفظ
                </p>
              </div>
            </div>
          </div>

          {/* Center: Current Chapter Name Badge */}
          <div className="flex-1 max-w-md mx-2 text-center truncate">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full text-xs font-bold border truncate shadow-2xs hover:opacity-85 transition cursor-pointer"
              style={{ 
                backgroundColor: currentTheme.cardBg, 
                borderColor: currentTheme.cardBorder,
                color: currentTheme.primaryText
              }}
              title="تمام اسباق کی فہرست کھولیں اور سبق تبدیل کریں"
            >
              <span className="font-arabic opacity-75">باب {selectedChapterIndex + 1}:</span>
              <span className="font-arabic font-bold truncate">{chapter.title}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
            </button>
          </div>

          {/* Left: Quick Actions & Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Audio Stop Button if currently playing */}
            {audioState.isPlaying && (
              <button
                onClick={stopAllAudio}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-1.5 animate-pulse cursor-pointer shadow-xs"
                title="آواز بند کریں"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span className="hidden sm:inline">آواز روکیں</span>
              </button>
            )}

            {/* Current Chapter Arabic Audio Play */}
            <button
              onClick={() => {
                const fullArabic = chapter.sections.map(s => stripTags(s.arabic)).join(' ');
                handlePlayVoice(fullArabic, 'ar', `chapter-ar-${selectedChapterIndex}`);
              }}
              className={`hidden md:flex px-2.5 py-1 rounded-lg border text-xs font-semibold items-center gap-1.5 transition cursor-pointer ${
                audioState.isPlaying && audioState.activeId === `chapter-ar-${selectedChapterIndex}` ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold shadow-xs' : 'hover:bg-black/5'
              }`}
              style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
              title={`سبق ${selectedChapterIndex + 1}: ${chapter.title} کی مکمل عربی قراءت مسلسل سنیں`}
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>پورا سبق (عربی)</span>
            </button>

            {/* Current Chapter Urdu Audio Play */}
            <button
              onClick={() => {
                const fullUrdu = chapter.sections.map(s => stripTags(s.urdu)).join(' ');
                handlePlayVoice(fullUrdu, 'ur', `chapter-ur-${selectedChapterIndex}`);
              }}
              className={`hidden md:flex px-2.5 py-1 rounded-lg border text-xs font-semibold items-center gap-1.5 transition cursor-pointer ${
                audioState.isPlaying && audioState.activeId === `chapter-ur-${selectedChapterIndex}` ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold shadow-xs' : 'hover:bg-black/5'
              }`}
              style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
              title={`سبق ${selectedChapterIndex + 1}: ${chapter.title} کا مکمل اردو ترجمہ مسلسل سنیں`}
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
              <span>پورا سبق (اردو)</span>
            </button>

            {/* Audio Speed Selector */}
            <div className="relative hidden lg:flex items-center text-xs border rounded-lg overflow-hidden" style={{ borderColor: currentTheme.cardBorder }}>
              <button 
                onClick={() => setSpeechRate(speechRate === 0.75 ? 1.0 : speechRate === 1.0 ? 1.25 : 0.75)}
                className="px-2 py-1 font-semibold hover:bg-black/5 transition cursor-pointer"
                title="آواز کی رفتار تبدیل کریں"
              >
                {speechRate}x
              </button>
            </div>

            {/* Text Zoom In / Out */}
            <div className="hidden sm:flex items-center border rounded-lg overflow-hidden" style={{ borderColor: currentTheme.cardBorder }}>
              <button
                onClick={() => setFontSizeOffset(prev => Math.max(-2, prev - 1))}
                className="p-1.5 hover:bg-black/5 transition cursor-pointer"
                title="متن چھوٹا کریں"
                disabled={fontSizeOffset <= -2}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFontSizeOffset(prev => Math.min(4, prev + 1))}
                className="p-1.5 hover:bg-black/5 transition cursor-pointer"
                title="متن بڑا کریں"
                disabled={fontSizeOffset >= 4}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Theme Selector Dropdown */}
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="text-xs font-semibold px-2 py-1.5 rounded-lg border cursor-pointer focus:outline-none transition shadow-2xs"
              style={{ 
                backgroundColor: currentTheme.cardBg, 
                borderColor: currentTheme.cardBorder,
                color: currentTheme.primaryText 
              }}
              title="رنگ کا انتخاب کریں"
            >
              <option value="sepia">قِرْطَاسِ بُخَارَا (سیپیا)</option>
              <option value="sapphire">نِیْلَمِ دِمَشْق (نیلا)</option>
              <option value="emerald">زُمُرّدِ اَندَلُس (سبز)</option>
              <option value="dark">لَیْلِ مَدِینَہ (ڈارک)</option>
            </select>

            {/* Share App Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 cursor-pointer transition text-xs shadow-2xs hover:bg-black/5"
              style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
              title="ایپلیکیشن شیئر کریں"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">شیئر کریں</span>
            </button>

            {/* Scholarly Resources Trust Modal */}
            <button
              onClick={() => setIsResourcesModalOpen(true)}
              className="p-2 rounded-lg hover:bg-black/5 transition cursor-pointer text-amber-700"
              title="مستند مصادر و مراجع"
            >
              <GraduationCap className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* 
        ========================================================================
        MAIN CONTENT CONTAINER
        ========================================================================
      */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* New Updates Banner */}
        <div 
          className="rounded-2xl border p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-emerald-500/10 border-emerald-300/60 dark:border-emerald-700/60"
        >
          <div className="flex items-center gap-2.5 text-right w-full sm:w-auto">
            <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 text-sm shadow-xs font-bold">
              ✨
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-urdu font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                  جدید ترین اپڈیٹ (سبق 33)
                </span>
                <span className="font-arabic font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  الْفِرْدَوْسُ الْإِسْلَامِيُّ فِي قَارَّةِ آسِيَا
                </span>
              </div>
              <p className="font-urdu text-xs opacity-80 mt-0.5">
                مکمل ۵۳ کلمات کی جامع صرفی و لغوی تحقیق، مستند اوزان، ابواب، مادے اور بامحاورہ اردو ترجمہ کے ساتھ لائیو ہے۔
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end flex-wrap">
            <button
              onClick={() => handleSelectChapter(32)}
              className={`px-3 py-1.5 rounded-xl text-xs font-arabic font-bold shadow-xs transition cursor-pointer flex items-center gap-1 border ${
                selectedChapterIndex === 32
                  ? 'bg-emerald-800 text-white border-emerald-900'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-600'
              }`}
              title="سبق 33: الْفِرْدَوْسُ الْإِسْلَامِيُّ فِي قَارَّةِ آسِيَا کھولیں"
            >
              <span>سبق ۳۳: الفردوس الإسلامي</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleSelectChapter(4)}
              className="px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-arabic font-bold shadow-xs transition cursor-pointer flex items-center gap-1"
              title="سبق 5: فِي بَنِي سَعْدٍ کھولیں"
            >
              <span>سبق ۵</span>
            </button>
            <button
              onClick={() => handleSelectChapter(0)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white text-xs font-arabic font-bold shadow-xs transition cursor-pointer flex items-center gap-1"
              title="سبق 1: عِبَادُ الرَّحْمٰنِ کھولیں"
            >
              <span>سبق ۱</span>
            </button>
          </div>
        </div>

        {/* Quick Chapter Selector Bar */}
        <div 
          className="rounded-2xl border p-2 sm:p-2.5 shadow-2xs flex items-center justify-between gap-2 overflow-x-auto"
          style={{ 
            backgroundColor: currentTheme.cardBg, 
            borderColor: currentTheme.cardBorder 
          }}
        >
          <div className="flex items-center gap-1.5 shrink-0 px-1">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-urdu font-bold opacity-80 hidden sm:inline">فوری اسباق:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {[
              { idx: 32, label: 'سبق 33: الفردوس الإسلامي', badge: 'جدید (53 کلمات)' },
              { idx: 4, label: 'سبق 5: فِي بَنِي سَعْدٍ' },
              { idx: 3, label: 'سبق 4: الْخُطْبَةُ الْمُعْجِزَةُ' },
              { idx: 0, label: 'سبق 1: عِبَادُ الرَّحْمٰنِ' },
              { idx: 1, label: 'سبق 2: سَيِّدُنَا مُوسَىٰ' },
            ].map(item => {
              const isCur = selectedChapterIndex === item.idx;
              return (
                <button
                  key={item.idx}
                  onClick={() => handleSelectChapter(item.idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-arabic font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                    isCur 
                      ? 'border-emerald-600 text-white shadow-xs' 
                      : 'hover:bg-black/5 opacity-85 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isCur ? currentTheme.activeAccent : 'transparent',
                    borderColor: isCur ? currentTheme.activeAccent : currentTheme.cardBorder,
                    color: isCur ? '#ffffff' : currentTheme.primaryText
                  }}
                >
                  <span>{item.label}</span>
                  {item.badge && !isCur && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 font-urdu font-bold border border-amber-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-urdu font-bold transition shrink-0 flex items-center gap-1 border hover:bg-black/5 cursor-pointer opacity-80 hover:opacity-100"
              style={{ borderColor: currentTheme.cardBorder, color: currentTheme.secondaryText }}
              title="تمام 33 اسباق کی فہرست کھولیں"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>تمام اسباق (33)</span>
            </button>
          </div>
        </div>

        {/* Chapter Header Card with Classical Typography */}
        <section 
          className="rounded-2xl border p-6 sm:p-8 text-center relative overflow-hidden shadow-xs transition-colors duration-200"
          style={{ 
            backgroundColor: currentTheme.cardBg, 
            borderColor: currentTheme.cardBorder,
            background: currentTheme.bannerGradient
          }}
        >
          {/* Chapter Metadata & Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <span 
              className="px-3 py-1 rounded-full text-xs font-bold font-arabic shadow-2xs"
              style={{ backgroundColor: currentTheme.badgeBg, color: currentTheme.primaryText }}
            >
              سبق نمبر {(selectedChapterIndex + 1)}
            </span>
            {chapter.attribution && (
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium font-arabic shadow-2xs opacity-90"
                style={{ backgroundColor: currentTheme.cardBg, color: currentTheme.secondaryText }}
              >
                تالیف: {chapter.attribution}
              </span>
            )}
            <span 
              className="px-3 py-1 rounded-full text-xs font-medium font-arabic shadow-2xs"
              style={{ backgroundColor: currentTheme.cardBg, color: currentTheme.secondaryText }}
            >
              کل {chapterWords.length} کلمات کی صرفی تحقیق
            </span>
          </div>

          {/* Chapter Arabic Title */}
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-arabic mb-3 tracking-wide leading-tight"
            style={{ color: currentTheme.primaryText }}
          >
            {chapter.title}
          </h2>

          {/* Urdu Title & Subtitle */}
          <p 
            className="font-urdu text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
            style={{ color: currentTheme.urduColor }}
          >
            {chapter.urduTitle}
          </p>

          {/* Navigation & Audio Controls */}
          <div className="mt-6 pt-5 border-t flex flex-wrap items-center justify-between gap-3 text-xs" style={{ borderColor: currentTheme.cardBorder }}>
            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevChapter}
                disabled={selectedChapterIndex === 0}
                className="px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1 cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5"
                style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
              >
                <ChevronRight className="w-4 h-4" />
                <span>پچھلا سبق</span>
              </button>

              <button
                onClick={handleNextChapter}
                disabled={selectedChapterIndex === CHAPTERS.length - 1}
                className="px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1 cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5"
                style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
              >
                <span>اگلا سبق</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Play All Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const fullArabic = chapter.sections.map(s => stripTags(s.arabic)).join(' ');
                  handlePlayVoice(fullArabic, 'ar', 'full-chapter-ar');
                }}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 cursor-pointer transition ${
                  audioState.isPlaying && audioState.activeId === 'full-chapter-ar' ? 'bg-amber-100 text-amber-900 border-amber-400' : 'hover:bg-black/5'
                }`}
                style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
                title="مکمل سبق کی عربی قراءت سنیں"
              >
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span>عربی قراءت سنیں</span>
              </button>

              <button
                onClick={() => {
                  const fullUrdu = chapter.sections.map(s => stripTags(s.urdu)).join(' ');
                  handlePlayVoice(fullUrdu, 'ur', 'full-chapter-ur');
                }}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 cursor-pointer transition ${
                  audioState.isPlaying && audioState.activeId === 'full-chapter-ur' ? 'bg-amber-100 text-amber-900 border-amber-400' : 'hover:bg-black/5'
                }`}
                style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
                title="مکمل سبق کا اردو ترجمہ سنیں"
              >
                <Volume2 className="w-4 h-4 text-amber-700" />
                <span>اردو ترجمہ سنیں</span>
              </button>
            </div>
          </div>
        </section>

        {/* 
          ========================================================================
          VIEW MODE TABS: TEXT / FULL SARFI TAHQEEQ / BOOKMARKS
          ========================================================================
        */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3" style={{ borderColor: currentTheme.cardBorder }}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'text' 
                  ? 'shadow-xs text-white' 
                  : 'opacity-75 hover:opacity-100 hover:bg-black/5'
              }`}
              style={{ 
                backgroundColor: activeTab === 'text' ? currentTheme.activeAccent : 'transparent',
                color: activeTab === 'text' ? '#FFFFFF' : currentTheme.primaryText
              }}
            >
              <BookOpen className="w-4 h-4" />
              <span>متن مع تحقیق (کلک کریں)</span>
            </button>

            <button
              onClick={() => setActiveTab('words')}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'words' 
                  ? 'shadow-xs text-white' 
                  : 'opacity-75 hover:opacity-100 hover:bg-black/5'
              }`}
              style={{ 
                backgroundColor: activeTab === 'words' ? currentTheme.activeAccent : 'transparent',
                color: activeTab === 'words' ? '#FFFFFF' : currentTheme.primaryText
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>مستند صرفی تحقیق (مکمل فہرست: {chapterWords.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('dictionary')}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'dictionary' 
                  ? 'shadow-xs text-white' 
                  : 'opacity-75 hover:opacity-100 hover:bg-black/5'
              }`}
              style={{ 
                backgroundColor: activeTab === 'dictionary' ? currentTheme.activeAccent : 'transparent',
                color: activeTab === 'dictionary' ? '#FFFFFF' : currentTheme.primaryText
              }}
            >
              <BookOpen className="w-4 h-4" />
              <span>قاموس و معاجمِ ثلاثہ (لغت)</span>
            </button>

            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'bookmarks' 
                  ? 'shadow-xs text-white' 
                  : 'opacity-75 hover:opacity-100 hover:bg-black/5'
              }`}
              style={{ 
                backgroundColor: activeTab === 'bookmarks' ? currentTheme.activeAccent : 'transparent',
                color: activeTab === 'bookmarks' ? '#FFFFFF' : currentTheme.primaryText
              }}
            >
              <Bookmark className="w-4 h-4" />
              <span>محفوظ شدہ کلمات ({bookmarkedItems.length})</span>
            </button>
          </div>

          {/* Quick display toggles for text mode */}
          {activeTab === 'text' && (
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setHideTranslation(!hideTranslation)}
                className="px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 cursor-pointer hover:bg-black/5 transition"
                style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
                title="امتحانی موڈ: ترجمہ چھپائیں یا ظاہر کریں"
              >
                {hideTranslation ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{hideTranslation ? 'ترجمہ چھپا ہوا ہے' : 'امتحانی موڈ (خود آزمائی)'}</span>
              </button>

              <select
                value={fontChoice}
                onChange={(e) => setFontChoice(e.target.value as FontChoice)}
                className="px-2 py-1.5 rounded-lg border font-semibold cursor-pointer text-xs focus:outline-none"
                style={{ 
                  backgroundColor: currentTheme.cardBg, 
                  borderColor: currentTheme.cardBorder,
                  color: currentTheme.primaryText 
                }}
                title="خط کا انتخاب کریں"
              >
                <option value="scheherazade">خطِ شہزاد (کلاسیکی)</option>
                <option value="amiri">خطِ امیری (رسمی)</option>
                <option value="naskh">خطِ نسخ (درسی)</option>
              </select>
            </div>
          )}
        </div>

        {/* 
          ========================================================================
          TAB 1: PASSAGES WITH INTERACTIVE TOKENS & DUAL SOUND
          ========================================================================
        */}
        {activeTab === 'text' && (
          <div className="space-y-6">
            {/* Tip banner */}
            <div 
              className="p-4 rounded-xl border flex items-center justify-between gap-3 text-xs leading-relaxed"
              style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.cardBorder }}
            >
              <div className="flex items-center gap-2.5 font-urdu">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>رہنمائی: </strong> عربی عبارت میں جن کلمات کے نیچے لکیر ہے، ان پر <strong>کلک</strong> کرنے سے مستند صرفی تحقیق کا کارڈ کھلتا ہے، جس میں وزن، مادہ، صیغہ، بحث، باب اور صوتی تلفظ دستیاب ہے۔
                </span>
              </div>
              <button
                onClick={() => setActiveTab('words')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 border hover:bg-black/5 transition cursor-pointer"
                style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
              >
                مکمل فہرست دیکھیں ({chapterWords.length})
              </button>
            </div>

            {chapter.placeholder ? (
              <div 
                className="text-center py-16 rounded-2xl border"
                style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.cardBorder }}
              >
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <h3 className="font-arabic font-bold text-xl mb-1">📖 یہ باب ابھی شامل کیا جانا باقی ہے</h3>
                <p className="text-sm opacity-70 font-urdu">اگر آپ کے پاس اس باب کا متن ہے تو فراہم کریں، جلد شامل کر دیا جائے گا۔</p>
              </div>
            ) : (
              <div className="space-y-6">
                {chapter.sections.map((sec, idx) => {
                  const tokenizedHtml = tokenizedSections[idx] || sec.arabic;
                  const isRevealed = revealedTranslations[idx] || !hideTranslation;
                  const isArabicPlaying = audioState.isPlaying && audioState.activeId === `sec-ar-${idx}`;
                  const isUrduPlaying = audioState.isPlaying && audioState.activeId === `sec-ur-${idx}`;

                  return (
                    <article
                      key={idx}
                      className={`card-print rounded-2xl border p-6 sm:p-8 transition-all duration-200 relative ${
                        isArabicPlaying ? 'reading-active' : ''
                      }`}
                      style={{ 
                        backgroundColor: currentTheme.cardBg, 
                        borderColor: currentTheme.cardBorder,
                        borderRightWidth: '4px',
                        borderRightColor: currentTheme.cardAccentBorder
                      }}
                    >
                      {/* Section Header with Badge and Section Audio Buttons */}
                      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b" style={{ borderColor: currentTheme.cardBorder }}>
                        <span 
                          className="px-2.5 py-1 rounded-md text-xs font-bold font-arabic shadow-2xs"
                          style={{ backgroundColor: currentTheme.badgeBg, color: currentTheme.primaryText }}
                        >
                          {sec.label || `حصہ ${idx + 1}`}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {/* Arabic Audio for Section */}
                          <button
                            onClick={() => handlePlayVoice(sec.arabic, 'ar', `sec-ar-${idx}`)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                              isArabicPlaying ? 'bg-amber-100 text-amber-900 border-amber-400' : 'hover:bg-black/5'
                            }`}
                            style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
                            title="عربی قراءت سنیں"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span className="hidden sm:inline">عربی آواز</span>
                          </button>

                          {/* Urdu Audio for Section */}
                          {sec.urdu && (
                            <button
                              onClick={() => handlePlayVoice(sec.urdu, 'ur', `sec-ur-${idx}`)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                                isUrduPlaying ? 'bg-amber-100 text-amber-900 border-amber-400' : 'hover:bg-black/5'
                              }`}
                              style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
                              title="اردو ترجمہ سنیں"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                              <span className="hidden sm:inline">اردو آواز</span>
                            </button>
                          )}

                          {/* Copy Sentence */}
                          <button
                            onClick={() => copySentence(sec.arabic, idx)}
                            className="p-1.5 rounded-lg border hover:bg-black/5 transition cursor-pointer"
                            style={{ borderColor: currentTheme.cardBorder, color: currentTheme.secondaryText }}
                            title="عبارت کاپی کریں"
                          >
                            {copiedSentenceIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Arabic Text with Token Click Delegation */}
                      <div className="mb-5">
                        {renderArabicHtml(tokenizedHtml)}
                      </div>

                      {/* Urdu Translation */}
                      {sec.urdu && (
                        <div className="pt-4 border-t" style={{ borderColor: currentTheme.cardBorder }}>
                          {isRevealed ? (
                            <p 
                              className="font-urdu text-base sm:text-lg leading-relaxed select-text transition-all duration-300"
                              style={{ color: currentTheme.urduColor }}
                            >
                              {sec.urdu}
                            </p>
                          ) : (
                            <div className="py-2 flex items-center justify-between bg-amber-50/50 rounded-xl px-4 border border-amber-200/60">
                              <span className="text-xs font-medium text-amber-900 font-urdu">
                                ترجمہ امتحانی مشق کے لیے پوشیدہ ہے۔
                              </span>
                              <button
                                onClick={() => toggleReveal(idx)}
                                className="px-3 py-1 rounded-lg text-xs font-bold border border-amber-300 bg-white hover:bg-amber-100 transition cursor-pointer flex items-center gap-1 text-amber-900"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>ترجمہ دیکھیں</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 
          ========================================================================
          TAB 2: FULL CHAPTER SARFI TAHQEEQ LIST - EXACT USER APP STYLE
          ========================================================================
        */}
        {activeTab === 'words' && (
          <div className="space-y-6">
            {/* Top Chapter Header Banner */}
            <div 
              className="p-6 rounded-2xl border text-center relative shadow-xs"
              style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.cardBorder }}
            >
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold font-arabic mb-2 inline-block"
                style={{ backgroundColor: currentTheme.badgeBg, color: currentTheme.primaryText }}
              >
                سبق نمبر {(selectedChapterIndex + 1)}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-arabic mb-2" style={{ color: currentTheme.primaryText }}>
                {chapter.title} (مستند صرفی و لغوی تحقیق)
              </h2>
              <p className="font-urdu text-sm opacity-80" style={{ color: currentTheme.urduColor }}>
                {chapter.urduTitle} — کل {chapterWords.length} کلمات کی مفصل صرفی تفاصیل بمع وزن و مادہ
              </p>

              {/* Action Buttons: Copy All / Print / Search */}
              <div className="mt-5 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs" style={{ borderColor: currentTheme.cardBorder }}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyAllChapterWords}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition cursor-pointer hover:bg-black/5"
                    style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
                    title="پوری صرفی تحقیق ٹیکسٹ کی صورت میں کاپی کریں"
                  >
                    {copiedAllWords ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedAllWords ? 'پوری تحقیق کاپی ہو گئی!' : 'پوری صرفی تحقیق کاپی کریں'}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition cursor-pointer hover:bg-black/5"
                    style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
                    title="اس سبق کی صرفی تحقیق کا ورق پرنٹ کریں"
                  >
                    <Printer className="w-4 h-4" />
                    <span>پرنٹ کریں</span>
                  </button>
                </div>

                <div className="text-xs font-semibold opacity-75">
                  تعداد کلمات: {filteredWords.length} از {chapterWords.length}
                </div>
              </div>
            </div>

            {/* Search Filter input */}
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute right-3.5 top-3.5 opacity-50" />
              <input
                type="text"
                placeholder="کلمہ، مادہ، صیغہ، باب یا معنی تلاش کریں..."
                value={wordFilterQuery}
                onChange={(e) => setWordFilterQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl text-sm border focus:outline-none transition shadow-2xs"
                style={{ 
                  borderColor: currentTheme.cardBorder,
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.primaryText 
                }}
              />
            </div>

            {/* List of Sarfi Tahqeeq Cards Matching User's Exact Format */}
            {filteredWords.length === 0 ? (
              <div 
                className="text-center py-16 rounded-2xl border"
                style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.cardBorder }}
              >
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <h3 className="font-arabic font-bold text-xl mb-1">کوئی کلمہ نہیں ملا</h3>
                <p className="text-sm opacity-70 font-urdu">تلاش کے الفاظ بدل کر دوبارہ کوشش کریں۔</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredWords.map((word, wIdx) => {
                  const displayWord = (word.w || word.word || '').trim();
                  const isBookmarked = bookmarkedWords.includes(displayWord);
                  const isArabicPlaying = audioState.isPlaying && audioState.activeId === `list-ar-${wIdx}`;
                  const isUrduPlaying = audioState.isPlaying && audioState.activeId === `list-ur-${wIdx}`;

                  return (
                    <div
                      key={wIdx}
                      className="card-print p-6 rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between group relative"
                      style={{ 
                        backgroundColor: currentTheme.cardBg, 
                        borderColor: currentTheme.cardBorder,
                        borderRightWidth: '4px',
                        borderRightColor: currentTheme.cardAccentBorder
                      }}
                    >
                      <div>
                        {/* Word Header with Number and Audio Controls */}
                        <div className="flex items-start justify-between pb-3 mb-3 border-b" style={{ borderColor: currentTheme.cardBorder }}>
                          <div className="flex items-center gap-3">
                            <span 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{ backgroundColor: currentTheme.badgeBg, color: currentTheme.primaryText }}
                            >
                              {wIdx + 1}
                            </span>
                            <div>
                              <h3 className="font-arabic font-bold text-3xl leading-none mb-1" style={{ color: currentTheme.primaryText }}>
                                {displayWord}
                              </h3>
                              <span className="text-xs font-medium opacity-70 font-arabic">
                                صرفی و لغوی تحقیق
                              </span>
                            </div>
                          </div>

                          {/* Sound Buttons: Arabic & Urdu */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handlePlayVoice(displayWord, 'ar', `list-ar-${wIdx}`)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                                isArabicPlaying ? 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse' : 'hover:bg-black/5'
                              }`}
                              style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
                              title="عربی تلفظ سنیں"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>عربی آواز</span>
                            </button>

                            <button
                              onClick={() => handlePlayVoice(word.meaning || '', 'ur', `list-ur-${wIdx}`)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                                isUrduPlaying ? 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse' : 'hover:bg-black/5'
                              }`}
                              style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
                              title="اردو معنی سنیں"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                              <span>اردو آواز</span>
                            </button>
                          </div>
                        </div>

                        {/* Exact Sarfi Tahqeeq Rows */}
                        <div className="space-y-0 text-sm font-arabic">
                          
                          {/* سہ اقسام */}
                          {word.qism && (
                            <div className="info-row">
                              <span className="info-label">سہ اقسام:</span>
                              <span className="info-value font-medium">{word.qism}</span>
                            </div>
                          )}

                          {/* مفرد (if exists) */}
                          {word.singular && (
                            <div className="info-row">
                              <span className="info-label">مفرد:</span>
                              <span className="info-value font-medium">{word.singular}</span>
                            </div>
                          )}

                          {/* جمع (if exists) */}
                          {word.plural && (
                            <div className="info-row">
                              <span className="info-label">جمع:</span>
                              <span className="info-value font-medium">{word.plural}</span>
                            </div>
                          )}

                          {/* مَادَّہ */}
                          {word.root && (
                            <div className="info-row">
                              <span className="info-label">مَادَّہ:</span>
                              <span className="info-value font-bold tracking-widest text-base">{word.root}</span>
                            </div>
                          )}

                          {/* صِّیغَہ */}
                          {word.seegha && (
                            <div className="info-row">
                              <span className="info-label">صِّیغَہ:</span>
                              <span className="info-value font-medium">{word.seegha}</span>
                            </div>
                          )}

                          {/* بَحْث */}
                          {word.bahas && (
                            <div className="info-row">
                              <span className="info-label">بَحْث:</span>
                              <span className="info-value font-medium">{word.bahas}</span>
                            </div>
                          )}

                          {/* شُشَّ اِقْسَام */}
                          {word.shash && (
                            <div className="info-row">
                              <span className="info-label">شُشَّ اِقْسَام:</span>
                              <span className="info-value font-medium">{word.shash}</span>
                            </div>
                          )}

                          {/* بَاب */}
                          {word.bab && (
                            <div className="info-row">
                              <span className="info-label">بَاب:</span>
                              <span className="info-value font-medium">{word.bab}</span>
                            </div>
                          )}

                          {/* ہَفْتِ اِقْسَام */}
                          {word.haft && (
                            <div className="info-row">
                              <span className="info-label">ہَفْتِ اِقْسَام:</span>
                              <span className="info-value font-medium">{word.haft}</span>
                            </div>
                          )}

                          {/* وزن - EXPLICITLY SHOWN AS REQUESTED */}
                          <div className="info-row">
                            <span className="info-label font-bold text-amber-800">وزن:</span>
                            <span className="info-value font-medium font-arabic text-base">
                              {word.wazn || '-------'}
                            </span>
                          </div>

                          {/* معنی */}
                          <div className="info-row !border-b-0">
                            <span className="info-label">معنی:</span>
                            <span className="info-value font-urdu text-base leading-relaxed" style={{ color: currentTheme.urduColor }}>
                              {word.meaning || '---'}
                            </span>
                          </div>

                          {/* فائدہ / اصل (if exists) */}
                          {word.extra && (
                            <div className="mt-2 p-2.5 bg-blue-50/80 border border-blue-200 rounded-lg text-xs font-urdu text-slate-800 leading-relaxed">
                              <strong>فائدہ: </strong> {word.extra}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer: Copy / Dictionary / Bookmark */}
                      <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs opacity-85 gap-2 flex-wrap" style={{ borderColor: currentTheme.cardBorder }}>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => copySingleWord(word, wIdx)}
                            className="flex items-center gap-1 hover:text-emerald-700 transition cursor-pointer"
                          >
                            {copiedWordIndex === wIdx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedWordIndex === wIdx ? 'نقل ہو گیا!' : 'تحقیق کاپی کریں'}</span>
                          </button>

                          {/* Direct Built-in Classical Dictionary Access */}
                          <button
                            onClick={() => {
                              setActiveWord(word);
                              setModalViewTab('dictionary');
                            }}
                            className="flex items-center gap-1 text-amber-800 hover:text-amber-950 font-bold transition cursor-pointer"
                            title="اس کلمے کی لغت و معجم دیکھیں"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                            <span>معجم و لغت</span>
                          </button>
                        </div>

                        <button
                          onClick={() => toggleBookmark(displayWord)}
                          className="flex items-center gap-1 transition cursor-pointer hover:opacity-100"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'text-amber-500 fill-amber-500' : ''}`} />
                          <span>{isBookmarked ? 'محفوظ شدہ' : 'محفوظ کریں'}</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 
          ========================================================================
          TAB 3: BOOKMARKS / SAVED WORDS
          ========================================================================
        */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-6">
            <div 
              className="p-6 rounded-2xl border text-center shadow-xs"
              style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.cardBorder }}
            >
              <h2 className="text-2xl font-bold font-arabic mb-2" style={{ color: currentTheme.primaryText }}>
                محفوظ شدہ کلمات برائے مراجعہ
              </h2>
              <p className="font-urdu text-sm opacity-80">
                طلبہ کے اپنے منتخب کردہ اور یاد کرنے والے کلمات کی فہرست (مجموعی: {bookmarkedWords.length})
              </p>
            </div>

            {bookmarkedItems.length === 0 ? (
              <div 
                className="text-center py-16 rounded-2xl border"
                style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.cardBorder }}
              >
                <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <h3 className="font-arabic font-bold text-xl mb-1">اس سبق میں کوئی محفوظ شدہ کلمہ نہیں ہے</h3>
                <p className="text-sm opacity-70 font-urdu">کسی بھی کلمے پر بک مارک کا نشان لگا کر یہاں محفوظ کر سکتے ہیں۔</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {bookmarkedItems.map((word, wIdx) => {
                  const displayWord = (word.w || word.word || '').trim();
                  return (
                    <div
                      key={wIdx}
                      className="card-print p-6 rounded-2xl border transition hover:shadow-md"
                      style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.cardBorder }}
                    >
                      <div className="flex items-start justify-between pb-3 mb-3 border-b" style={{ borderColor: currentTheme.cardBorder }}>
                        <div>
                          <h3 className="font-arabic font-bold text-3xl" style={{ color: currentTheme.primaryText }}>
                            {displayWord}
                          </h3>
                          <span className="text-xs font-medium opacity-70 font-arabic">صرفی و لغوی تحقیق</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handlePlayVoice(displayWord, 'ar', `bm-ar-${wIdx}`)}
                            className="px-2 py-1 rounded-md text-xs font-bold border hover:bg-black/5 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                          </button>
                          <button
                            onClick={() => handlePlayVoice(word.meaning || '', 'ur', `bm-ur-${wIdx}`)}
                            className="px-2 py-1 rounded-md text-xs font-bold border hover:bg-black/5 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-0 text-sm font-arabic">
                        {word.qism && <div className="info-row"><span className="info-label">سہ اقسام:</span><span className="info-value">{word.qism}</span></div>}
                        {word.root && <div className="info-row"><span className="info-label">مَادَّہ:</span><span className="info-value font-bold">{word.root}</span></div>}
                        {word.seegha && <div className="info-row"><span className="info-label">صِّیغَہ:</span><span className="info-value">{word.seegha}</span></div>}
                        {word.bahas && <div className="info-row"><span className="info-label">بَحْث:</span><span className="info-value">{word.bahas}</span></div>}
                        {word.bab && <div className="info-row"><span className="info-label">بَاب:</span><span className="info-value">{word.bab}</span></div>}
                        {word.haft && <div className="info-row"><span className="info-label">ہَفْتِ اِقْسَام:</span><span className="info-value">{word.haft}</span></div>}
                        <div className="info-row"><span className="info-label">وزن:</span><span className="info-value">{word.wazn || '-------'}</span></div>
                        <div className="info-row !border-b-0"><span className="info-label">معنی:</span><span className="info-value font-urdu text-base">{word.meaning || '---'}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 
          ========================================================================
          TAB: CLASSICAL DICTIONARIES (معاجم و لغاتِ ثلاثہ)
          ========================================================================
        */}
        {activeTab === 'dictionary' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div 
              className="p-6 rounded-2xl border text-center shadow-xs"
              style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.cardBorder }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-amber-700" />
                <h2 className="text-2xl sm:text-3xl font-bold font-arabic" style={{ color: currentTheme.primaryText }}>
                  قاموس و معجمِ مختارات من أدب العرب
                </h2>
              </div>
              <p className="font-urdu text-sm max-w-2xl mx-auto opacity-80 leading-relaxed" style={{ color: currentTheme.urduColor }}>
                مستند لغوی حوالے اور تشریحات منقول از <strong>القاموس المحیط</strong> (الفیروز آبادی)، <strong>لسان العرب</strong> (ابن منظور)، اور <strong>المعجم الوسیط</strong> (مجمع اللغة العربية بالقاهرة)
              </p>
            </div>

            {/* Search Input for Roots */}
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute right-3.5 top-3.5 opacity-50" />
              <input
                type="text"
                placeholder="مادہ (جیسے: ب - ر - ك یا برك) یا کوئی بھی عربی کلمہ تلاش کریں..."
                value={dictionarySearchQuery}
                onChange={(e) => setDictionarySearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl text-sm border focus:outline-none transition shadow-2xs"
                style={{ 
                  borderColor: currentTheme.cardBorder,
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.primaryText 
                }}
              />
            </div>

            {/* Quick Roots of Current Chapter */}
            <div className="p-4 rounded-xl border bg-white/60 space-y-2" style={{ borderColor: currentTheme.cardBorder }}>
              <span className="text-xs font-bold font-urdu opacity-80 block">
                اس سبق کے اہم مادے (کلک کر کے لغت دیکھیں):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Array.from(new Set(chapterWords.map(w => w.root).filter(Boolean))).map((r, rIdx) => (
                  <button
                    key={rIdx}
                    onClick={() => setDictionarySearchQuery(r as string)}
                    className="px-2.5 py-1 rounded-lg text-xs font-arabic font-bold border transition cursor-pointer hover:bg-black/5"
                    style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Dictionary Entries Cards */}
            <div className="space-y-5">
              {(() => {
                const uniqueRoots = Array.from(
                  new Set(
                    chapterWords
                      .map(w => w.root)
                      .filter(Boolean)
                      .concat(Object.keys(CLASSICAL_DICTIONARY).map(k => CLASSICAL_DICTIONARY[k].root))
                  )
                ).filter(r => {
                  if (!dictionarySearchQuery.trim()) return true;
                  const q = dictionarySearchQuery.replace(/[\s\-]/g, '').toLowerCase();
                  const rClean = (r as string).replace(/[\s\-]/g, '').toLowerCase();
                  return rClean.includes(q) || (r as string).includes(dictionarySearchQuery.trim());
                });

                if (uniqueRoots.length === 0) {
                  return (
                    <div 
                      className="text-center py-16 rounded-2xl border"
                      style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.cardBorder }}
                    >
                      <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <h3 className="font-arabic font-bold text-xl mb-1">کوئی مادہ نہیں ملا</h3>
                      <p className="text-sm opacity-70 font-urdu">دوسرا مادہ یا لفظ لکھ کر تلاش کریں۔</p>
                    </div>
                  );
                }

                return uniqueRoots.slice(0, 25).map((rootStr, rIdx) => {
                  const entry = getDictionaryEntry(rootStr as string);
                  const matchingWords = chapterWords.filter(w => w.root === rootStr);

                  return (
                    <div
                      key={rIdx}
                      className="card-print p-6 rounded-2xl border transition-all duration-200 hover:shadow-md space-y-4"
                      style={{ 
                        backgroundColor: currentTheme.cardBg, 
                        borderColor: currentTheme.cardBorder,
                        borderRightWidth: '4px',
                        borderRightColor: currentTheme.cardAccentBorder
                      }}
                    >
                      {/* Entry Header */}
                      <div className="flex flex-wrap items-center justify-between pb-3 border-b gap-3" style={{ borderColor: currentTheme.cardBorder }}>
                        <div className="flex items-center gap-3">
                          <span 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ backgroundColor: currentTheme.badgeBg, color: currentTheme.primaryText }}
                          >
                            {rIdx + 1}
                          </span>
                          <div>
                            <h3 className="font-arabic font-bold text-2xl" style={{ color: currentTheme.primaryText }}>
                              مَادَّةُ ({entry.cleanRoot})
                            </h3>
                            <span className="text-xs font-medium opacity-70 font-arabic">
                              حروفِ اصلیہ: {entry.root}
                            </span>
                          </div>
                        </div>

                        {/* Words from chapter derived from this root */}
                        {matchingWords.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-urdu opacity-75">اس سبق کے کلمات:</span>
                            {matchingWords.map((mw, mIdx) => (
                              <button
                                key={mIdx}
                                onClick={() => handleOpenWord(mw)}
                                className="px-2 py-0.5 rounded text-xs font-arabic font-bold border hover:bg-black/5 transition cursor-pointer"
                                style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
                              >
                                {mw.w || mw.word}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Urdu Linguistic Summary */}
                      <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs font-urdu leading-relaxed text-amber-950">
                        <strong>خلاصۂ لغت: </strong> {entry.urduSummary}
                      </div>

                      {/* 1. القاموس المحيط */}
                      <div className="p-3.5 rounded-xl border bg-white space-y-1.5 shadow-2xs" style={{ borderColor: currentTheme.cardBorder }}>
                        <div className="flex items-center gap-2 font-bold text-emerald-900 border-b pb-1 text-xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          <span>الْقَامُوسُ الْمُحِيطُ — الفَيْرُوزَآبَادِيُّ (ت ۸۱۷ھ):</span>
                        </div>
                        <p className="font-arabic text-sm text-slate-800 leading-relaxed">
                          {entry.qamoosMuhit}
                        </p>
                      </div>

                      {/* 2. لسان العرب */}
                      <div className="p-3.5 rounded-xl border bg-white space-y-1.5 shadow-2xs" style={{ borderColor: currentTheme.cardBorder }}>
                        <div className="flex items-center gap-2 font-bold text-blue-900 border-b pb-1 text-xs">
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          <span>لِسَانُ الْعَرَبِ — ابْنُ مَنْظُورٍ (ت ٧١١ھ):</span>
                        </div>
                        <p className="font-arabic text-sm text-slate-800 leading-relaxed">
                          {entry.lisanAlArab}
                        </p>
                      </div>

                      {/* 3. المعجم الوسيط */}
                      <div className="p-3.5 rounded-xl border bg-white space-y-1.5 shadow-2xs" style={{ borderColor: currentTheme.cardBorder }}>
                        <div className="flex items-center gap-2 font-bold text-amber-900 border-b pb-1 text-xs">
                          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                          <span>الْمُعْجَمُ الْوَسِيطُ — مَجْمَعُ اللُّغَةِ الْعَرَبِيَّةِ:</span>
                        </div>
                        <p className="font-arabic text-sm text-slate-800 leading-relaxed">
                          {entry.alMujamAlWaseet}
                        </p>
                      </div>

                      {/* Card Footer with external dictionary links */}
                      <div className="pt-2 flex items-center justify-between text-xs border-t opacity-85" style={{ borderColor: currentTheme.cardBorder }}>
                        <span className="font-urdu text-[11px]">مستند آن لائن معجم:</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://www.almaany.com/ar/dict/ar-ar/${encodeURIComponent(entry.cleanRoot)}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-md border text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition inline-flex items-center gap-1 shadow-2xs"
                            title="معجم المعاني الجامع (محفوظ و مستند)"
                          >
                            <span>المعاني الجامع ↗</span>
                          </a>
                        </div>
                      </div>

                    </div>
                  );
                });
              })()}
            </div>

          </div>
        )}

      </main>

      {/* 
        ========================================================================
        EXACT SARFI TAHQEEQ MODAL - MATCHING USER'S APP STYLE (tehqeeqModal)
        ========================================================================
      */}
      {activeWord && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs overflow-y-auto"
          onClick={() => setActiveWord(null)}
        >
          <div 
            className="bg-white w-[92%] max-w-[490px] rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 border border-slate-200 flex flex-col my-auto max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              backgroundColor: currentTheme.cardBg, 
              borderColor: currentTheme.cardBorder 
            }}
          >
            {/* Modal Header Bar */}
            <div 
              className="text-white px-6 py-4 text-center relative flex-shrink-0"
              style={{ background: currentTheme.modalHeaderBg }}
            >
              <button 
                onClick={() => setActiveWord(null)}
                className="absolute top-2.5 left-4 text-white/80 hover:text-white text-3xl font-light cursor-pointer transition leading-none p-1"
                title="بند کریں"
              >
                &times;
              </button>

              <h2 className="font-arabic text-3xl sm:text-4xl font-bold text-white mb-1 tracking-wide px-8">
                {activeWord.w || activeWord.word}
              </h2>
              <p className="text-xs text-white/85 font-medium tracking-wide">
                صرفی و لغوی تحقیق
              </p>
            </div>

            {/* Modal Sub-Tabs: Sarf vs Classical Dictionaries */}
            {(() => {
              const dictEntry = getDictionaryEntry(activeWord.root || '', activeWord.w || activeWord.word || '');
              return (
                <>
                  <div className="flex border-b text-xs font-bold shrink-0" style={{ borderColor: currentTheme.cardBorder }}>
                    <button
                      onClick={() => setModalViewTab('sarf')}
                      className={`flex-1 py-2.5 text-center transition cursor-pointer border-b-2 ${
                        modalViewTab === 'sarf' ? 'border-emerald-700 font-bold text-emerald-800' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      مستند صرفی تحقیق
                    </button>
                    <button
                      onClick={() => setModalViewTab('dictionary')}
                      className={`flex-1 py-2.5 text-center transition cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
                        modalViewTab === 'dictionary' ? 'border-amber-700 font-bold text-amber-800' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                      <span>معاجمِ ثلاثہ (لغت)</span>
                    </button>
                  </div>

                  {modalViewTab === 'dictionary' ? (
                    <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 text-xs font-arabic">
                      {/* Root Header */}
                      <div className="p-3.5 rounded-xl border bg-amber-50/70 border-amber-200 text-amber-950">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs font-urdu">جَذْرُ الْكَلِمَةِ (مادہ و حروفِ اصلیہ):</span>
                          <span className="font-bold font-arabic text-base tracking-widest bg-white px-2.5 py-0.5 rounded border border-amber-300">
                            {activeWord.root || dictEntry.root}
                          </span>
                        </div>
                        <p className="font-urdu text-xs leading-relaxed">
                          {dictEntry.urduSummary}
                        </p>
                      </div>

                      {/* 1. القاموس المحيط */}
                      <div className="p-3.5 rounded-xl border bg-white space-y-1.5 shadow-2xs" style={{ borderColor: currentTheme.cardBorder }}>
                        <div className="flex items-center gap-2 font-bold text-emerald-900 border-b pb-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          <span>الْقَامُوسُ الْمُحِيطُ — الفَيْرُوزَآبَادِيُّ (ت ۸۱۷ھ):</span>
                        </div>
                        <p className="font-arabic text-sm text-slate-800 leading-relaxed">
                          {dictEntry.qamoosMuhit}
                        </p>
                      </div>

                      {/* 2. لسان العرب */}
                      <div className="p-3.5 rounded-xl border bg-white space-y-1.5 shadow-2xs" style={{ borderColor: currentTheme.cardBorder }}>
                        <div className="flex items-center gap-2 font-bold text-blue-900 border-b pb-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          <span>لِسَانُ الْعَرَبِ — ابْنُ مَنْظُورٍ (ت ٧١١ھ):</span>
                        </div>
                        <p className="font-arabic text-sm text-slate-800 leading-relaxed">
                          {dictEntry.lisanAlArab}
                        </p>
                      </div>

                      {/* 3. المعجم الوسيط */}
                      <div className="p-3.5 rounded-xl border bg-white space-y-1.5 shadow-2xs" style={{ borderColor: currentTheme.cardBorder }}>
                        <div className="flex items-center gap-2 font-bold text-amber-900 border-b pb-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                          <span>الْمُعْجَمُ الْوَسِيطُ — مَجْمَعُ اللُّغَةِ الْعَرَبِيَّةِ:</span>
                        </div>
                        <p className="font-arabic text-sm text-slate-800 leading-relaxed">
                          {dictEntry.alMujamAlWaseet}
                        </p>
                      </div>

                      {/* Online External Lexicons */}
                      <div className="pt-2 flex items-center justify-between gap-2 border-t" style={{ borderColor: currentTheme.cardBorder }}>
                        <span className="text-xs font-urdu opacity-75">مستند آن لائن معجم:</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://www.almaany.com/ar/dict/ar-ar/${encodeURIComponent(dictEntry.cleanRoot)}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-md border text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition inline-flex items-center gap-1 shadow-2xs"
                            title="معجم المعاني الجامع (محفوظ و مستند)"
                          >
                            <span>المعاني الجامع ↗</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 sm:p-6 overflow-y-auto space-y-0 text-sm font-arabic">
                      
                      {/* سِہ اَقْسَام */}
              {activeWord.qism && (
                <div className="info-row">
                  <span className="info-label">سِہ اَقْسَام:</span>
                  <span className="info-value font-medium">{activeWord.qism}</span>
                </div>
              )}

              {/* مفرد (if exists) */}
              {activeWord.singular && (
                <div className="info-row">
                  <span className="info-label">مفرد:</span>
                  <span className="info-value font-medium">{activeWord.singular}</span>
                </div>
              )}

              {/* جمع (if exists) */}
              {activeWord.plural && (
                <div className="info-row">
                  <span className="info-label">جمع:</span>
                  <span className="info-value font-medium">{activeWord.plural}</span>
                </div>
              )}

              {/* مَادَّہ (حروفِ اصلیہ) */}
              {activeWord.root && (
                <div className="info-row">
                  <span className="info-label">مَادَّہ:</span>
                  <span className="info-value font-bold text-base tracking-widest">{activeWord.root}</span>
                </div>
              )}

              {/* صِّیغَہ */}
              {activeWord.seegha && (
                <div className="info-row">
                  <span className="info-label">صِّیغَہ:</span>
                  <span className="info-value font-medium">{activeWord.seegha}</span>
                </div>
              )}

              {/* بَحْث */}
              {activeWord.bahas && (
                <div className="info-row">
                  <span className="info-label">بَحْث:</span>
                  <span className="info-value font-medium">{activeWord.bahas}</span>
                </div>
              )}

              {/* شَش اَقْسَام */}
              {activeWord.shash && (
                <div className="info-row">
                  <span className="info-label">شُشَّ اِقْسَام:</span>
                  <span className="info-value font-medium">{activeWord.shash}</span>
                </div>
              )}

              {/* بَاب کَا نَام */}
              {activeWord.bab && (
                <div className="info-row">
                  <span className="info-label">بَاب:</span>
                  <span className="info-value font-medium">{activeWord.bab}</span>
                </div>
              )}

              {/* هَفْت اَقْسَام */}
              {activeWord.haft && (
                <div className="info-row">
                  <span className="info-label">ہَفْتِ اِقْسَام:</span>
                  <span className="info-value font-medium">{activeWord.haft}</span>
                </div>
              )}

              {/* وَزْن - EXPLICITLY SHOWN HEADING AS REQUESTED */}
              <div className="info-row">
                <span className="info-label font-bold text-amber-800">وزن:</span>
                <span className="info-value font-medium text-base">
                  {activeWord.wazn || '-------'}
                </span>
              </div>

              {/* مَعْنٰی (لغوی معنی) */}
              <div className="info-row !border-b-0">
                <span className="info-label">معنی:</span>
                <span className="info-value font-urdu text-base leading-relaxed" style={{ color: currentTheme.urduColor }}>
                  {activeWord.meaning || '---'}
                </span>
              </div>

              {/* Extra (فائدہ) if present */}
              {activeWord.extra && activeWord.extra.trim() && (
                <div className="mt-3 p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-slate-800 leading-relaxed font-urdu">
                  <strong>فائدہ: </strong> {activeWord.extra}
                </div>
              )}

            </div>
          )}
        </>
      );
    })()}

            {/* Modal Actions Footer with Arabic & Urdu Audio */}
            <div 
              className="px-5 py-3.5 border-t flex items-center justify-between gap-3"
              style={{ backgroundColor: currentTheme.badgeBg, borderColor: currentTheme.cardBorder }}
            >
              <div className="flex items-center gap-2">
                {/* Arabic Audio Button */}
                <button
                  onClick={() => handlePlayVoice(activeWord.w || activeWord.word || '', 'ar', 'modal-word-ar')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer bg-white hover:bg-slate-50 shadow-2xs"
                  style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
                  title="عربی آواز سنیں"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>عربی آواز</span>
                </button>

                {/* Urdu Audio Button */}
                <button
                  onClick={() => handlePlayVoice(activeWord.meaning || '', 'ur', 'modal-word-ur')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer bg-white hover:bg-slate-50 shadow-2xs"
                  style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
                  title="اردو معنی سنیں"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>اردو آواز</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyModalWord}
                  className="p-1.5 rounded-lg border bg-white hover:bg-slate-50 transition cursor-pointer text-xs flex items-center gap-1"
                  style={{ borderColor: currentTheme.cardBorder, color: currentTheme.primaryText }}
                  title="تحقیق نقل کریں"
                >
                  {copiedModalWord ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedModalWord ? 'کاپی شدہ' : 'کاپی'}</span>
                </button>

                <button
                  onClick={() => toggleBookmark(activeWord.w || activeWord.word || '')}
                  className="p-1.5 rounded-lg border bg-white hover:bg-slate-50 transition cursor-pointer"
                  style={{ borderColor: currentTheme.cardBorder }}
                  title="محفوظ کریں"
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkedWords.includes((activeWord.w || activeWord.word || '').trim()) ? 'text-amber-500 fill-amber-500' : 'opacity-50'}`} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 
        ========================================================================
        SIDEBAR DRAWER (CHAPTER SELECTION)
        ========================================================================
      */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-start"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            className="w-[85%] max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 border-l"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              backgroundColor: currentTheme.cardBg, 
              borderColor: currentTheme.cardBorder 
            }}
          >
            {/* Drawer Header */}
            <div 
              className="p-5 border-b flex items-center justify-between"
              style={{ borderColor: currentTheme.cardBorder }}
            >
              <div>
                <h3 className="font-arabic font-bold text-lg" style={{ color: currentTheme.primaryText }}>
                  فہرست ابواب (33 اسباق)
                </h3>
                <p className="text-xs font-urdu opacity-70">
                  مستند اسباق برائے نصابِ ادب عربی
                </p>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg hover:bg-black/5 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b" style={{ borderColor: currentTheme.cardBorder }}>
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-3 opacity-50" />
                <input
                  type="text"
                  placeholder="سبق کا عنوان یا مصنف تلاش کریں..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 rounded-xl text-xs border focus:outline-none transition"
                  style={{ 
                    borderColor: currentTheme.cardBorder,
                    backgroundColor: currentTheme.bg,
                    color: currentTheme.primaryText 
                  }}
                />
              </div>

              {/* Latest Updated Chapters Quick Cards */}
              {!searchQuery && (
                <div className="mt-3 space-y-1.5">
                  <div 
                    onClick={() => handleSelectChapter(32)}
                    className="p-2.5 rounded-xl border border-emerald-400 bg-emerald-500/15 hover:bg-emerald-500/25 cursor-pointer transition flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                        33
                      </span>
                      <div className="truncate text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-700 text-white font-urdu font-bold">
                            جدید ترین تحقیق
                          </span>
                          <p className="font-arabic font-bold text-xs text-emerald-950 dark:text-emerald-200 truncate">
                            الْفِرْدَوْسُ الْإِسْلَامِيُّ فِي قَارَّةِ آسِيَا
                          </p>
                        </div>
                        <p className="font-urdu text-[11px] opacity-75 truncate">۵۳ کلمات کی جامع صرفی و لغوی تحقیق (۱۱۶ پیراگراف)</p>
                      </div>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-emerald-700 shrink-0" />
                  </div>

                  <div 
                    onClick={() => handleSelectChapter(4)}
                    className="p-2 rounded-xl border border-amber-300/80 bg-amber-500/10 hover:bg-amber-500/20 cursor-pointer transition flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        5
                      </span>
                      <div className="truncate text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-600 text-white font-urdu font-bold">
                            بنو سعد
                          </span>
                          <p className="font-arabic font-bold text-xs truncate">
                            فِي بَنِي سَعْدٍ
                          </p>
                        </div>
                        <p className="font-urdu text-[10px] opacity-75 truncate">بنو سعد میں بچپن اور رضاعت کے ایام</p>
                      </div>
                    </div>
                    <ChevronLeft className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  </div>

                  <div 
                    onClick={() => handleSelectChapter(0)}
                    className="p-2 rounded-xl border border-slate-300/80 bg-slate-500/10 hover:bg-slate-500/20 cursor-pointer transition flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        1
                      </span>
                      <div className="truncate text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-700 text-white font-urdu font-bold">
                            سورۃ الفرقان
                          </span>
                          <p className="font-arabic font-bold text-xs truncate">
                            عِبَادُ الرَّحْمٰنِ
                          </p>
                        </div>
                        <p className="font-urdu text-[10px] opacity-75 truncate">رحمن کے برگزیدہ بندے (۱۸ آیات، ۷۰ کلمات)</p>
                      </div>
                    </div>
                    <ChevronLeft className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  </div>
                </div>
              )}
            </div>

            {/* Chapter Items List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {CHAPTERS
                .map((ch, idx) => ({ ...ch, originalIndex: idx }))
                .filter(ch => {
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase().trim();
                  return ch.title.toLowerCase().includes(q) || 
                         ch.urduTitle.toLowerCase().includes(q) || 
                         (ch.attribution && ch.attribution.toLowerCase().includes(q));
                })
                .map((ch) => {
                  const isSelected = selectedChapterIndex === ch.originalIndex;
                  return (
                    <button
                      key={ch.originalIndex}
                      onClick={() => handleSelectChapter(ch.originalIndex)}
                      className={`w-full text-right p-3 rounded-xl transition flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected ? 'font-bold shadow-xs' : 'hover:bg-black/5'
                      }`}
                      style={{ 
                        backgroundColor: isSelected ? currentTheme.badgeBg : 'transparent',
                        color: isSelected ? currentTheme.activeAccent : currentTheme.primaryText
                      }}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                          style={{ 
                            backgroundColor: isSelected ? currentTheme.activeAccent : currentTheme.cardBorder,
                            color: isSelected ? '#FFFFFF' : currentTheme.secondaryText
                          }}
                        >
                          {ch.originalIndex + 1}
                        </span>
                        <div className="truncate text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                            {(ch.originalIndex === 32 || ch.originalIndex === 4 || ch.originalIndex === 3 || ch.originalIndex === 0 || ch.originalIndex === 1 || ch.originalIndex === 2) && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-urdu font-bold border ${
                                ch.originalIndex === 32
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-extrabold shadow-2xs'
                                  : ch.originalIndex === 4
                                  ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                                  : 'bg-slate-100 text-slate-800 border-slate-300'
                              }`}>
                                {ch.originalIndex === 32 ? 'جدید ترین (53 کلمات)' : ch.originalIndex === 4 ? 'سبق ۵' : ch.originalIndex === 3 ? 'معجزانہ خطاب' : ch.originalIndex === 0 ? 'سورۃ الفرقان' : 'مکمل تحقیق'}
                              </span>
                            )}
                            <p className="font-arabic text-sm truncate leading-snug">{ch.title}</p>
                          </div>
                          <p className="font-urdu text-[11px] opacity-70 truncate leading-snug">{ch.urduTitle}</p>
                        </div>
                      </div>

                      {isSelected && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  );
                })}
            </div>

          </div>
        </div>
      )}

      {/* 
        ========================================================================
        SCHOLARLY RESOURCES TRUST MODAL (معتمد مصادر و مراجع)
        ========================================================================
      */}
      {isResourcesModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
          onClick={() => setIsResourcesModalOpen(false)}
        >
          <div 
            className="bg-white w-[92%] max-lg rounded-2xl shadow-2xl overflow-hidden p-6 relative border animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              backgroundColor: currentTheme.cardBg, 
              borderColor: currentTheme.cardBorder 
            }}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: currentTheme.cardBorder }}>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-amber-700" />
                <h3 className="font-arabic font-bold text-xl" style={{ color: currentTheme.primaryText }}>
                  معتمد مصادر، مراجع اور علمی اسناد
                </h3>
              </div>
              <button 
                onClick={() => setIsResourcesModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-urdu leading-relaxed max-h-[65vh] overflow-y-auto pr-1" style={{ color: currentTheme.urduColor }}>
              <p>
                یہ ایپلیکیشن <strong>وفاق المدارس العربیہ</strong> اور معروف اسلامی جامعات کے نصاب میں شامل شاہکار کتاب <em>مختارات من أدب العرب</em> (تالیف: مفکر اسلام حضرت مولانا سید ابو الحسن علی ندوی رحمہ اللہ) کی بنیاد پر مرتب کی گئی ہے۔
              </p>

              <div className="p-3.5 rounded-xl border bg-slate-50/50 space-y-2">
                <h4 className="font-bold text-sm font-arabic text-emerald-900">کتبِ لغت و صرف و نحو جن سے تحقیق لی گئی:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>القاموس المحیط</strong> — علامہ مجد الدین الفیروز آبادی</li>
                  <li><strong>لسان العرب</strong> — علامہ ابن منظور الافریقی</li>
                  <li><strong>المعجم الوسیط</strong> — مجمع اللغة العربية بالقاهرة</li>
                  <li><strong>شذا العرف فی فن الصرف</strong> — الشیخ احمد الحملاوی</li>
                  <li><strong>علم الصیغہ</strong> و <strong>جامع الابواب</strong> — مستند درسی شروح</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl border bg-amber-50/60 space-y-1.5 text-amber-900 border-amber-200">
                <h4 className="font-bold text-sm font-arabic">صوتی تلفظ و آواز (Dual Audio Engine):</h4>
                <p>
                  ایپلیکیشن میں دوہرا آڈیو نظام (Dual-Engine Audio) دیا گیا ہے:
                  عربی کے لیے فصیح عربی تجویدی تلفظ اور اردو کے لیے سلیس اردو آواز، جو تمام براؤزرز اور موبائل فونز پر بغیر کسی اضافی سافٹ ویئر کے فوری اور واضح چلتی ہے۔
                </p>
              </div>

              <div className="pt-2 text-center">
                <p className="font-arabic font-bold text-sm text-emerald-800">
                  جَزَى اللّٰهُ الْقَائِمِينَ عَلَيْهِ خَيْرَ الْجَزَاءِ فِي الدُّنْيَا وَالْآخِرَةِ
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t text-center" style={{ borderColor: currentTheme.cardBorder }}>
              <button
                onClick={() => setIsResourcesModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white transition cursor-pointer shadow-xs"
                style={{ backgroundColor: currentTheme.activeAccent }}
              >
                سمجھ گیا / بند کریں
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        SHARE APPLICATION MODAL (ایپلیکیشن شیئر کریں)
        ========================================================================
      */}
      {isShareModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div 
            className="bg-white w-[92%] max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 relative border animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              backgroundColor: currentTheme.cardBg, 
              borderColor: currentTheme.cardBorder 
            }}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: currentTheme.cardBorder }}>
              <div className="flex items-center gap-2">
                <Share2 className="w-6 h-6 text-emerald-700" />
                <h3 className="font-arabic font-bold text-xl" style={{ color: currentTheme.primaryText }}>
                  ایپلیکیشن دوستوں اور طلبہ سے شیئر کریں
                </h3>
              </div>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-urdu leading-relaxed" style={{ color: currentTheme.urduColor }}>
              <p className="text-sm">
                آپ اس ایپلیکیشن کا لنک اپنے اساتذہ، طلبہ اور احباب کے ساتھ واٹس ایپ اور سوشل میڈیا پر باآسانی شیئر کر سکتے ہیں۔
              </p>

              {/* Public URL Box - Verified Working */}
              <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold font-arabic text-emerald-900 text-sm">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>عام لوگوں اور طلبہ کے لیے پبلک لنک (Public Link):</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    بغیر کسی لاگ ان کے فعال ✅
                  </span>
                </div>

                <div className="p-2.5 rounded-xl border bg-white flex items-center justify-between gap-2 shadow-2xs border-emerald-200">
                  <input 
                    type="text" 
                    readOnly 
                    value={effectiveShareUrl}
                    className="w-full bg-transparent text-xs text-slate-800 select-all font-mono outline-none font-semibold"
                    dir="ltr"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(effectiveShareUrl);
                        setCopiedShareLink(true);
                        setTimeout(() => setCopiedShareLink(false), 2500);
                      }}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white cursor-pointer transition shadow-2xs flex items-center gap-1"
                      style={{ backgroundColor: currentTheme.activeAccent }}
                    >
                      {copiedShareLink ? '✓ کاپی ہو گیا!' : 'لنک کاپی کریں'}
                    </button>
                    <a
                      href={effectiveShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 cursor-pointer transition"
                      title="اس لنک کو نئے ٹیب میں کھول کر ٹیسٹ کریں"
                    >
                      چیک کریں ↗
                    </a>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-800 leading-normal">
                  یہی وہ لنک ہے جو آپ کو واٹس ایپ یا سوشل میڈیا پر بھیجنا ہے۔ اسے کھولنے پر کوئی لاگ ان یا 403 ایرر نہیں آتا۔
                </p>
              </div>

              {/* Explanatory callout for 403 Error */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 font-bold font-arabic text-xs text-slate-900">
                  <span>💡 403 ایرر کی وضاحت اور دونوں لنکس کا فرق:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] leading-relaxed">
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-950">
                    <div className="font-bold text-red-800 mb-1 flex items-center gap-1">
                      <span>❌ ڈویلپمنٹ لنک (ais-dev-)</span>
                    </div>
                    <p>
                      یہ آپ کا ذاتی ایڈیٹر لنک ہے۔ جب کوئی دوسرا شخص اسے کھولتا ہے تو گوگل <strong>"403, that's an error"</strong> دکھاتا ہے کیونکہ اس پر صرف آپ کے اکاؤنٹ کو اجازت ہوتی ہے۔
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <div className="font-bold text-emerald-800 mb-1 flex items-center gap-1">
                      <span>✅ لائف ٹائم پبلک لنک (Vercel)</span>
                    </div>
                    <p>
                      آپ کی ایپ اب مستقل کلاؤڈ ہوسٹنگ پر فعال ہے۔ <code className="font-mono font-bold">mukhtaraat-app.vercel.app</code> دنیا کے تمام طلبہ اور اساتذہ کے لیے بغیر کسی رکاوٹ کے 24 گھنٹے دستیاب ہے۔
                    </p>
                  </div>
                </div>
              </div>

              {/* Custom / Deployed URL override option */}
              <div className="p-3 rounded-xl border bg-slate-50/80 space-y-2" style={{ borderColor: currentTheme.cardBorder }}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">مخصوص پبلک لنک درج کریں (اختیاری):</span>
                  {customShareUrl && (
                    <button
                      onClick={() => {
                        setCustomShareUrl('');
                        try { localStorage.removeItem('mukhtaraat_custom_share_url'); } catch {}
                      }}
                      className="text-[11px] text-red-600 hover:underline cursor-pointer"
                    >
                      ری سیٹ کریں
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="مثلاً: https://ais-pre-...run.app یا آپ کا ڈومین"
                  value={customShareUrl}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    setCustomShareUrl(val);
                    try {
                      if (val) localStorage.setItem('mukhtaraat_custom_share_url', val);
                      else localStorage.removeItem('mukhtaraat_custom_share_url');
                    } catch {}
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono text-slate-800 outline-none focus:border-emerald-600"
                  dir="ltr"
                />
              </div>

              {/* Instant Social Share Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* Native Device Share (Android / iOS / Desktop) */}
                {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                  <button
                    onClick={async () => {
                      try {
                        await navigator.share({
                          title: 'مختارات من أدب العرب — تيسير وفهم مع صرفی و لغوی تحقیق',
                          text: 'مختارات من أدب العرب مع مستند صرفی و لغوی تحقیق، اوزان اور صوتی تلفظ:',
                          url: effectiveShareUrl,
                        });
                      } catch {
                        // ignore user abort
                      }
                    }}
                    className="p-3 rounded-xl border border-purple-300 bg-purple-50 hover:bg-purple-100 transition flex items-center justify-center gap-1.5 font-bold text-purple-900 text-xs text-center cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-purple-700" />
                    <span>موبائل شیئر (Native)</span>
                  </button>
                )}

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `مختارات من أدب العرب (مع مستند صرفی و لغوی تحقیق، اوزان اور صوتی تلفظ):\n${effectiveShareUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition flex items-center justify-center gap-1.5 font-bold text-emerald-800 text-xs text-center cursor-pointer"
                >
                  <span>💬 واٹس ایپ پر بھیجیں</span>
                </a>

                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    effectiveShareUrl
                  )}&text=${encodeURIComponent('مختارات من أدب العرب مع صرفی تحقیق و صوتی تلفظ')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 transition flex items-center justify-center gap-1.5 font-bold text-sky-800 text-xs text-center cursor-pointer"
                >
                  <span>📢 ٹیلیگرام پر بھیجیں</span>
                </a>
              </div>

              {/* QR Code for Mobile Scanning */}
              <div className="p-4 rounded-xl border bg-slate-50 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right" style={{ borderColor: currentTheme.cardBorder }}>
                <div className="bg-white p-2 rounded-xl border shadow-2xs shrink-0">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(
                      effectiveShareUrl
                    )}`}
                    alt="ایپلیکیشن کا کیو آر کوڈ"
                    className="w-28 h-28 mx-auto"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm font-arabic" style={{ color: currentTheme.primaryText }}>
                    موبائل کیمرے سے اسکین کریں
                  </h4>
                  <p className="text-xs opacity-75">
                    طلبہ یا اساتذہ اپنے فون کا کیمرہ اس کوڈ کے سامنے لا کر فوراً یہ ایپ اپنے موبائل پر کھول سکتے ہیں۔
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-3.5 rounded-xl border bg-emerald-50/60 border-emerald-200 text-emerald-950 space-y-1">
                <h4 className="font-bold font-arabic text-xs">فائدہ برائے اساتذہ و طلبہ:</h4>
                <p>
                  سامعین یا طلبہ کو کسی ایپ یا اکاؤنٹ کی ضرورت نہیں۔ وہ اپنے موبائل (اینڈرائڈ یا آئی فون) پر صرف اس لنک پر کلک کر کے فوری طور پر تمام اسباق، لغت اور صوتی تلفظ سے مستفید ہو سکتے ہیں۔
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t text-center" style={{ borderColor: currentTheme.cardBorder }}>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white transition cursor-pointer shadow-xs"
                style={{ backgroundColor: currentTheme.activeAccent }}
              >
                بند کریں
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 
        ========================================================================
        FOOTER
        ========================================================================
      */}
      <footer 
        className="border-t py-6 mt-12 transition-colors duration-200 text-center text-xs font-urdu opacity-75"
        style={{ 
          backgroundColor: currentTheme.headerBg, 
          borderColor: currentTheme.headerBorder,
          color: currentTheme.secondaryText
        }}
      >
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            مختارات من أدب العرب — تصحیح و تحقیق برائے طلبۂ علومِ اسلامیہ و ادبیاتِ عربیہ
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsResourcesModalOpen(true)}
              className="hover:underline cursor-pointer"
            >
              مصادر و مراجع
            </button>
            <span>•</span>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:underline cursor-pointer"
            >
              اوپر جائیں ↑
            </button>
          </div>
        </div>
      </footer>

      {/* 
        ========================================================================
        PERSISTENT AUDIO PLAYBACK BAR (FLOATING BOTTOM)
        ========================================================================
      */}
      {audioState.isPlaying && (
        <div 
          className="fixed bottom-4 inset-x-4 max-w-xl mx-auto z-50 bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200"
          dir="rtl"
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Animated Speaker / Soundwaves */}
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                  {audioState.lang === 'ar' ? 'عربی قراءت' : 'اردو ترجمہ'}
                </span>
                {audioState.chunkProgress && audioState.chunkProgress.total > 1 && (
                  <span className="text-[11px] font-mono text-slate-300">
                    حصہ {audioState.chunkProgress.current} از {audioState.chunkProgress.total}
                  </span>
                )}
              </div>
              <p className="text-xs font-arabic truncate text-slate-200 mt-0.5 max-w-[200px] sm:max-w-xs">
                {audioState.currentText || 'صوتی تلفظ جاری ہے...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Speed Toggle */}
            <button
              onClick={() => setSpeechRate(speechRate === 0.75 ? 1.0 : speechRate === 1.0 ? 1.25 : 0.75)}
              className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 transition cursor-pointer"
              title="آواز کی رفتار تبدیل کریں"
            >
              {speechRate}x
            </button>

            {/* Stop Audio Button */}
            <button
              onClick={stopAllAudio}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="آواز بند کریں"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>روکیں</span>
            </button>
          </div>
        </div>
      )}

      {/* Audio volume notice if silent/error */}
      {audioState.error && (
        <div 
          className="fixed bottom-4 left-4 z-50 bg-amber-900 text-white px-4 py-2.5 rounded-xl text-xs font-urdu shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-2"
        >
          <span>📢 {audioState.error}</span>
          <button 
            onClick={stopAllAudio} 
            className="text-amber-200 hover:text-white font-bold ml-2 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

    </div>
  );
}
