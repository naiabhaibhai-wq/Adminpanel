import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, Language } from './translations';

export type FontSizeScale = 'normal' | 'large';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  fontSizeScale: FontSizeScale;
  setFontSizeScale: (scale: FontSizeScale) => void;
  toggleFontSizeScale: () => void;
  t: (key: keyof typeof TRANSLATIONS['en']) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Try to load saved language and font preferences from storage to avoid layout shifts
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('bharat_patient_lang');
    if (saved === 'hi' || saved === 'en') return saved;
    return 'en';
  });

  const [fontSizeScale, setFontSizeScaleState] = useState<FontSizeScale>(() => {
    const saved = localStorage.getItem('bharat_patient_fontsize');
    if (saved === 'large' || saved === 'normal') return saved;
    return 'normal';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bharat_patient_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const setFontSizeScale = (scale: FontSizeScale) => {
    setFontSizeScaleState(scale);
    localStorage.setItem('bharat_patient_fontsize', scale);
  };

  const toggleFontSizeScale = () => {
    setFontSizeScale(fontSizeScale === 'normal' ? 'large' : 'normal');
  };

  // Translation helper function t(key)
  const t = (key: keyof typeof TRANSLATIONS['en']): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS['en'];
    const val = dict[key];
    if (val !== undefined) return val;
    // Fallback to English
    return TRANSLATIONS['en'][key] || String(key);
  };

  // Dynamic document title updater based on selected language
  useEffect(() => {
    if (language === 'hi') {
      document.title = "भारत अल्ट्रासाउंड एंड डायग्नोस्टिक सेंटर - सेक्टर 31 गुरुग्राम";
    } else {
      document.title = "Bharat Ultrasound And Diagnostic Centre - Sector 31 Gurugram";
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      toggleLanguage,
      fontSizeScale,
      setFontSizeScale,
      toggleFontSizeScale,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
