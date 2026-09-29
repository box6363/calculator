import React, { createContext, useContext, useState, useEffect } from 'react';
import { MAJOR_LANGUAGES, LanguageCode, LanguageItem } from '../i18n/languages';
import { TRANSLATIONS, TranslationDictionary } from '../i18n/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationDictionary;
  languages: LanguageItem[];
  currentLanguageItem: LanguageItem;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === 'undefined') return 'vi';

    // 1. Check path prefix (e.g. /en/bmi, /vi/loan, /ja/basic, /en)
    const pathParts = window.location.pathname.replace(/^\/+|\/+$/g, '').split('/');
    const firstSegment = pathParts[0]?.toLowerCase() as LanguageCode;
    if (firstSegment && TRANSLATIONS[firstSegment]) {
      return firstSegment;
    }

    // 2. Check URL param ?lang=xx
    const urlParams = new URLSearchParams(window.location.search);
    const paramLang = urlParams.get('lang') as LanguageCode;
    if (paramLang && TRANSLATIONS[paramLang]) {
      return paramLang;
    }

    // 3. Check localStorage
    const saved = localStorage.getItem('ac_studio_calc_lang') as LanguageCode;
    if (saved && TRANSLATIONS[saved]) {
      return saved;
    }

    // 4. Check browser navigator language
    const browserLang = navigator.language?.slice(0, 2).toLowerCase() as LanguageCode;
    if (browserLang && TRANSLATIONS[browserLang]) {
      return browserLang;
    }

    return 'vi';
  });

  const setLanguage = (lang: LanguageCode) => {
    if (TRANSLATIONS[lang]) {
      setLanguageState(lang);
      localStorage.setItem('ac_studio_calc_lang', lang);

      // Cleanly update URL path with new language prefix: e.g. /en/bmi -> /vi/bmi
      if (typeof window !== 'undefined') {
        const pathParts = window.location.pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
        let toolPart = 'basic';

        if (pathParts.length >= 2) {
          toolPart = pathParts[1];
        } else if (pathParts.length === 1) {
          // Could be /en or /bmi
          if (TRANSLATIONS[pathParts[0] as LanguageCode]) {
            toolPart = 'basic';
          } else {
            toolPart = pathParts[0];
          }
        }

        const newPath = toolPart === 'basic' ? `/${lang}/` : `/${lang}/${toolPart}`;
        const search = window.location.search || '';
        window.history.pushState({ lang, toolId: toolPart }, '', `${newPath}${search}`);
        window.dispatchEvent(new Event('popstate'));
      }
    }
  };

  const currentLanguageItem = MAJOR_LANGUAGES.find(l => l.code === language) || MAJOR_LANGUAGES[0];
  const isRTL = currentLanguageItem.dir === 'rtl';

  useEffect(() => {
    // Update HTML tag attributes for SEO & Accessibility
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: TRANSLATIONS[language] || TRANSLATIONS.vi,
    languages: MAJOR_LANGUAGES,
    currentLanguageItem,
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
