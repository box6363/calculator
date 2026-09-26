import React, { useState, useMemo } from 'react';
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
  X
} from 'lucide-react';
import { ToolId, ToolCategory } from '../../types';
import { TOOLS_CONFIG } from '../../data/toolsData';
import { AppLogo } from './AppLogo';
import { getToolColorTheme } from '../../data/toolColors';
import { useLanguage } from '../../context/LanguageContext';
import { getSectionUi } from '../../data/internationalSections';

interface SidebarProps {
  currentToolId: ToolId;
  onSelectTool: (id: ToolId) => void;
  isOpen: boolean;
}

interface CategoryDefinition {
  id: ToolCategory;
  nameVi: string;
  nameEn: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'financial',
    nameVi: 'Tài chính & Đầu tư',
    nameEn: 'Finance & Investment',
    color: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500/15 border-emerald-500/30',
    badgeText: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    id: 'fitness',
    nameVi: 'Sức khỏe & Thể hình',
    nameEn: 'Health & Fitness',
    color: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-500/15 border-rose-500/30',
    badgeText: 'text-rose-600 dark:text-rose-400'
  },
  {
    id: 'math',
    nameVi: 'Toán học & Thống kê',
    nameEn: 'Math & Statistics',
    color: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-500/15 border-blue-500/30',
    badgeText: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 'geometry',
    nameVi: 'Hình học & Đo lường',
    nameEn: 'Geometry & Space',
    color: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-500/15 border-amber-500/30',
    badgeText: 'text-amber-600 dark:text-amber-400'
  },
  {
    id: 'conversion',
    nameVi: 'Chuyển đổi đơn vị',
    nameEn: 'Unit Conversion',
    color: 'text-cyan-600 dark:text-cyan-400',
    badgeBg: 'bg-cyan-500/15 border-cyan-500/30',
    badgeText: 'text-cyan-600 dark:text-cyan-400'
  },
  {
    id: 'utility',
    nameVi: 'Tiện ích & Đời sống',
    nameEn: 'Utilities & Life',
    color: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-500/15 border-purple-500/30',
    badgeText: 'text-purple-600 dark:text-purple-400'
  }
];

const getIcon = (id: ToolId) => {
  switch (id) {
    case 'basic': return <AppLogo className="w-[19px] h-[19px]" />;
    case 'ai': return <Sparkles className="w-[18px] h-[18px]" />;
    case 'bmi': return <Activity className="w-[18px] h-[18px]" />;
    case 'loan': return <Banknote className="w-[18px] h-[18px]" />;
    case 'salary': return <Wallet className="w-[18px] h-[18px]" />;
    case 'age': return <Calendar className="w-[18px] h-[18px]" />;
    case 'percentage': return <Percent className="w-[18px] h-[18px]" />;
    case 'unit': return <ArrowLeftRight className="w-[18px] h-[18px]" />;
    case 'trigonometry': return <Triangle className="w-[18px] h-[18px]" />;
    case 'compound': return <TrendingUp className="w-[18px] h-[18px]" />;
    case 'mortgage': return <Home className="w-[18px] h-[18px]" />;
    case 'autoloan': return <Car className="w-[18px] h-[18px]" />;
    case 'interest': return <Percent className="w-[18px] h-[18px]" />;
    case 'payment': return <DollarSign className="w-[18px] h-[18px]" />;
    case 'retirement': return <PiggyBank className="w-[18px] h-[18px]" />;
    case 'amortization': return <LineChart className="w-[18px] h-[18px]" />;
    case 'investment': return <TrendingUp className="w-[18px] h-[18px]" />;
    case 'inflation': return <TrendingUp className="w-[18px] h-[18px]" />;
    case 'finance': return <BarChart3 className="w-[18px] h-[18px]" />;
    case 'lottery': return <Ticket className="w-[18px] h-[18px]" />;
    case 'calorie': return <Flame className="w-[18px] h-[18px]" />;
    case 'bodyfat': return <Activity className="w-[18px] h-[18px]" />;
    case 'bmr': return <Flame className="w-[18px] h-[18px]" />;
    case 'idealweight': return <Scale className="w-[18px] h-[18px]" />;
    case 'healthyweight': return <Heart className="w-[18px] h-[18px]" />;
    case 'pregnancy': return <Baby className="w-[18px] h-[18px]" />;
    case 'pace': return <Footprints className="w-[18px] h-[18px]" />;
    case 'armybodyfat': return <ShieldCheck className="w-[18px] h-[18px]" />;
    case 'ovulation': return <Heart className="w-[18px] h-[18px]" />;
    case 'fraction': return <Divide className="w-[18px] h-[18px]" />;
    case 'triangle': return <Triangle className="w-[18px] h-[18px]" />;
    case 'standarddeviation': return <BarChart3 className="w-[18px] h-[18px]" />;
    case 'random': return <Dice5 className="w-[18px] h-[18px]" />;
    case 'average': return <Calculator className="w-[18px] h-[18px]" />;
    case 'meanmedianmode': return <BarChart3 className="w-[18px] h-[18px]" />;
    case 'root': return <Radical className="w-[18px] h-[18px]" />;
    case 'exponent': return <Superscript className="w-[18px] h-[18px]" />;
    case 'log': return <Binary className="w-[18px] h-[18px]" />;
    case 'quadratic': return <Variable className="w-[18px] h-[18px]" />;
    case 'slope': return <TrendingUp className="w-[18px] h-[18px]" />;
    case 'area': return <Square className="w-[18px] h-[18px]" />;
    case 'volume': return <Box className="w-[18px] h-[18px]" />;
    case 'perimeter': return <CircleDot className="w-[18px] h-[18px]" />;
    case 'circle': return <Circle className="w-[18px] h-[18px]" />;
    case 'righttriangle': return <Triangle className="w-[18px] h-[18px]" />;
    case 'statistics': return <BarChart3 className="w-[18px] h-[18px]" />;
    case 'probability': return <Dices className="w-[18px] h-[18px]" />;
    case 'graphing': return <LineChart className="w-[18px] h-[18px]" />;
    case 'gpa': return <GraduationCap className="w-[18px] h-[18px]" />;
    case 'length': return <Ruler className="w-[18px] h-[18px]" />;
    case 'weight': return <Weight className="w-[18px] h-[18px]" />;
    case 'temperature': return <Thermometer className="w-[18px] h-[18px]" />;
    case 'currency': return <Coins className="w-[18px] h-[18px]" />;
    case 'time': return <Clock className="w-[18px] h-[18px]" />;
    case 'date': return <CalendarDays className="w-[18px] h-[18px]" />;
    case 'tip': return <Receipt className="w-[18px] h-[18px]" />;
    case 'discount': return <Tag className="w-[18px] h-[18px]" />;
    case 'tax': return <Building2 className="w-[18px] h-[18px]" />;
    case 'password': return <KeyRound className="w-[18px] h-[18px]" />;
    case 'ipsubnet': return <Network className="w-[18px] h-[18px]" />;
    case 'utilitybill': return <Zap className="w-[18px] h-[18px]" />;
    case 'concrete': return <Boxes className="w-[18px] h-[18px]" />;
    default: return <Calculator className="w-[18px] h-[18px]" />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentToolId,
  onSelectTool,
  isOpen
}) => {
  const { language, t } = useLanguage();
  const secUi = getSectionUi(language);
  const isVi = language === 'vi';

  // Category filter state ('all' or specific category)
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Track open/collapsed categories
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (catId: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const tools = useMemo(() => Object.values(TOOLS_CONFIG), []);

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
            ? 'sidebar-tool-active bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400/40' 
            : 'sidebar-tool-inactive text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-sky-300 hover:bg-slate-100/90 dark:hover:bg-slate-800/60'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
          <span className={`w-8 h-8 flex items-center justify-center rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-105 ${
            isActive 
              ? 'bg-white/20 text-white shadow-xs' 
              : colorTheme.badgeClass
          }`}>
            {getIcon(tool.id)}
          </span>
          <span className="text-[14px] font-medium leading-snug break-words group-hover:text-blue-600 dark:group-hover:text-sky-300">
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
        {/* Quick Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isVi ? 'Tìm nhanh công cụ...' : 'Search tools...'}
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-lg border border-slate-300 dark:border-slate-700/80 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

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
            const count = tools.filter(t => t.category === cat.id).length;
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
                {isVi ? cat.nameVi.split(' ')[0] : cat.nameEn.split(' ')[0]} ({count})
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

          const catTools = filteredTools.filter(t => t.category === cat.id);
          if (catTools.length === 0) return null;

          const isCollapsed = collapsedCategories[cat.id];
          const hasActiveTool = catTools.some(t => t.id === currentToolId);

          return (
            <div key={cat.id} className="space-y-1">
              {/* Category Group Header */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[12.5px] font-bold tracking-wider uppercase ${cat.color} group-hover:brightness-110`}>
                    {isVi ? cat.nameVi : cat.nameEn}
                  </span>
                  {hasActiveTool && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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

        {/* SEO Trust Guarantee Badge */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[13.5px] text-slate-600 dark:text-slate-400 space-y-1.5 mt-4">
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
  );
};
