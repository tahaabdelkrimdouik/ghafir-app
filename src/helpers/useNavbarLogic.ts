import { useState, useEffect } from 'react';

// --- Types ---
export type Theme = 'light' | 'dark';
export type Language = 'EN' | 'AR';

// --- Theme Logic ---
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check LocalStorage or System Preference
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return { theme, toggleTheme };
};

// --- Language Logic (EN/AR + RTL Support) ---
export const useLanguage = () => {
  const [lang, setLang] = useState<Language>('EN');

  useEffect(() => {
    // 1. Load saved language
    const savedLang = localStorage.getItem('lang') as Language | null;
    
    // 2. Default to EN if nothing saved
    const activeLang = savedLang === 'AR' ? 'AR' : 'EN';
    setLang(activeLang);

    // 3. Apply Direction (LTR/RTL) immediately on load
    // This ensures the direction is set even if ThemeProvider hasn't run yet
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', activeLang === 'AR' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', activeLang.toLowerCase());
    }
  }, []);

  const switchLanguage = () => {
    // Toggle between EN and AR
    const nextLang: Language = lang === 'EN' ? 'AR' : 'EN';
    
    setLang(nextLang);
    localStorage.setItem('lang', nextLang);
    
    // Update HTML Direction for Layout - CRITICAL: Must update document.documentElement
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', nextLang === 'AR' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', nextLang.toLowerCase());
    }
  };

  return { lang, switchLanguage };
};