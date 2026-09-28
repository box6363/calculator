import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Search,
  Activity, 
  Banknote, 
  Calendar, 
  Percent, 
  Wallet,
  Menu,
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
  KeyRound,
  Zap
} from 'lucide-react';
import { ToolId } from '../../types';
import { TOOLS_CONFIG } from '../../data/toolsData';
import { AppLogo } from './AppLogo';
import { ToolIcon } from './ToolIcon';
import { getToolColorTheme } from '../../data/toolColors';
import { useLanguage } from '../../context/LanguageContext';
import { getSectionUi } from '../../data/internationalSections';

interface BottomTabBarProps {
  currentToolId: ToolId;
  onSelectTool: (id: ToolId) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentToolId,
  onSelectTool
}) => {
  const { language, t } = useLanguage();
  const secUi = getSectionUi(language);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const primaryToolIds: ToolId[] = ['basic', 'ai', 'bmi', 'loan', 'percentage'];

  // 5 primary tier 1 tools for mobile bottom bar
  const primaryTools: { id: ToolId; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: t.toolShortNames.basic || 'Cơ bản', icon: <ToolIcon id="basic" className="w-5 h-5" /> },
    { id: 'ai', label: t.toolShortNames.ai || 'AI Tool', icon: <ToolIcon id="ai" className="w-5 h-5" /> },
    { id: 'bmi', label: t.toolShortNames.bmi || 'BMI', icon: <ToolIcon id="bmi" className="w-5 h-5" /> },
    { id: 'loan', label: t.toolShortNames.loan || 'Lãi vay', icon: <ToolIcon id="loan" className="w-5 h-5" /> },
    { id: 'percentage', label: t.toolShortNames.percentage || 'Phần trăm', icon: <ToolIcon id="percentage" className="w-5 h-5" /> },
  ];

  // All remaining tools for "More" modal
  const secondaryTools = useMemo(() => {
    return Object.values(TOOLS_CONFIG)
      .filter(tc => !primaryToolIds.includes(tc.id))
      .map(tc => ({
        id: tc.id,
        label: t.toolNames[tc.id] || tc.name,
        desc: t.toolDescriptions[tc.id] || tc.description,
        icon: <ToolIcon id={tc.id} className="w-5 h-5" />
      }));
  }, [t]);

  // Dynamic search filtering inside modal (allows finding any tool across the platform)
  const displayedModalTools = useMemo(() => {
    if (!searchQuery.trim()) {
      return secondaryTools;
    }
    const q = searchQuery.toLowerCase().trim();
    return Object.values(TOOLS_CONFIG)
      .filter(tc => {
        const name = (t.toolNames[tc.id] || tc.name).toLowerCase();
        const short = (t.toolShortNames[tc.id] || tc.shortName || '').toLowerCase();
        const desc = (t.toolDescriptions[tc.id] || tc.description || '').toLowerCase();
        const id = tc.id.toLowerCase();
        return name.includes(q) || short.includes(q) || desc.includes(q) || id.includes(q);
      })
      .map(tc => ({
        id: tc.id,
        label: t.toolNames[tc.id] || tc.name,
        desc: t.toolDescriptions[tc.id] || tc.description,
        icon: <ToolIcon id={tc.id} className="w-5 h-5" />
      }));
  }, [searchQuery, secondaryTools, t]);

  const isCurrentInSecondary = secondaryTools.some(t => t.id === currentToolId);

  return (
    <>
      <nav 
        id="mobile-bottom-tab-bar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t pb-[env(safe-area-inset-bottom)] dark:shadow-[0_-8px_20px_rgba(0,0,0,0.5)] shadow-[0_-1px_4px_rgba(0,0,0,0.03)] transition-colors duration-200"
        style={{
          backgroundColor: 'var(--app-header-bg, #ffffff)',
          borderColor: 'var(--app-border, #ffffff)'
        }}
      >
        <div className="grid grid-cols-6 items-center h-16 px-1">
          {primaryTools.map((tool) => {
            const isActive = currentToolId === tool.id;
            const theme = getToolColorTheme(tool.id);
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
                <div className={`p-1.5 transition-all ${
                  isActive 
                    ? 'text-[#3B82F6]' 
                    : theme.iconColor
                }`}>
                  {tool.icon}
                </div>
                <span className="text-[10px] mt-0.5 whitespace-nowrap tracking-tight font-medium">
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
            aria-label="More"
            className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all ${
              isCurrentInSecondary 
                ? 'text-[#3B82F6] font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${
              isCurrentInSecondary ? 'bg-blue-500/15 text-[#3B82F6]' : ''
            }`}>
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 whitespace-nowrap tracking-tight font-medium">
              More
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
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  setSearchQuery('');
                }}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="mobile-tools-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'vi' ? 'Tìm kiếm công cụ tính toán...' : 'Search calculator tools...'}
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-100 hover:bg-slate-200/50 dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                  aria-label="Xóa tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Tools List or Empty Search Results */}
            {displayedModalTools.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {language === 'vi' 
                    ? `Không tìm thấy công cụ nào cho "${searchQuery}"`
                    : `No tools found for "${searchQuery}"`}
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-1 cursor-pointer"
                >
                  {language === 'vi' ? 'Xóa từ khóa tìm kiếm' : 'Clear search'}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[58vh] overflow-y-auto pr-1">
                {displayedModalTools.map((tool) => {
                  const isActive = currentToolId === tool.id;
                  const theme = getToolColorTheme(tool.id);
                  return (
                    <button
                      key={tool.id}
                      id={`more-tool-select-${tool.id}`}
                      onClick={() => {
                        onSelectTool(tool.id);
                        setIsMoreMenuOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-blue-600/15 border-blue-500 text-slate-900 dark:text-white shadow-md' 
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 flex items-center justify-center shrink-0 transition-transform ${
                          isActive ? 'text-blue-600 dark:text-blue-400' : theme.iconColor
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
            )}

            <div className="pt-2 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Bản quyền thuộc về @MCTLab Inc
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
