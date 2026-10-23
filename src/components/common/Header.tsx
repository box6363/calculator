import React, { useState, useRef, useEffect } from 'react';
import { 
  Calculator, 
  Sun,
  Moon,
  Crown,
  User,
  Sparkles,
  LogOut
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
  const { user, isVip, daysRemaining, setIsLoginModalOpen, setIsPricingModalOpen, logout } = useAuth();
  const isVi = language === 'vi';
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

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

        {/* Right: Currency Selector (USD/VND), Language Switcher, Theme Toggle, Person Icon (Sign In & VIP inside) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
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

          {/* Unified User & VIP Person Icon Button ("icon đầu người" đặt sau biểu tượng Sáng/Tối) */}
          <div className="relative" ref={userMenuRef}>
            <button
              id="header-user-menu-btn"
              type="button"
              onClick={() => setIsUserMenuOpen(prev => !prev)}
              aria-expanded={isUserMenuOpen}
              aria-label={isVi ? 'Tài khoản & Gói VIP' : 'Account & VIP'}
              className={`relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border transition-all duration-150 cursor-pointer shadow-xs active:scale-95 ${
                isVip
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-500 hover:bg-amber-500/25 ring-2 ring-amber-500/20'
                  : user
                  ? 'bg-blue-500/10 border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700/80 text-slate-700 dark:text-slate-200'
              }`}
              title={isVi ? 'Tài khoản & Gói VIP' : 'Account & VIP'}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-xl object-cover p-0.5"
                />
              ) : (
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-200" />
              )}

              {/* VIP Crown badge on the person icon */}
              {isVip && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-xs">
                  <Crown className="w-2.5 h-2.5 fill-white text-white" />
                </span>
              )}
            </button>

            {/* Dropdown Menu attached to the Person Icon */}
            {isUserMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#141526] border border-slate-200 dark:border-slate-800 shadow-2xl p-3 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                style={{
                  boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.35)'
                }}
              >
                {/* 1. User Header Section */}
                {user ? (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/40 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {user.name}
                        </span>
                        {isVip && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-500 text-white uppercase shrink-0">
                            VIP
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                        {user.email}
                      </p>
                      {daysRemaining !== undefined && isVip && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                          ✓ Còn {daysRemaining} ngày bản quyền
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-xs">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        {isVi ? 'Tài khoản Web Calculator' : 'Web Calculator Account'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {isVi ? 'Đăng nhập để đồng bộ lịch sử & kích hoạt VIP' : 'Sign in to sync calculations & activate VIP'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsLoginModalOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>{isVi ? 'Đăng nhập / Đăng ký Google' : 'Sign In with Google'}</span>
                    </button>
                  </div>
                )}

                {/* 2. VIP Package Card (Gói 13.99$ giảm về 9.99$, gói 169.99$ giảm về 109.99$, 1500 lượt hỏi AI/tháng, tắt quảng cáo) */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-amber-500/5 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-600 dark:text-amber-400">
                      <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                      <span>{isVip ? 'Gói VIP Pro đang kích hoạt' : 'Nâng cấp Gói VIP Pro'}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">
                      GIẢM ĐẾN ~35%
                    </span>
                  </div>

                  {/* Pricing lines with strike-through */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">Gói 1 Tháng:</span>
                      <div className="flex items-baseline gap-1">
                        <span className="line-through text-slate-400 text-[11px]">$13.99</span>
                        <span className="font-extrabold text-blue-600 dark:text-blue-400 text-xs">$9.99</span>
                        <span className="text-[10px] text-slate-400">/tháng</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-amber-500/30">
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                        <span>Gói 1 Năm:</span>
                        <span className="text-[9px] bg-amber-500 text-white px-1 rounded font-black">HOT</span>
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="line-through text-slate-400 text-[11px]">$169.99</span>
                        <span className="font-extrabold text-amber-500 text-xs">$109.99</span>
                        <span className="text-[10px] text-slate-400">/năm</span>
                      </div>
                    </div>
                  </div>

                  {/* Core benefits requested */}
                  <div className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300 pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span><strong>Sử dụng AI tool 1.500 lượt hỏi/tháng</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-500 font-bold shrink-0">✓</span>
                      <span><strong>Tắt 100% quảng cáo</strong> gây gián đoạn</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-blue-500 font-bold shrink-0">✓</span>
                      <span>Xuất báo cáo tính toán PDF/Excel 4K</span>
                    </div>
                  </div>

                  {/* Button to open pricing modal */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsPricingModalOpen(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 hover:brightness-105 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Crown className="w-3.5 h-3.5 fill-white" />
                    <span>{isVip ? 'Gia hạn gói VIP Pro' : 'Nâng cấp VIP (Từ $9.99)'}</span>
                  </button>
                </div>

                {/* 3. Footer Actions when logged in */}
                {user && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsLoginModalOpen(true);
                      }}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium hover:underline cursor-pointer text-xs"
                    >
                      {isVi ? 'Hồ sơ tài khoản' : 'Account Profile'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold cursor-pointer flex items-center gap-1 text-xs"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>{isVi ? 'Đăng xuất' : 'Sign out'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
