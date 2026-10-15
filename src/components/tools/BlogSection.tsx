import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Clock, 
  Calendar, 
  ArrowRight, 
  ArrowLeft,
  Share2, 
  Check, 
  BookOpen, 
  Calculator, 
  HelpCircle, 
  Tag,
  ChevronRight,
  ExternalLink,
  Info,
  Flame,
  UserCheck,
  Heart
} from 'lucide-react';
import { ToolId } from '../../types';
import { BlogCategory, BlogPost } from '../../types/blog';
import { BLOG_CATEGORIES, BLOG_POSTS } from '../../data/blogData';
import { useLanguage } from '../../context/LanguageContext';
import { ToolIcon } from '../common/ToolIcon';
import { TOOLS_CONFIG } from '../../data/toolsData';

interface BlogSectionProps {
  onSelectTool?: (toolId: ToolId) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onSelectTool }) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchCat = selectedCategory === 'all' || post.category === selectedCategory;
      const title = isVi ? post.titleVi : post.titleEn;
      const excerpt = isVi ? post.excerptVi : post.excerptEn;
      const tags = isVi ? post.tagsVi.join(' ') : post.tagsEn.join(' ');
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || 
        title.toLowerCase().includes(q) || 
        excerpt.toLowerCase().includes(q) || 
        tags.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery, isVi]);

  // Featured post (adaptive per category or global featured)
  const featuredPost = useMemo(() => {
    if (selectedCategory !== 'all') {
      return BLOG_POSTS.find(p => p.category === selectedCategory && p.featured) || 
             BLOG_POSTS.find(p => p.category === selectedCategory) || 
             BLOG_POSTS[0];
    }
    return BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];
  }, [selectedCategory]);

  const isHeroVisible = !searchQuery && (selectedCategory === 'all' || featuredPost.category === selectedCategory);

  // Exclude featured hero post from grid when hero is visible to prevent duplicate cards and duplicate images
  const gridPosts = useMemo(() => {
    if (isHeroVisible && featuredPost) {
      return filteredPosts.filter(p => p.id !== featuredPost.id);
    }
    return filteredPosts;
  }, [filteredPosts, isHeroVisible, featuredPost]);

  // Active reading post
  const currentPost = useMemo(() => {
    if (!activePostId) return null;
    return BLOG_POSTS.find(p => p.id === activePostId) || null;
  }, [activePostId]);

  // Copy article link to clipboard
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      navigator.clipboard?.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Jump to tool
  const handleOpenTool = (toolId: ToolId) => {
    if (onSelectTool) {
      onSelectTool(toolId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper to format inline bold text
  const renderInlineText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Helper to format multi-paragraph rich article content with lists & subheadings
  const renderFormattedContent = (text: string) => {
    if (!text) return null;
    const blocks = text.split('\n\n').filter(Boolean);
    return (
      <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        {blocks.map((block, i) => {
          const trimmed = block.trim();
          // Check if block is a bullet list
          if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
            const items = trimmed.split('\n').filter(Boolean);
            return (
              <ul key={i} className="space-y-2.5 my-3 pl-1 sm:pl-3">
                {items.map((item, j) => {
                  const cleanItem = item.replace(/^[•\-]\s*/, '');
                  return (
                    <li key={j} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0" />
                      <span className="leading-relaxed">{renderInlineText(cleanItem)}</span>
                    </li>
                  );
                })}
              </ul>
            );
          }
          // Subheading
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={i} className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pt-3 pb-1 border-b border-slate-100 dark:border-slate-800">
                {trimmed.replace(/^###\s*/, '')}
              </h3>
            );
          }
          // Standard paragraph
          return (
            <p key={i} className="leading-relaxed">
              {renderInlineText(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  // ==========================================
  // VIEW 1: SINGLE ARTICLE DETAIL VIEW
  // ==========================================
  if (currentPost) {
    const postTitle = isVi ? currentPost.titleVi : currentPost.titleEn;
    const postExcerpt = isVi ? currentPost.excerptVi : currentPost.excerptEn;
    const tags = isVi ? currentPost.tagsVi : currentPost.tagsEn;
    const ctaLabel = isVi ? currentPost.ctaToolLabelVi : currentPost.ctaToolLabelEn;
    const relatedPosts = BLOG_POSTS.filter(p => p.id !== currentPost.id && (p.category === currentPost.category || p.relatedToolIds.some(t => currentPost.relatedToolIds.includes(t)))).slice(0, 3);

    return (
      <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={() => {
              setActivePostId(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{isVi ? 'Quay lại danh sách bài viết' : 'Back to all articles'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? (isVi ? 'Đã sao chép liên kết!' : 'Link copied!') : (isVi ? 'Chia sẻ' : 'Share')}</span>
            </button>
          </div>
        </div>

        {/* Article Header Card */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 text-white relative overflow-hidden shadow-xl">
          {currentPost.coverImage && (
            <div className="w-full aspect-[21/9] sm:aspect-[24/9] max-h-72 overflow-hidden relative">
              <img
                src={currentPost.coverImage}
                alt={postTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            </div>
          )}

          <div className="p-6 sm:p-10 relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {BLOG_CATEGORIES.find(c => c.id === currentPost.category)?.[isVi ? 'nameVi' : 'nameEn']}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentPost.readTimeMinutes} {isVi ? 'phút đọc' : 'min read'}</span>
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{currentPost.publishedDate}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              {postTitle}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              {postExcerpt}
            </p>

            {/* Author card with international credentials */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl shadow-inner border border-slate-700">
                {currentPost.author.avatar}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5 font-sans">
                  <span>{currentPost.author.name}</span>
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  {isVi ? currentPost.author.roleVi : currentPost.author.roleEn}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating/Embedded Calculator Callout Banner */}
        {currentPost.ctaToolId && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold">{isVi ? 'Trực quan hóa bài viết với số liệu của bạn:' : 'Calculate with your exact numbers:'}</div>
                <div className="text-xs text-blue-100">
                  {isVi 
                    ? `Sử dụng máy tính ${TOOLS_CONFIG[currentPost.ctaToolId]?.name || ''} hoàn toàn miễn phí`
                    : `Use our free ${TOOLS_CONFIG[currentPost.ctaToolId]?.name || ''} calculator now`}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleOpenTool(currentPost.ctaToolId!)}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs sm:text-sm hover:bg-blue-50 transition-all shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{ctaLabel || (isVi ? 'Mở Công Cụ Tính Toán' : 'Open Calculator')}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Article Body Sections */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-8 shadow-sm">
          {/* Table of contents */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>{isVi ? 'Mục lục bài viết' : 'Table of Contents'}</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              {currentPost.sections.map((sec, idx) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 font-medium"
                  >
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span>{isVi ? sec.headingVi : sec.headingEn}</span>
                  </a>
                </li>
              ))}
              {currentPost.faqs && currentPost.faqs.length > 0 && (
                <li>
                  <a
                    href="#faq-section"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 font-medium"
                  >
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span>{isVi ? 'Câu hỏi thường gặp (FAQ)' : 'Frequently Asked Questions'}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Section details */}
          <div className="space-y-8 text-slate-800 dark:text-slate-200 leading-relaxed">
            {currentPost.sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 first:border-none first:pt-0">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{isVi ? sec.headingVi : sec.headingEn}</span>
                </h2>
                {renderFormattedContent(isVi ? sec.contentVi : sec.contentEn)}

                {sec.callout && (
                  <div className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1.5 ${
                    sec.callout.type === 'tip'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200'
                      : sec.callout.type === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200'
                      : sec.callout.type === 'formula'
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60 text-blue-950 dark:text-blue-200 font-mono'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Info className="w-3.5 h-3.5" />
                      <span>{isVi ? sec.callout.titleVi : sec.callout.titleEn}</span>
                    </div>
                    <div>{isVi ? sec.callout.textVi : sec.callout.textEn}</div>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* FAQ Accordion Section */}
          {currentPost.faqs && currentPost.faqs.length > 0 && (
            <div id="faq-section" className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                <span>{isVi ? 'Câu hỏi thường gặp' : 'Frequently Asked Questions'}</span>
              </h3>
              <div className="space-y-3">
                {currentPost.faqs.map((faq, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-1.5">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">Q:</span>
                      <span>{isVi ? faq.qVi : faq.qEn}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 pl-5 leading-relaxed">
                      {isVi ? faq.aVi : faq.aEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-semibold">{isVi ? 'Chủ đề liên quan:' : 'Tags:'}</span>
            {tags.map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Calculators Bar */}
        {currentPost.relatedToolIds && currentPost.relatedToolIds.length > 0 && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>{isVi ? 'Công cụ tính toán được đề cập trong bài viết:' : 'Calculators mentioned in this article:'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentPost.relatedToolIds.map((tId) => {
                const toolMeta = TOOLS_CONFIG[tId];
                if (!toolMeta) return null;
                return (
                  <button
                    key={tId}
                    onClick={() => handleOpenTool(tId)}
                    className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-blue-500 transition-all text-left flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <ToolIcon id={tId} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                          {toolMeta.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {toolMeta.shortName}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span>{isVi ? 'Bài viết cùng chủ đề có thể bạn quan tâm:' : 'Related Articles You May Like:'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    setActivePostId(rel.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {BLOG_CATEGORIES.find(c => c.id === rel.category)?.[isVi ? 'nameVi' : 'nameEn']}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {isVi ? rel.titleVi : rel.titleEn}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {isVi ? rel.excerptVi : rel.excerptEn}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{rel.readTimeMinutes} {isVi ? 'phút' : 'min'}</span>
                    <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      {isVi ? 'Xem bài' : 'Read'} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: BLOG HOMEPAGE (LIST & GRID VIEW)
  // ==========================================
  return (
    <div id="blog-section" className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Hero Header Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-blue-500/20 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{isVi ? 'Cẩm Nang Tính Toán & Kiến Thức Thực Tiễn' : 'Calculation Guides & Practical Knowledge'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {isVi 
              ? 'Kiến Thức & Bí Quyết Tính Toán Thông Minh' 
              : 'Smart Calculation Guides & Financial Wisdom'}
          </h1>

          <p className="text-xs sm:text-sm sm:text-base text-slate-300 leading-relaxed">
            {isVi 
              ? 'Tổng hợp các bài viết chuyên sâu, công thức chuẩn xác và cẩm nang hướng dẫn thực tế về tiền lương, thuế, vay mua nhà, lãi kép, hóa đơn điện nước và sức khỏe thể hình.'
              : 'In-depth educational articles, verified calculation formulas, and actionable guides for salary, tax, mortgages, compound interest, energy bills, and scientific health.'}
          </p>

          {/* Quick Search in Blog */}
          <div className="pt-2 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isVi ? 'Tìm kiếm bài viết, công thức hoặc từ khóa...' : 'Search articles, formulas, or topics...'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 hover:border-slate-600 focus:border-blue-400 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {BLOG_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {cat.id === 'love-lifestyle' && <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/30" />}
              {cat.id === 'all' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isVi ? cat.nameVi : cat.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Hero Featured Article (Shown when no search query and 'all' or matching category) */}
      {!searchQuery && (selectedCategory === 'all' || featuredPost.category === selectedCategory) && (
        <div 
          onClick={() => {
            setActivePostId(featuredPost.id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/60 transition-all cursor-pointer group shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Hero Cover Image on Left/Top */}
          {featuredPost.coverImage && (
            <div className="lg:col-span-5 relative w-full h-56 sm:h-72 lg:h-full min-h-[220px] overflow-hidden bg-slate-950">
              <img
                src={featuredPost.coverImage}
                alt={isVi ? featuredPost.titleVi : featuredPost.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent opacity-70" />
            </div>
          )}

          <div className={`${featuredPost.coverImage ? 'lg:col-span-7' : 'lg:col-span-12'} p-6 sm:p-8 flex flex-col justify-between space-y-4`}>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-emerald-400" />
                  <span>{isVi ? 'Bài viết tiêu biểu' : 'Featured Guide'}</span>
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{featuredPost.readTimeMinutes} {isVi ? 'phút đọc' : 'min read'}</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-blue-400 transition-colors leading-snug">
                {isVi ? featuredPost.titleVi : featuredPost.titleEn}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                {isVi ? featuredPost.excerptVi : featuredPost.excerptEn}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <span className="text-lg">{featuredPost.author.avatar}</span>
                <div>
                  <div className="font-bold text-white font-sans">{featuredPost.author.name}</div>
                  <div className="text-[10px] text-slate-400 font-sans">{isVi ? featuredPost.author.roleVi : featuredPost.author.roleEn}</div>
                </div>
              </div>

              <span className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs group-hover:bg-blue-500 transition-all flex items-center gap-2 shadow-md">
                <span>{isVi ? 'Đọc bài viết ngay' : 'Read Article'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span>
              {isVi ? 'Danh Sách Bài Viết' : 'All Articles'} 
              <span className="ml-1.5 text-xs text-slate-500 font-normal">({filteredPosts.length})</span>
            </span>
          </h2>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {isVi ? 'Không tìm thấy bài viết nào phù hợp' : 'No articles match your search criteria'}
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isVi ? 'Hãy thử tìm kiếm với từ khóa khác như "lương", "thuế", "lãi kép", "tiền điện" hoặc chọn lại danh mục.' : 'Try searching for terms like "salary", "mortgage", "tax", "compound", or reset category filter.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer"
            >
              {isVi ? 'Xem tất cả bài viết' : 'View all articles'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post) => {
              const title = isVi ? post.titleVi : post.titleEn;
              const excerpt = isVi ? post.excerptVi : post.excerptEn;
              const catMeta = BLOG_CATEGORIES.find(c => c.id === post.category);

              return (
                <article
                  key={post.id}
                  onClick={() => {
                    setActivePostId(post.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500/80 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden group"
                >
                  {/* Article Cover Image */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-950">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${post.gradient} flex items-center justify-center text-white/30`}>
                        <BookOpen className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${catMeta?.badgeColor || 'bg-slate-900/80 text-white'}`}>
                        {catMeta ? (isVi ? catMeta.nameVi : catMeta.nameEn) : post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTimeMinutes} {isVi ? 'phút đọc' : 'min read'}</span>
                        </span>
                        <span>{post.publishedDate}</span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{post.author.avatar}</span>
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate max-w-[130px] font-sans">
                            {post.author.name}
                          </div>
                        </div>
                      </div>

                      <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px]">
                        <span>{isVi ? 'Đọc bài' : 'Read'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
