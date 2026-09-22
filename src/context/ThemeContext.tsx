import React, { createContext, useContext, useState, useLayoutEffect, useEffect } from 'react';

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

const THEME_STORAGE_KEY = 'ac_studio_theme_mode';

/**
 * Áp dụng theme vào DOM một cách đồng bộ và triệt tiêu toàn bộ giật lag:
 * 1. Chèn tạm thời khối CSS chặn transition trên toàn bộ DOM (* { transition: none !important }).
 * 2. Cập nhật đồng bộ các biến CSS --app-*, attribute data-theme, class .dark và màu body.
 * 3. Ép reflow 1 lần duy nhất (window.getComputedStyle) để mọi phần tử nhận màu mới trong cùng 1 frame.
 * 4. Khôi phục lại transition ở frame kế tiếp qua requestAnimationFrame.
 */
export const applyThemeToDOM = (id: ThemeId, config: ThemeConfig, freezeTransitions: boolean = true) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const root = document.documentElement;
  let freezerEl: HTMLStyleElement | null = null;

  if (freezeTransitions) {
    // Kiểm tra xem freezer đã tồn tại chưa để tránh trùng lặp
    freezerEl = document.getElementById('ac-theme-transition-freezer') as HTMLStyleElement | null;
    if (!freezerEl) {
      freezerEl = document.createElement('style');
      freezerEl.id = 'ac-theme-transition-freezer';
      freezerEl.textContent = `
        *, *::before, *::after {
          -webkit-transition: none !important;
          -moz-transition: none !important;
          -o-transition: none !important;
          -ms-transition: none !important;
          transition: none !important;
        }
      `;
      document.head.appendChild(freezerEl);
    }
  }

  // Cập nhật tất cả biến CSS đồng bộ trên root
  root.style.setProperty('--app-bg', config.bg);
  root.style.setProperty('--app-header-bg', config.headerBg);
  root.style.setProperty('--app-surface', config.surface);
  root.style.setProperty('--app-subsurface', config.subsurface);
  root.style.setProperty('--app-border', config.border);
  root.style.setProperty('--app-input-bg', config.inputBg);
  root.style.setProperty('--app-input-border', config.inputBorder);
  root.style.setProperty('--app-accent', config.accent);
  root.style.setProperty('--app-text-primary', config.textPrimary);
  root.style.setProperty('--app-text-secondary', config.textSecondary);
  root.style.setProperty('--app-text-muted', config.textMuted);

  // Cập nhật data-theme và class .dark
  root.setAttribute('data-theme', id);
  if (id === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Đồng bộ màu body
  if (document.body) {
    document.body.style.backgroundColor = config.bg;
    document.body.style.color = config.textPrimary;
  }

  // Cập nhật meta theme-color cho thanh địa chỉ mobile
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', id === 'light' ? '#FFFFFF' : '#0F1628');
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    // Ignore storage errors
  }

  if (freezeTransitions && freezerEl) {
    // Ép reflow 1 lần duy nhất trong frame này để toàn bộ các phần tử nhận màu đồng loạt
    try {
      void window.getComputedStyle(document.body).opacity;
    } catch {
      // Ignore
    }

    // Gỡ bỏ style chặn transition ở frame tiếp theo để không ảnh hưởng hover/focus thông thường
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById('ac-theme-transition-freezer');
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    });
  }
};

interface ThemeContextType {
  themeId: ThemeId;
  currentTheme: ThemeConfig;
  setTheme: (id: ThemeId) => void;
  toggleTheme: () => void;
  themes: ThemeConfig[];
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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
    return 'light'; // Mặc định chế độ sáng (nền trắng chữ đen)
  });

  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  // Sử dụng useLayoutEffect để đồng bộ DOM trước paint lần đầu, loại bỏ flash giao diện
  useLayoutEffect(() => {
    applyThemeToDOM(themeId, currentTheme, false);
  }, []);

  // Đảm bảo đồng bộ khi themeId thay đổi
  useEffect(() => {
    applyThemeToDOM(themeId, currentTheme, false);
  }, [themeId, currentTheme]);

  const setTheme = (id: ThemeId) => {
    const config = THEMES.find(t => t.id === id) || THEMES[0];
    // Áp dụng DOM đồng bộ ngay khi người dùng bấm, đóng băng transition để không bị giật lag
    applyThemeToDOM(id, config, true);
    setThemeId(id);
  };

  const toggleTheme = () => {
    const nextId: ThemeId = themeId === 'light' ? 'dark' : 'light';
    const config = THEMES.find(t => t.id === nextId) || THEMES[0];
    // Áp dụng DOM đồng bộ ngay khi người dùng bấm, đóng băng transition để không bị giật lag
    applyThemeToDOM(nextId, config, true);
    setThemeId(nextId);
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

