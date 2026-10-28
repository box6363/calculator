import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  Sparkles,
  Zap,
  Activity, 
  Banknote, 
  Wallet,
  Calendar, 
  Percent, 
  ArrowLeftRight, 
  Triangle, 
  TrendingUp,
  Flame,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Home,
  Clock,
  CalendarDays,
  Receipt,
  Tag,
  Building2,
  Footprints,
  Heart,
  GraduationCap,
  Boxes,
  Dice5,
  KeyRound,
  Car,
  DollarSign,
  PiggyBank,
  LineChart,
  BarChart3,
  Scale,
  Baby,
  Ruler,
  Weight,
  Thermometer,
  Coins,
  Network,
  Radical,
  Superscript,
  Binary,
  Variable,
  Square,
  Box,
  CircleDot,
  Circle,
  Dices,
  Divide,
  Ticket,
  Search,
  Command,
  Crown,
  X
} from 'lucide-react';
import { ToolId, ToolCategory } from '../../types';
import { TOOLS_CONFIG } from '../../data/toolsData';
import { AppLogo } from './AppLogo';
import { ToolIcon } from './ToolIcon';
import { getToolColorTheme } from '../../data/toolColors';
import { useLanguage } from '../../context/LanguageContext';
import { getSectionUi } from '../../data/internationalSections';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentToolId: ToolId;
  onSelectTool: (id: ToolId) => void;
  isOpen: boolean;
}

const HOT_TOOL_IDS: ToolId[] = ['basic', 'ai', 'bmi', 'love', 'age', 'time', 'salary'];

interface CategoryDefinition {
  id: 'hot' | ToolCategory;
  nameVi: string;
  nameEn: string;
  shortNameVi?: string;
  shortNameEn?: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'hot',
    nameVi: 'Hot Calculator',
    nameEn: 'Hot Calculator',
    shortNameVi: '🔥 Hot',
    shortNameEn: '🔥 Hot',
    color: 'text-amber-500 dark:text-amber-400',
    badgeBg: 'bg-amber-500/15 border-amber-500/30',
    badgeText: 'text-amber-600 dark:text-amber-400'
  },
  {
    id: 'financial',
    nameVi: 'Tài chính & Đầu tư',
    nameEn: 'Finance & Investment',
    shortNameVi: 'Tài chính',
    shortNameEn: 'Finance',
    color: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500/15 border-emerald-500/30',
    badgeText: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    id: 'fitness',
    nameVi: 'Sức khỏe & Thể hình',
    nameEn: 'Health & Fitness',
    shortNameVi: 'Sức khỏe',
    shortNameEn: 'Health',
    color: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-500/15 border-rose-500/30',
    badgeText: 'text-rose-600 dark:text-rose-400'
  },
  {
    id: 'math',
    nameVi: 'Toán học & Thống kê',
    nameEn: 'Math & Statistics',
    shortNameVi: 'Toán học',
    shortNameEn: 'Math',
    color: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-500/15 border-blue-500/30',
    badgeText: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 'geometry',
    nameVi: 'Hình học & Đo lường',
    nameEn: 'Geometry & Space',
    shortNameVi: 'Hình học',
    shortNameEn: 'Geometry',
    color: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-500/15 border-amber-500/30',
    badgeText: 'text-amber-600 dark:text-amber-400'
  },
  {
    id: 'conversion',
    nameVi: 'Chuyển đổi đơn vị',
    nameEn: 'Unit Conversion',
    shortNameVi: 'Chuyển đổi',
    shortNameEn: 'Conversion',
    color: 'text-cyan-600 dark:text-cyan-400',
    badgeBg: 'bg-cyan-500/15 border-cyan-500/30',
    badgeText: 'text-cyan-600 dark:text-cyan-400'
  },
  {
    id: 'utility',
    nameVi: 'Tiện ích & Đời sống',
    nameEn: 'Utilities & Life',
    shortNameVi: 'Tiện ích',
    shortNameEn: 'Utilities',
    color: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-500/15 border-purple-500/30',
    badgeText: 'text-purple-600 dark:text-purple-400'
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentToolId,
  onSelectTool,
  isOpen
}) => {
  const { language, t } = useLanguage();
  const { user, isVip, daysRemaining, setIsPricingModalOpen } = useAuth();
  const secUi = getSectionUi(language);
  const isVi = language === 'vi';

  // Category filter state ('all' or specific category)
  const [selectedCategory, setSelectedCategory] = useState<'hot' | ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Search Modal state (Command Palette under web logo)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchModalQuery, setSearchModalQuery] = useState('');
  const [modalSelectedIndex, setModalSelectedIndex] = useState(0);

  // Global Keyboard shortcut listener for Ctrl+K / ⌘K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track open/collapsed categories: only 'hot' is expanded by default, all 6 other categories are collapsed
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({
    financial: true,
    fitness: true,
    math: true,
    geometry: true,
    conversion: true,
    utility: true,
    hot: false
  });

  const toggleCategory = (catId: string) => {
    setCollapsedCategories(prev => {
      const currentVal = catId === 'hot' ? (prev['hot'] ?? false) : (prev[catId] ?? true);
      return {
        ...prev,
        [catId]: !currentVal
      };
    });
  };

  const tools = useMemo(() => Object.values(TOOLS_CONFIG), []);

  // Featured Hot Calculators
  const hotTools = useMemo(() => {
    return HOT_TOOL_IDS
      .map(id => tools.find(t => t.id === id))
      .filter(Boolean) as typeof tools;
  }, [tools]);

  // Filter tools for Command Palette Modal (matching Image 2)
  const modalFilteredTools = useMemo(() => {
    const q = searchModalQuery.toLowerCase().trim();
    if (!q) return tools;
    return tools.filter(tool => {
      const localizedName = (t.toolNames[tool.id] || tool.name).toLowerCase();
      const localizedShort = (t.toolShortNames[tool.id] || tool.shortName || '').toLowerCase();
      const localizedDesc = (t.toolDescriptions[tool.id] || tool.description || '').toLowerCase();
      const id = tool.id.toLowerCase();
      return (
        localizedName.includes(q) ||
        localizedShort.includes(q) ||
        localizedDesc.includes(q) ||
        id.includes(q)
      );
    });
  }, [tools, searchModalQuery, t]);

  useEffect(() => {
    setModalSelectedIndex(0);
  }, [searchModalQuery]);

  // Filter tools by search query if any
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    const q = searchQuery.toLowerCase().trim();
    return tools.filter(tool => {
      const name = (t.toolNames[tool.id] || tool.name).toLowerCase();
      const short = (t.toolShortNames[tool.id] || tool.shortName || '').toLowerCase();
      const id = tool.id.toLowerCase();
      return name.includes(q) || short.includes(q) || id.includes(q);
    });
  }, [tools, searchQuery, t]);

  const renderToolButton = (tool: typeof tools[0]) => {
    const isActive = currentToolId === tool.id;
    const localizedName = t.toolNames[tool.id] || tool.name;
    const colorTheme = getToolColorTheme(tool.id);

    return (
      <button
        key={tool.id}
        id={`sidebar-nav-${tool.id}`}
        onClick={() => onSelectTool(tool.id)}
        title={localizedName}
        className={`w-full group flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
          isActive 
            ? 'sidebar-tool-active bg-blue-50 dark:bg-sky-950/40 border border-blue-300 dark:border-sky-700/60 shadow-sm' 
            : 'sidebar-tool-inactive text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-sky-300 hover:bg-slate-100/90 dark:hover:bg-slate-800/60'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
          <span className={`sidebar-tool-icon w-7 h-7 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 ${
            tool.id === 'love' ? 'text-red-500' : colorTheme.iconColor
          }`}>
            <ToolIcon id={tool.id} className={`w-[19px] h-[19px] ${tool.id === 'love' ? 'text-red-500 fill-red-500' : colorTheme.iconColor}`} />
          </span>
          <span className={`sidebar-tool-label text-[14px] font-medium leading-snug break-words ${
            isActive ? 'font-semibold text-blue-900 dark:text-sky-200' : 'text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-sky-300'
          }`}>
            {localizedName}
          </span>
        </div>
        
        {isActive ? (
          <span className="w-2 h-2 rounded-full bg-[#10B981] ring-2 ring-white/20 shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        )}
      </button>
    );
  };

  return (
    <>
      <aside 
        id="desktop-sidebar"
      className={`hidden md:flex flex-col shrink-0 border-r transition-all duration-300 ease-in-out ${
        isOpen ? 'w-80' : 'w-0 -translate-x-full overflow-hidden'
      }`}
      style={{
        backgroundColor: 'var(--app-bg, #141526)',
        borderColor: 'var(--app-border, #272a47)'
      }}
    >
      {/* Search & Category Filter Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2.5 shrink-0">
        {/* Quick Search under Logo with ⌘K / Ctrl+K (Image 1) */}
        <button
          id="sidebar-quick-search-trigger"
          type="button"
          onClick={() => {
            setIsSearchModalOpen(true);
            setSearchModalQuery('');
          }}
          className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 text-left rounded-xl border border-slate-300 dark:border-slate-700/80 transition-all shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer group"
          title={isVi ? 'Tìm kiếm công cụ tính toán (Ctrl+K / ⌘K)' : 'Quick search calculation tools (Ctrl+K / ⌘K)'}
          aria-label="Quick search calculation tools"
        >
          <div className="flex items-center gap-2 min-w-0 pr-1">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-sky-400 transition-colors shrink-0" />
            <span className="truncate">{t.searchPlaceholder || (isVi ? 'Tìm nhanh công cụ...' : 'Quick search calculation tools...')}</span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-slate-200 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 rounded border border-slate-300 dark:border-slate-700 shrink-0">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer font-medium ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isVi ? 'Tất cả' : 'All'} ({tools.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = cat.id === 'hot' ? hotTools.length : tools.filter(t => t.category === cat.id).length;
            const isSel = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer font-medium ${
                  isSel
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isVi 
                  ? (cat.shortNameVi || cat.nameVi) 
                  : (cat.shortNameEn || cat.nameEn)
                } ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Tool Categories */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
        {CATEGORIES.map(cat => {
          // If a category filter is active and this isn't it, hide
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) {
            return null;
          }

          const catTools = cat.id === 'hot'
            ? hotTools.filter(tool => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase().trim();
                const name = (t.toolNames[tool.id] || tool.name).toLowerCase();
                const short = (t.toolShortNames[tool.id] || tool.shortName || '').toLowerCase();
                const id = tool.id.toLowerCase();
                return name.includes(q) || short.includes(q) || id.includes(q);
              })
            : filteredTools.filter(t => t.category === cat.id);

          if (catTools.length === 0) return null;

          const isCollapsed = searchQuery.trim()
            ? false
            : (cat.id === 'hot' ? (collapsedCategories['hot'] ?? false) : (collapsedCategories[cat.id] ?? true));
          const hasActiveTool = catTools.some(t => t.id === currentToolId);

          return (
            <div key={cat.id} className="space-y-1">
              {/* Category Group Header */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer group ${
                  cat.id === 'hot'
                    ? 'hover:bg-amber-500/10 dark:hover:bg-amber-500/15'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {cat.id === 'hot' && (
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0 animate-pulse" />
                  )}
                  <span className={`text-[12.5px] font-bold tracking-wider uppercase ${cat.color} group-hover:brightness-110 flex items-center gap-1.5`}>
                    <span>{isVi ? cat.nameVi : cat.nameEn}</span>
                    {cat.id === 'hot' && (
                      <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded-md bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs">
                        HOT
                      </span>
                    )}
                  </span>
                  {hasActiveTool && (
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      cat.id === 'hot' ? 'bg-amber-400' : 'bg-emerald-400'
                    }`} />
                  )}
                </div>
                <div className="flex items-center">
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                  )}
                </div>
              </button>

              {/* Tool Buttons in this Category */}
              {!isCollapsed && (
                <div className="space-y-0.5 pt-0.5">
                  {catTools.map(renderToolButton)}
                </div>
              )}
            </div>
          );
        })}

        {/* VIP Upgrade Banner */}
        <div 
          onClick={() => setIsPricingModalOpen(true)}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-amber-500/5 border border-amber-500/30 hover:border-amber-500/60 transition-all cursor-pointer group mt-4 shadow-xs"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-600 dark:text-amber-400">
              <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{isVip ? (user?.plan === 'yearly' ? 'VIP Pro 1 Năm' : 'VIP Pro 1 Tháng') : 'Gói VIP Pro'}</span>
            </div>
            {!isVip ? (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs">
                9.99$/tháng
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                {daysRemaining !== undefined ? `Còn ${daysRemaining} ngày` : 'Đang hoạt động'}
              </span>
            )}
          </div>
          <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
            {isVip 
              ? 'Tài khoản VIP đang hoạt động. Mở khóa toàn bộ tính năng và giải toán AI không giới hạn.'
              : 'Mở khóa không giới hạn AI Math Solver, xuất báo cáo 4K và tốc độ xử lý ưu tiên.'}
          </p>
        </div>

        {/* SEO Trust Guarantee Badge */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[13.5px] text-slate-600 dark:text-slate-400 space-y-1.5 mt-3">
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>{secUi.sidebarGuaranteeTitle}</span>
          </div>
          <p className="text-[12.5px] leading-relaxed">
            {secUi.sidebarGuaranteeText}
          </p>
        </div>
      </div>
    </aside>

    {/* Quick Search Command Palette Modal (matching Image 2) */}
    {isSearchModalOpen && (
      <div 
        id="search-modal-backdrop"
        onClick={() => setIsSearchModalOpen(false)}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4 transition-all"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setModalSelectedIndex(prev => (prev + 1) % Math.max(1, modalFilteredTools.length));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setModalSelectedIndex(prev => (prev - 1 + modalFilteredTools.length) % Math.max(1, modalFilteredTools.length));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              const selectedTool = modalFilteredTools[modalSelectedIndex];
              if (selectedTool) {
                onSelectTool(selectedTool.id);
                setIsSearchModalOpen(false);
                setSearchModalQuery('');
              }
            }
          }}
          className="w-full max-w-xl border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          style={{
            backgroundColor: 'var(--app-surface, #1b1d33)',
            borderColor: 'var(--app-border, #272a47)'
          }}
        >
          {/* Modal Search Header Input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <Search className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />
            <input
              id="search-input"
              type="text"
              autoFocus
              placeholder={t.searchPlaceholder || "Search tools..."}
              value={searchModalQuery}
              onChange={(e) => setSearchModalQuery(e.target.value)}
              className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none"
            />
            {searchModalQuery && (
              <button
                type="button"
                onClick={() => setSearchModalQuery('')}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Clear query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(false)}
              className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              aria-label="Close search modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Tool List */}
          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
            {modalFilteredTools.length === 0 ? (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                {language === 'vi' ? `Không tìm thấy công cụ phù hợp với từ khóa "${searchModalQuery}"` : `No matching tools found for "${searchModalQuery}"`}
              </div>
            ) : (
              modalFilteredTools.map((tool, idx) => {
                const isCurrent = currentToolId === tool.id;
                const isHighlighted = modalSelectedIndex === idx;
                const localizedName = t.toolNames[tool.id] || tool.name;
                const localizedDesc = t.toolDescriptions[tool.id] || tool.description;

                return (
                  <button
                    key={tool.id}
                    id={`search-item-${tool.id}`}
                    onClick={() => {
                      onSelectTool(tool.id);
                      setIsSearchModalOpen(false);
                      setSearchModalQuery('');
                    }}
                    onMouseEnter={() => setModalSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                      isCurrent 
                        ? 'bg-blue-50 dark:bg-blue-600/15 border border-blue-200 dark:border-blue-500/30' 
                        : isHighlighted
                        ? 'bg-slate-100 dark:bg-slate-800/70 border border-transparent'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-transparent'
                    }`}
                  >
                    <div className="pr-3 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                          {localizedName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {localizedDesc}
                      </p>
                    </div>
                    <span className="text-xs text-blue-500 dark:text-blue-400 font-medium pl-3 whitespace-nowrap">→</span>
                  </button>
                );
              })
            )}
          </div>
          
          {/* Modal Footer with Esc on left & count / 9 on right (matching Image 2) */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Esc</span>
            <span>{modalFilteredTools.length} / 9</span>
          </div>
        </div>
      </div>
    )}
    </>
  );
};
