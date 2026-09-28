import React, { useState } from 'react';
import {
  ChevronRight,
  HelpCircle,
  BookOpen,
  Link as LinkIcon,
  ChevronDown,
  Check,
  Share2,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ToolId, ToolMeta } from '../../types';
import { TOOLS_CONFIG } from '../../data/toolsData';
import { AdBanner } from './AdBanner';
import { ExploreMoreSection } from './ExploreMoreSection';
import { SEOManager } from './SEOManager';
import { useLanguage } from '../../context/LanguageContext';
import { getToolSEO } from '../../data/internationalSEO';
import { getSectionUi } from '../../data/internationalSections';

interface ToolLayoutProps {
  tool: ToolMeta;
  onSelectTool: (id: ToolId) => void;
  onResetTool?: () => void;
  onOpenGemini?: (toolKey?: ToolId) => void;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  tool,
  onSelectTool,
  onResetTool,
  onOpenGemini,
  children
}) => {
  const { language, t } = useLanguage();
  const toolSEO = getToolSEO(tool.id, language);
  const secUi = getSectionUi(language);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleCopyLink = () => {
    const search = window.location.search || '';
    const cleanToolUrl = `${window.location.origin}/${language}/${tool.id}${search}`;
    navigator.clipboard?.writeText(cleanToolUrl);
    setCopiedLink(true);
    showToast(t.copiedToast || secUi.shareCopied);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleResetWithToast = () => {
    if (onResetTool) {
      onResetTool();
      showToast(secUi.resetButton);
    }
  };

  const currentToolName = t.toolNames[tool.id] || tool.name;

  return (
    <div id={`tool-page-${tool.id}`} className="w-full max-w-5xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Dynamic SEO Manager: Hreflang for 20 markets & Rich Results JSON-LD */}
      <SEOManager tool={tool} lang={language} />
      
      {/* Mobile Top Bar (< sm): Ultra-compact header so calculator is immediately at top */}
      <div className="flex sm:hidden items-center justify-between gap-2 px-1 py-0.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <button 
            onClick={() => onSelectTool('basic')} 
            className="text-xs text-slate-400 hover:text-blue-500 transition-colors shrink-0"
          >
            {secUi.homeBreadcrumb}
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span 
            className="text-xs font-bold truncate"
            style={{ color: 'var(--app-text-primary, #ffffff)' }}
          >
            {currentToolName}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onResetTool && (
            <button
              id={`mobile-reset-btn-${tool.id}`}
              onClick={handleResetWithToast}
              title={secUi.resetTooltip}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-all active:scale-95 cursor-pointer tool-reset-btn"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{secUi.resetButton}</span>
            </button>
          )}

          <button
            id={`mobile-copy-tool-link-${tool.id}`}
            onClick={handleCopyLink}
            title={secUi.shareTooltip}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-all active:scale-95 cursor-pointer tool-share-btn"
          >
            {copiedLink ? (
              <>
                <Check className="w-3 h-3 text-[#10B981]" />
                <span className="text-[#10B981]">{secUi.shareCopied}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3" />
                <span>{secUi.shareButton}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Top Bar (>= sm): Compact header elevating calculator to the top */}
      <div className="hidden sm:flex items-center justify-between gap-4 py-1">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-400 space-x-1.5 overflow-x-auto whitespace-nowrap py-0.5">
          <button 
            onClick={() => onSelectTool('basic')} 
            className="hover:text-blue-500 transition-colors cursor-pointer"
          >
            {secUi.homeBreadcrumb}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-500">{secUi.toolsBreadcrumb}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span 
            className="font-bold"
            style={{ color: 'var(--app-text-primary, #ffffff)' }}
          >
            {currentToolName}
          </span>
        </nav>

        {/* Desktop Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {onResetTool && (
            <button
              id={`reset-btn-${tool.id}`}
              onClick={handleResetWithToast}
              title={secUi.resetTooltip}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer tool-reset-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{secUi.resetButton}</span>
            </button>
          )}

          <button
            id={`copy-tool-link-${tool.id}`}
            onClick={handleCopyLink}
            title={secUi.shareTooltip}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer tool-share-btn"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[#10B981]">{secUi.shareCopied}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>{secUi.shareButton}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Main Calculator Card - Themed Surface */}
      <section 
        id={`calculator-card-${tool.id}`}
        className="tool-themed-card rounded-2xl sm:rounded-3xl shadow-xs dark:shadow-2xl dark:shadow-black/50 overflow-hidden border transition-colors duration-200"
        style={{
          backgroundColor: 'var(--app-surface, #1b1d33)',
          borderColor: 'var(--app-border, #272a47)',
        }}
      >
        {children}
      </section>

      {/* Description & SEO Tagline Card: Placed below the calculator card */}
      <div 
        className="tool-seo-desc-card rounded-2xl p-4 sm:p-5 space-y-2 border transition-colors shadow-sm"
        style={{
          backgroundColor: 'var(--app-surface, #1b1d33)',
          borderColor: 'var(--app-border, #272a47)',
        }}
      >
        <div className="flex flex-wrap items-baseline gap-2">
          <h1 
            className="text-base sm:text-lg font-bold tracking-tight leading-snug"
            style={{ color: 'var(--app-text-primary, #ffffff)' }}
          >
            {toolSEO?.title || tool.seoH1}
          </h1>
          {tool.tagline && (
            <span 
              className="font-normal text-xs sm:text-sm"
              style={{ color: 'var(--app-text-muted, #94a3b8)' }}
            >
              – {tool.tagline}
            </span>
          )}
        </div>
        {(toolSEO?.description || tool.description) && (
          <p 
            className="text-xs sm:text-sm leading-relaxed max-w-4xl"
            style={{ color: 'var(--app-text-secondary, #cbd5e1)' }}
          >
            {toolSEO?.description || tool.description}
          </p>
        )}
      </div>

      {/* Sponsored Ad Banner - Optimized for SEO Core Web Vitals (Zero CLS) */}
      <section id={`ad-container-${tool.id}`} aria-label="Quảng cáo tài trợ">
        <AdBanner slot="middle" format="horizontal" />
      </section>

      {/* 4. SEO Section: H2 Cách sử dụng & Công thức toán học */}
      <section id="seo-formula-usage" className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Usage Guide (H2) */}
        <div 
          className="rounded-2xl p-5 sm:p-6 space-y-4 border transition-colors shadow-sm"
          style={{
            backgroundColor: 'var(--app-surface, #1b1d33)',
            borderColor: 'var(--app-border, #272a47)',
          }}
        >
          <div 
            className="flex items-center gap-2 font-bold text-lg"
            style={{ color: 'var(--app-text-primary, #ffffff)' }}
          >
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h2>{secUi.guideTitle(currentToolName)}</h2>
          </div>
          <ol 
            className="space-y-3 text-sm"
            style={{ color: 'var(--app-text-secondary, #cbd5e1)' }}
          >
            {tool.usageSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-500 dark:text-blue-400 text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Formula & Principles (H2) */}
        <div 
          className="rounded-2xl p-5 sm:p-6 space-y-4 border transition-colors shadow-sm"
          style={{
            backgroundColor: 'var(--app-surface, #1b1d33)',
            borderColor: 'var(--app-border, #272a47)',
          }}
        >
          <div 
            className="flex items-center gap-2 font-bold text-lg"
            style={{ color: 'var(--app-text-primary, #ffffff)' }}
          >
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <h2>{secUi.formulaTitle}</h2>
          </div>
          <p 
            className="text-sm leading-relaxed"
            style={{ color: 'var(--app-text-secondary, #cbd5e1)' }}
          >
            {tool.formulaDescription}
          </p>
          {tool.formulaEquation && (
            <div 
              className="p-3.5 rounded-xl text-emerald-600 dark:text-emerald-400 font-mono text-sm tracking-wide overflow-x-auto text-center font-bold border"
              style={{
                backgroundColor: 'var(--app-subsurface, #141526)',
                borderColor: 'var(--app-border, #272a47)',
              }}
            >
              {tool.formulaEquation}
            </div>
          )}
          <div 
            className="text-xs flex items-center gap-1.5 pt-1"
            style={{ color: 'var(--app-text-muted, #94a3b8)' }}
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>{secUi.formulaVerified}</span>
          </div>
        </div>
      </section>

      {/* Explore More Section (Matches user's screenshot with `>` button on each card) */}
      <ExploreMoreSection
        onOpenGeminiDrawer={(key) => {
          if (onOpenGemini) {
            onOpenGemini(key);
          }
        }}
      />

      {/* Bottom Ad Banner - Multi-device responsive (Desktop, Tablet, Mobile) */}
      <section id={`bottom-ad-container-${tool.id}`} aria-label="Quảng cáo tài trợ đối tác">
        <AdBanner slot="bottom" format="horizontal" />
      </section>

      {/* 5. FAQ Accordion (Schema FAQPage) */}
      <section 
        id="faq-section" 
        className="rounded-2xl p-5 sm:p-6 space-y-4 border transition-colors shadow-sm"
        style={{
          backgroundColor: 'var(--app-surface, #1b1d33)',
          borderColor: 'var(--app-border, #272a47)',
        }}
      >
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 font-bold text-lg"
            style={{ color: 'var(--app-text-primary, #ffffff)' }}
          >
            <HelpCircle className="w-5 h-5 text-blue-500" />
            <h2>{secUi.faqTitle}</h2>
          </div>
          <span 
            className="text-xs font-mono"
            style={{ color: 'var(--app-text-muted, #94a3b8)' }}
          >
            Schema FAQPage ✓
          </span>
        </div>

        <div className="space-y-2.5">
          {tool.faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index}
                className="border rounded-xl overflow-hidden transition-colors"
                style={{
                  backgroundColor: 'var(--app-subsurface, #141526)',
                  borderColor: 'var(--app-border, #272a47)',
                }}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold transition-colors"
                  style={{ color: 'var(--app-text-primary, #ffffff)' }}
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'
                  }`} />
                </button>
                {isOpen && (
                  <div 
                    className="px-4 pb-4 text-sm leading-relaxed border-t pt-3 animate-in fade-in"
                    style={{ 
                      color: 'var(--app-text-secondary, #cbd5e1)',
                      borderColor: 'var(--app-border, #272a47)'
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Internal Linking (Cross links between related tools) */}
      <section 
        id="internal-links-section" 
        className="rounded-2xl p-5 space-y-3 border transition-colors shadow-sm"
        style={{
          backgroundColor: 'var(--app-surface, #1b1d33)',
          borderColor: 'var(--app-border, #272a47)',
        }}
      >
        <div 
          className="flex items-center gap-2 text-sm font-bold"
          style={{ color: 'var(--app-text-primary, #ffffff)' }}
        >
          <LinkIcon className="w-4 h-4 text-blue-500" />
          <span>{secUi.relatedTitle}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tool.relatedToolIds.map((relId) => {
            const relTool = TOOLS_CONFIG[relId];
            if (!relTool) return null;
            const relName = t.toolNames[relId] || relTool.name;
            return (
              <button
                key={relId}
                id={`related-tool-${relId}`}
                onClick={() => {
                  onSelectTool(relId);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center justify-between p-3 rounded-xl border text-left transition-all group hover:shadow-md cursor-pointer"
                style={{
                  backgroundColor: 'var(--app-subsurface, #141526)',
                  borderColor: 'var(--app-border, #272a47)',
                }}
              >
                <div>
                  <h4 
                    className="text-sm font-semibold group-hover:text-blue-500 transition-colors"
                    style={{ color: 'var(--app-text-primary, #ffffff)' }}
                  >
                    {relName}
                  </h4>
                  <span 
                    className="text-[11px]"
                    style={{ color: 'var(--app-text-muted, #94a3b8)' }}
                  >
                    {relTool.badge}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Bottom spacer for mobile bar */}
      <div className="h-16 md:hidden" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-20 right-4 md:right-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/95 text-white text-xs font-semibold shadow-2xl border border-blue-500/40 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
