
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else {
      // Auto-detect based on time of day
      const currentHour = new Date().getHours();
      const isDarkMode = currentHour >= 19 || currentHour < 6; // Dark mode from 7pm to 6am
      
      setTheme(isDarkMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
    
    // Set up interval to check time every minute
    const interval = setInterval(() => {
      // Only auto-switch if user hasn't manually set a theme
      if (!localStorage.getItem('theme')) {
        const currentHour = new Date().getHours();
        const shouldBeDark = currentHour >= 19 || currentHour < 6;
        
        if ((shouldBeDark && theme === 'light') || (!shouldBeDark && theme === 'dark')) {
          setTheme(shouldBeDark ? 'dark' : 'light');
          document.documentElement.classList.toggle('dark', shouldBeDark);
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const updateTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
