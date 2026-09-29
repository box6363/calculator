import React, { useState } from 'react';
import { 
  Calculator, 
  Search, 
  Command, 
  X, 
  Sun,
  Moon
} from 'lucide-react';
import { ToolId } from '../../types';
import { TOOLS_CONFIG } from '../../data/toolsData';
import { LanguageSelector } from './LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { AppLogo } from './AppLogo';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  currentToolId: ToolId;
  onSelectTool: (id: ToolId) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenTerms?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentToolId,
  onSelectTool,
  isSidebarOpen,
  onToggleSidebar,
  onOpenTerms,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t, language } = useLanguage();
  const { themeId, toggleTheme } = useTheme();
  const isVi = language === 'vi';

  const filteredTools = Object.values(TOOLS_CONFIG).filter(tool => {
    const localizedName = t.toolNames[tool.id] || tool.name;
    const localizedShort = t.toolShortNames[tool.id] || tool.shortName;
    const query = searchQuery.toLowerCase();
    return (
      tool.name.toLowerCase().includes(query) ||
      tool.shortName.toLowerCase().includes(query) ||
      localizedName.toLowerCase().includes(query) ||
      localizedShort.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <header 
        id="main-header" 
        className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 h-16 backdrop-blur-md border-b transition-colors duration-200"
        style={{
          backgroundColor: 'var(--app-header-bg, rgba(20, 21, 38, 0.95))',
          borderColor: 'var(--app-border, #272a47)'
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="sidebar-toggle-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle Sidebar"
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <div className="w-5 flex flex-col gap-1 items-start">
              <span className={`h-0.5 bg-current rounded-full transition-all duration-300 ${isSidebarOpen ? 'w-5' : 'w-5'}`} />
              <span className={`h-0.5 bg-current rounded-full transition-all duration-300 ${isSidebarOpen ? 'w-3.5' : 'w-5'}`} />
              <span className={`h-0.5 bg-current rounded-full transition-all duration-300 ${isSidebarOpen ? 'w-4' : 'w-5'}`} />
            </div>
          </button>

          {/* Logo branding */}
          <div 
            onClick={() => onSelectTool('basic')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-105 group-hover:rotate-1 transition-all duration-300">
              <AppLogo className="w-full h-full drop-shadow-md" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span 
                  className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white"
                  aria-label="Web Calculator"
                >
                  <span>Web</span>
                  <span className="ml-1.5 font-bold text-slate-900 dark:text-white">Calculator</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block -mt-0.5">{t.siteSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Right: Search, Language Switcher (16 Languages), Terms & Share */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="quick-search-trigger"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Tìm kiếm công cụ"
            className="hidden md:flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-700/60 rounded-xl transition-all shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-slate-400" />
            <span>{t.searchPlaceholder}</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-slate-200 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 rounded border border-slate-300 dark:border-slate-700">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>

          {/* Currency Selector (USD Base) */}
          <CurrencySelector variant="header" />

          {/* 16 Major Languages Selector */}
          <LanguageSelector variant="header" />

          {/* Light / Dark Mode Toggle Button */}
          <button
            id="header-theme-toggle-btn"
            onClick={toggleTheme}
            type="button"
            title={themeId === 'light' ? (isVi ? 'Chuyển sang Chế độ Tối' : 'Switch to Dark Mode') : (isVi ? 'Chuyển sang Chế độ Sáng (Nền trắng chữ đen)' : 'Switch to Light Mode')}
            aria-label={themeId === 'light' ? 'Chế độ Sáng' : 'Chế độ Tối'}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl border transition-all duration-100 cursor-pointer shadow-xs active:scale-90 scale-95 origin-center"
            style={{
              backgroundColor: themeId === 'light' ? '#f1f5f9' : 'rgba(30, 41, 59, 0.6)',
              borderColor: themeId === 'light' ? '#cbd5e1' : 'rgba(51, 65, 85, 0.8)',
              color: themeId === 'light' ? '#0f172a' : '#f8fafc',
            }}
          >
            {themeId === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                <span className="hidden lg:inline text-xs font-semibold text-slate-800">Sáng</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                <span className="hidden lg:inline text-xs font-semibold text-slate-200">Tối</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <div 
          id="search-modal-backdrop"
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4 transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            style={{
              backgroundColor: 'var(--app-surface, #1b1d33)',
              borderColor: 'var(--app-border, #272a47)'
            }}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <Search className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <input
                id="search-input"
                type="text"
                autoFocus
                placeholder={t.searchPlaceholder || "Search tools..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredTools.length === 0 ? (
                <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                  {language === 'vi' ? `Không tìm thấy công cụ phù hợp với từ khóa "${searchQuery}"` : `No matching tools found for "${searchQuery}"`}
                </div>
              ) : (
                filteredTools.map((tool) => (
                  <button
                    key={tool.id}
                    id={`search-item-${tool.id}`}
                    onClick={() => {
                      onSelectTool(tool.id);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                      currentToolId === tool.id ? 'bg-blue-50 dark:bg-blue-600/15 border border-blue-200 dark:border-blue-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">
                          {t.toolNames[tool.id] || tool.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {t.toolDescriptions[tool.id] || tool.description}
                      </p>
                    </div>
                    <span className="text-xs text-blue-500 dark:text-blue-400 font-medium pl-3 whitespace-nowrap">→</span>
                  </button>
                ))
              )}
            </div>
            
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Esc</span>
              <span>{filteredTools.length} / 9</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
