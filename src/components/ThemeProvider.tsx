"use client";

import { useEffect } from 'react';

/**
 * Client component that initializes theme preferences
 * on mount to prevent hydration mismatches in Next.js
 * Language is now hardcoded to Arabic (RTL) in layout.tsx
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Theme
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Ensure RTL and Arabic are always set (hardcoded)
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
  }, []);

  return <>{children}</>;
}

