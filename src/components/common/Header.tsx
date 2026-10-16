import React from 'react';
import { 
  Calculator, 
  Sun,
  Moon,
  Crown,
  User,
  Sparkles
} from 'lucide-react';
import { ToolId } from '../../types';
import { LanguageSelector } from './LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { AppLogo } from './AppLogo';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

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
  const { t, language } = useLanguage();
  const { themeId, toggleTheme } = useTheme();
  const { user, isVip, setIsLoginModalOpen, setIsPricingModalOpen } = useAuth();
  const isVi = language === 'vi';

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

        {/* Right: VIP, User Login, Currency Selector (USD/VND), Language Switcher, Theme Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* VIP Upgrade Button */}
          <button
            id="header-vip-btn"
            type="button"
            onClick={() => setIsPricingModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 ${
              isVip
                ? 'bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25'
                : 'bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 hover:brightness-105 text-white shadow-amber-500/20'
            }`}
            title={isVip ? (isVi ? 'Gói VIP Pro đang kích hoạt' : 'Active VIP Pro Plan') : (isVi ? 'Nâng cấp Gói VIP (Chỉ 4.99$/tháng)' : 'Upgrade to VIP ($4.99/mo)')}
          >
            <Crown className={`w-3.5 h-3.5 ${isVip ? 'fill-amber-500 text-amber-500' : 'fill-white text-white'}`} />
            <span className="hidden sm:inline">
              {isVip 
                ? (user?.plan === 'yearly' ? 'VIP 1 Năm' : 'VIP Tháng') 
                : 'VIP Pro'}
            </span>
            {!isVip && (
              <span className="text-[10px] font-black bg-white/20 px-1 py-0.2 rounded-md tracking-tight">
                $4.99
              </span>
            )}
          </button>

          {/* User Account / Login Button */}
          {user ? (
            <button
              id="header-user-profile-btn"
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-300 dark:border-slate-700/80 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-all cursor-pointer shadow-xs"
              title={user.name}
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`}
                alt={user.name}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover ring-1 ring-blue-500/40 shrink-0"
              />
              <span className="hidden md:inline text-xs font-bold truncate max-w-[85px]">
                {user.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              id="header-login-btn"
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white hover:bg-slate-50 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <User className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">{isVi ? 'Đăng nhập' : 'Sign In'}</span>
            </button>
          )}

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
    </>
  );
};
