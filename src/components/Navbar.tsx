// Navbar.tsx

import React, { useState, useEffect } from 'react';
// Assuming useNavbarLogic.ts is in the same directory or correctly imported
import { useTheme } from '../helpers/useNavbarLogic'; 

// Icon Components (to avoid external dependencies for a complete example)
const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>
);

const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
);


const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Scroll effect logic
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 transition-all duration-300">
      <div 
        className={`
          relative flex w-[90%] max-w-6xl items-center justify-between 
          rounded-full border border-white/20 px-6 py-3 shadow-xl backdrop-blur-xl transition-all duration-500
          ${scrolled ? 'bg-white/80 dark:bg-black/60 scale-100' : 'bg-white/40 dark:bg-black/20 scale-[1.02]'}
        `}
      >
        
        {/* 1. Logo Section */}
        <div className="flex items-center gap-3">
          <img
            src="/Logos/logo-png.png"
            alt="Logo"
            className="h-8 w-auto drop-shadow-sm transition-transform hover:scale-110 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} // Go to top on click
          />
        </div>

        {/* 2. Control Cluster (Theme) */}
        <div className="flex items-center gap-2">
          
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="
              flex items-center justify-center h-8 w-8 rounded-full 
              text-gray-700 transition-all duration-300 hover:bg-gray-200 
              dark:text-gray-300 dark:hover:bg-white/10
            "
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;