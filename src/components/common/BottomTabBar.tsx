import React, { useState } from 'react';
import { 
  Calculator, 
  Activity, 
  Banknote, 
  Calendar, 
  Percent, 
  Wallet,
  MoreHorizontal,
  ArrowLeftRight,
  Triangle,
  TrendingUp,
  X,
  ChevronRight,
  Sparkles,
  Home,
  Flame,
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
  KeyRound
} from 'lucide-react';
import { ToolId } from '../../types';
import { TOOLS_CONFIG } from '../../data/toolsData';
import { useLanguage } from '../../context/LanguageContext';
import { getSectionUi } from '../../data/internationalSections';

interface BottomTabBarProps {
  currentToolId: ToolId;
  onSelectTool: (id: ToolId) => void;
}

const getToolIcon = (id: ToolId) => {
  switch (id) {
    case 'basic': return <Calculator className="w-5 h-5" />;
    case 'ai': return <Sparkles className="w-5 h-5 text-violet-400" />;
    case 'bmi': return <Activity className="w-5 h-5" />;
    case 'loan': return <Banknote className="w-5 h-5" />;
    case 'salary': return <Wallet className="w-5 h-5" />;
    case 'age': return <Calendar className="w-5 h-5" />;
    case 'percentage': return <Percent className="w-5 h-5" />;
    case 'unit': return <ArrowLeftRight className="w-5 h-5" />;
    case 'trigonometry': return <Triangle className="w-5 h-5" />;
    case 'compound': return <TrendingUp className="w-5 h-5" />;
    case 'mortgage': return <Home className="w-5 h-5" />;
    case 'calorie': return <Flame className="w-5 h-5" />;
    case 'bodyfat': return <Activity className="w-5 h-5" />;
    case 'time': return <Clock className="w-5 h-5" />;
    case 'date': return <CalendarDays className="w-5 h-5" />;
    case 'tip': return <Receipt className="w-5 h-5" />;
    case 'discount': return <Tag className="w-5 h-5" />;
    case 'tax': return <Building2 className="w-5 h-5" />;
    case 'pace': return <Footprints className="w-5 h-5" />;
    case 'ovulation': return <Heart className="w-5 h-5" />;
    case 'gpa': return <GraduationCap className="w-5 h-5" />;
    case 'concrete': return <Boxes className="w-5 h-5" />;
    case 'random': return <Dice5 className="w-5 h-5" />;
    case 'password': return <KeyRound className="w-5 h-5" />;
    default: return <Calculator className="w-5 h-5" />;
  }
};

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentToolId,
  onSelectTool
}) => {
  const { language, t } = useLanguage();
  const secUi = getSectionUi(language);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const primaryToolIds: ToolId[] = ['basic', 'ai', 'bmi', 'loan', 'percentage'];

  // 5 primary tier 1 tools for mobile bottom bar
  const primaryTools: { id: ToolId; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: t.toolShortNames.basic || 'Cơ bản', icon: <Calculator className="w-5 h-5" /> },
    { id: 'ai', label: t.toolShortNames.ai || 'AI Tool', icon: <Sparkles className="w-5 h-5 text-violet-400" /> },
    { id: 'bmi', label: t.toolShortNames.bmi || 'BMI', icon: <Activity className="w-5 h-5" /> },
    { id: 'loan', label: t.toolShortNames.loan || 'Lãi vay', icon: <Banknote className="w-5 h-5" /> },
    { id: 'percentage', label: t.toolShortNames.percentage || 'Phần trăm', icon: <Percent className="w-5 h-5" /> },
  ];

  // All remaining tools for "More" modal
  const secondaryTools = Object.values(TOOLS_CONFIG)
    .filter(tc => !primaryToolIds.includes(tc.id))
    .map(tc => ({
      id: tc.id,
      label: t.toolNames[tc.id] || tc.name,
      desc: t.toolDescriptions[tc.id] || tc.description,
      icon: getToolIcon(tc.id)
    }));

  const isCurrentInSecondary = secondaryTools.some(t => t.id === currentToolId);

  return (
    <>
      <nav 
        id="mobile-bottom-tab-bar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_20px_rgba(0,0,0,0.5)] transition-colors duration-200"
        style={{
          backgroundColor: 'var(--app-header-bg, rgba(20, 21, 38, 0.95))',
          borderColor: 'var(--app-border, #272a47)'
        }}
      >
        <div className="grid grid-cols-6 items-center h-16 px-1">
          {primaryTools.map((tool) => {
            const isActive = currentToolId === tool.id;
            return (
              <button
                key={tool.id}
                id={`bottom-tab-${tool.id}`}
                onClick={() => {
                  onSelectTool(tool.id);
                  setIsMoreMenuOpen(false);
                }}
                className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all ${
                  isActive 
                    ? 'text-[#3B82F6] font-bold scale-105' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-500/15 text-[#3B82F6]' : ''
                }`}>
                  {tool.icon}
                </div>
                <span className="text-[10px] mt-0.5 whitespace-nowrap tracking-tight">
                  {tool.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1 bg-[#10B981] rounded-full mt-0.5" />
                )}
              </button>
            );
          })}

          {/* More button */}
          <button
            id="bottom-tab-more"
            onClick={() => setIsMoreMenuOpen(true)}
            className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all ${
              isCurrentInSecondary 
                ? 'text-[#3B82F6] font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${
              isCurrentInSecondary ? 'bg-blue-500/15 text-[#3B82F6]' : ''
            }`}>
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 whitespace-nowrap tracking-tight">
              {secUi.bottomMoreTitle.split(' ')[0]} ({secondaryTools.length})
            </span>
            {isCurrentInSecondary && (
              <span className="w-1.5 h-1 bg-[#10B981] rounded-full mt-0.5" />
            )}
          </button>
        </div>
      </nav>

      {/* More Modal / Bottom Sheet */}
      {isMoreMenuOpen && (
        <div 
          id="more-tools-modal-backdrop"
          onClick={() => setIsMoreMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:hidden animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full border-t rounded-t-3xl p-5 pb-8 space-y-4 animate-in slide-in-from-bottom duration-200 transition-colors"
            style={{
              backgroundColor: 'var(--app-surface, #1b1d33)',
              borderColor: 'var(--app-border, #272a47)'
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{secUi.bottomMoreTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{secUi.bottomMoreSubtitle}</p>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[65vh] overflow-y-auto pr-1">
              {secondaryTools.map((tool) => {
                const isActive = currentToolId === tool.id;
                return (
                  <button
                    key={tool.id}
                    id={`more-tool-select-${tool.id}`}
                    onClick={() => {
                      onSelectTool(tool.id);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isActive 
                        ? 'bg-blue-600/20 border-blue-500 text-slate-900 dark:text-white shadow-lg' 
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${
                        isActive ? 'bg-[#3B82F6] text-white' : 'bg-slate-200 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                      }`}>
                        {tool.icon}
                      </div>
                      <div className="text-left">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">{tool.label}</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{tool.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Toàn bộ 8 công cụ hoạt động offline & không có quảng cáo
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
