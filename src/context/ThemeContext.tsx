import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId = 'light' | 'dark';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tag: string;
  tagClass: string;
  description: string;
  dotColor: string;
  bg: string;
  headerBg: string;
  surface: string;
  subsurface: string;
  border: string;
  inputBg: string;
  inputBorder: string;
  accent: string;
  checkColor: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'light',
    name: 'Chế độ Sáng',
    tag: 'Sáng',
    tagClass: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Nền trắng chữ đen thanh lịch (#FFFFFF), độ tương phản cao sắc nét',
    dotColor: '#2563EB',
    bg: '#FFFFFF',
    headerBg: 'rgba(255, 255, 255, 0.98)',
    surface: '#FFFFFF',
    subsurface: '#F8FAFC',
    border: '#E2E8F0',
    inputBg: '#FFFFFF',
    inputBorder: '#CBD5E1',
    accent: '#2563EB',
    checkColor: '#10B981',
    textPrimary: '#000000',
    textSecondary: '#1E293B',
    textMuted: '#64748B',
  },
  {
    id: 'dark',
    name: 'Chế độ Tối',
    tag: 'Tối',
    tagClass: 'bg-slate-800 text-cyan-300 border-cyan-800/60',
    description: 'Nền tối chống mỏi mắt (#141526), ô nhập xám chữ trắng',
    dotColor: '#00E5FF',
    bg: '#141526',
    headerBg: 'rgba(20, 21, 38, 0.95)',
    surface: '#1B1D33',
    subsurface: 'rgba(27, 29, 51, 0.75)',
    border: '#272A47',
    inputBg: '#252525',
    inputBorder: '#3F3F3F',
    accent: '#00E5FF',
    checkColor: '#00E5FF',
    textPrimary: '#FFFFFF',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
  }
];

interface ThemeContextType {
  themeId: ThemeId;
  currentTheme: ThemeConfig;
  setTheme: (id: ThemeId) => void;
  toggleTheme: () => void;
  themes: ThemeConfig[];
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'ac_studio_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId;
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch {
      // Ignore storage errors
    }
    return 'light'; // Default to light mode (nền trắng chữ đen)
  });

  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    root.style.setProperty('--app-bg', currentTheme.bg);
    root.style.setProperty('--app-header-bg', currentTheme.headerBg);
    root.style.setProperty('--app-surface', currentTheme.surface);
    root.style.setProperty('--app-subsurface', currentTheme.subsurface);
    root.style.setProperty('--app-border', currentTheme.border);
    root.style.setProperty('--app-input-bg', currentTheme.inputBg);
    root.style.setProperty('--app-input-border', currentTheme.inputBorder);
    root.style.setProperty('--app-accent', currentTheme.accent);
    root.style.setProperty('--app-text-primary', currentTheme.textPrimary);
    root.style.setProperty('--app-text-secondary', currentTheme.textSecondary);
    root.style.setProperty('--app-text-muted', currentTheme.textMuted);
    root.setAttribute('data-theme', themeId);
    if (themeId === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (document.body) {
      document.body.style.backgroundColor = currentTheme.bg;
      document.body.style.color = currentTheme.textPrimary;
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeId === 'light' ? '#FFFFFF' : '#0F1628');
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch {
      // Ignore storage errors
    }
  }, [themeId, currentTheme]);

  const setTheme = (id: ThemeId) => {
    setThemeId(id);
  };

  const toggleTheme = () => {
    setThemeId(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{
      themeId,
      currentTheme,
      setTheme,
      toggleTheme,
      themes: THEMES,
      isDark: themeId === 'dark',
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
