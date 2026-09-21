import React from 'react';
import { 
  Sparkles, 
  ChevronRight,
  Calculator,
  Activity,
  Landmark,
  Wallet,
  Calendar,
  Percent,
  Scale,
  Binary,
  TrendingUp
} from 'lucide-react';
import { ToolId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export interface ExploreCalculatorItem {
  id: ToolId;
  icon: React.ElementType;
  badgeColor: string;
}

export const EXPLORE_CALCULATOR_TOOLS: ExploreCalculatorItem[] = [
  { id: 'basic', icon: Calculator, badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'bmi', icon: Activity, badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'loan', icon: Landmark, badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { id: 'salary', icon: Wallet, badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { id: 'age', icon: Calendar, badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'percentage', icon: Percent, badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  { id: 'unit', icon: Scale, badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  { id: 'trigonometry', icon: Binary, badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
  { id: 'compound', icon: TrendingUp, badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
];

interface ExploreMoreSectionProps {
  onOpenGeminiDrawer: (toolId: ToolId) => void;
}

export const ExploreMoreSection: React.FC<ExploreMoreSectionProps> = ({
  onOpenGeminiDrawer
}) => {
  const { t } = useLanguage();

  return (
    <section 
      id="explore-more-section"
      aria-label="Khám phá thêm công cụ tính toán"
      className="explore-section-container rounded-2xl sm:rounded-3xl border p-4 sm:p-6 shadow-xl space-y-4 transition-colors"
      style={{
        backgroundColor: 'var(--app-surface, #1b1d33)',
        borderColor: 'var(--app-border, #272a47)',
      }}
    >
      {/* 1. Header Box */}
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b"
        style={{ borderColor: 'var(--app-border, #272a47)' }}
      >
        <div className="flex items-center gap-3">
          <div className="explore-sparkle-box w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400/20" />
          </div>
          <div>
            <h2 
              className="explore-section-title text-base sm:text-lg font-bold leading-tight"
              style={{ color: 'var(--app-text-primary, #ffffff)' }}
            >
              {t.exploreMoreTitle}
            </h2>
            <p 
              className="explore-section-subtitle text-xs sm:text-sm mt-0.5"
              style={{ color: 'var(--app-text-muted, #94a3b8)' }}
            >
              {t.exploreMoreSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Grid 2 Columns of Calculator Tools Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5 pt-1">
        {EXPLORE_CALCULATOR_TOOLS.map((item) => {
          const title = t.toolNames[item.id] || item.id;
          const description = t.toolDescriptions[item.id] || '';
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              id={`explore-card-${item.id}`}
              onClick={() => onOpenGeminiDrawer(item.id)}
              className="explore-card-item group flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer select-none active:scale-[0.99] hover:shadow-md"
              style={{
                backgroundColor: 'var(--app-subsurface, #141526)',
                borderColor: 'var(--app-border, #272a47)',
              }}
            >
              {/* Left Info: Icon badge + Title & Description */}
              <div className="flex items-center gap-3 pr-2 min-w-0 flex-1">
                <div className={`explore-icon-badge w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${item.badgeColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <h3 
                    className="explore-card-title text-xs sm:text-sm font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate"
                    style={{ color: 'var(--app-text-primary, #ffffff)' }}
                  >
                    {title}
                  </h3>
                  <p 
                    className="explore-card-desc text-[11px] sm:text-xs leading-snug line-clamp-1 transition-colors"
                    style={{ color: 'var(--app-text-muted, #94a3b8)' }}
                  >
                    {description}
                  </p>
                </div>
              </div>

              {/* Right Action Button: `>` inside rounded border button */}
              <button
                type="button"
                id={`explore-btn-${item.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenGeminiDrawer(item.id);
                }}
                aria-label={`Mở phân tích cho ${title}`}
                className="explore-chevron-btn w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shrink-0 shadow-2xs cursor-pointer border"
                style={{
                  backgroundColor: 'var(--app-surface, #1b1d33)',
                  borderColor: 'var(--app-border, #272a47)',
                  color: 'var(--app-text-primary, #ffffff)',
                }}
              >
                <ChevronRight className="explore-chevron-icon w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
