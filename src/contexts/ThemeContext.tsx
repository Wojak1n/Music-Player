import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleDarkMode: () => void;
  updateThemeColor: (key: keyof Theme, value: string) => void;
  predefinedThemes: Theme[];
}

const defaultTheme: Theme = {
  id: 'sunset',
  name: 'Dark Red',
  primary: '#DC2626',
  secondary: '#000000',
  accent: '#EF4444',
  background: '#000000',
  text: '#FFFFFF',
  isDark: true,
};

const predefinedThemes: Theme[] = [
  defaultTheme,
  {
    id: 'spotify',
    name: 'Spotify Green',
    primary: '#1DB954',
    secondary: '#191414',
    accent: '#1ED760',
    background: '#121212',
    text: '#FFFFFF',
    isDark: true,
  },
  {
    id: 'purple',
    name: 'Purple Haze',
    primary: '#8B5CF6',
    secondary: '#1F1B24',
    accent: '#A855F7',
    background: '#0F0A19',
    text: '#FFFFFF',
    isDark: true,
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    primary: '#0EA5E9',
    secondary: '#1E293B',
    accent: '#38BDF8',
    background: '#0F172A',
    text: '#FFFFFF',
    isDark: true,
  },
  {
    id: 'light',
    name: 'Light Mode',
    primary: '#3B82F6',
    secondary: '#F8FAFC',
    accent: '#1D4ED8',
    background: '#FFFFFF',
    text: '#1F2937',
    isDark: false,
  },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('music-player-theme');
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('music-player-theme', JSON.stringify(theme));
    
    // Apply CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--text', theme.text);
    
    if (theme.backgroundImage) {
      root.style.setProperty('--bg-image', `url(${theme.backgroundImage})`);
    }
  }, [theme]);

  const toggleDarkMode = () => {
    const newTheme = theme.isDark
      ? predefinedThemes.find(t => t.id === 'light') || predefinedThemes[0]
      : predefinedThemes.find(t => t.id === 'sunset') || predefinedThemes[0];
    setTheme(newTheme);
  };

  const updateThemeColor = (key: keyof Theme, value: string) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      toggleDarkMode,
      updateThemeColor,
      predefinedThemes,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};