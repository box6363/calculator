import React, { useEffect } from 'react';
import { ToolMeta, ToolId } from '../../types';
import { LanguageCode } from '../../i18n/languages';
import { getToolSEO } from '../../data/internationalSEO';
import { getLocalizedToolContent } from '../../data/localizedToolContent';

interface SEOManagerProps {
  tool: ToolMeta;
  lang: LanguageCode;
}

export const SUPPORTED_SEO_MARKETS: { code: string; hreflang: string }[] = [
  { code: 'en', hreflang: 'en' },
  { code: 'vi', hreflang: 'vi' },
  { code: 'ja', hreflang: 'ja' },
  { code: 'ko', hreflang: 'ko' },
  { code: 'zh', hreflang: 'zh-Hans' },
  { code: 'es', hreflang: 'es' },
  { code: 'fr', hreflang: 'fr' },
  { code: 'de', hreflang: 'de' },
  { code: 'pt', hreflang: 'pt' },
  { code: 'ru', hreflang: 'ru' },
  { code: 'id', hreflang: 'id' },
  { code: 'th', hreflang: 'th' },
  { code: 'hi', hreflang: 'hi' },
  { code: 'ar', hreflang: 'ar' },
  { code: 'it', hreflang: 'it' },
  { code: 'nl', hreflang: 'nl' },
  { code: 'tr', hreflang: 'tr' },
  { code: 'pl', hreflang: 'pl' },
  { code: 'ms', hreflang: 'ms' },
  { code: 'sv', hreflang: 'sv' }
];

const getEffectiveDomain = () => {
  if (typeof window === 'undefined') return 'https://web-calculator.com';
  const customUrl = (import.meta as any).env?.VITE_APP_URL;
  if (customUrl) return customUrl.replace(/\/+$/, '');
  const origin = window.location.origin;
  if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
    return origin;
  }
  return 'https://web-calculator.com';
};

const getApplicationCategory = (toolId: ToolId): string => {
  switch (toolId) {
    case 'bmi':
    case 'calorie':
    case 'bodyfat':
    case 'ovulation':
    case 'pace':
      return 'HealthApplication';
    case 'salary':
    case 'loan':
    case 'compound':
    case 'mortgage':
    case 'tax':
    case 'tip':
    case 'discount':
    case 'percentage':
      return 'FinanceApplication';
    case 'trigonometry':
    case 'gpa':
    case 'concrete':
      return 'EducationalApplication';
    case 'basic':
    case 'unit':
    case 'age':
    case 'time':
    case 'date':
    case 'random':
    case 'password':
    case 'ai':
    default:
      return 'UtilitiesApplication';
  }
};

export const SEOManager: React.FC<SEOManagerProps> = ({ tool, lang }) => {
  useEffect(() => {
    const DOMAIN = getEffectiveDomain();
    const prevTitle = document.title;
    const isBasic = tool.id === 'basic';
    const toolSlug = isBasic ? '' : tool.id;
    const currentCanonicalUrl = isBasic ? `${DOMAIN}/${lang}/` : `${DOMAIN}/${lang}/${tool.id}`;
    const isRtl = lang === 'ar';
    const localizedSEO = getToolSEO(tool.id, lang);
    const localizedContent = getLocalizedToolContent(tool.id, lang);

    // 1. Update HTML language & direction attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

    // 2. Update Title
    const fullTitle = `${localizedSEO.title} | Web Calculator`;
    document.title = fullTitle;

    // 3. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = localizedSEO.description;

    // 3b. Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = localizedSEO.keywords.join(', ');

    // 4. Update OpenGraph & Twitter
    const updateOrCreateMeta = (property: string, content: string, isName = false) => {
      const selector = isName ? `meta[name="${property}"]` : `meta[property="${property}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (isName) {
          el.name = property;
        } else {
          el.setAttribute('property', property);
        }
        document.head.appendChild(el);
      }
      el.content = content;
    };

    updateOrCreateMeta('og:title', fullTitle);
    updateOrCreateMeta('og:description', localizedSEO.description);
    updateOrCreateMeta('og:url', currentCanonicalUrl);
    updateOrCreateMeta('og:type', 'website');
    updateOrCreateMeta('og:image', `${DOMAIN}/og-image.png`);
    updateOrCreateMeta('twitter:card', 'summary_large_image', true);
    updateOrCreateMeta('twitter:title', fullTitle, true);
    updateOrCreateMeta('twitter:description', localizedSEO.description, true);
    updateOrCreateMeta('twitter:image', `${DOMAIN}/og-image.png`, true);

    // 5. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = currentCanonicalUrl;

    // 6. Dynamic Hreflang Alternates (20 International Markets + x-default) directly in <head>
    // Remove all previous alternate hreflang tags (including static template tags from index.html) to prevent duplicates
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

    // x-default points to English
    const xDefaultLink = document.createElement('link');
    xDefaultLink.rel = 'alternate';
    xDefaultLink.hreflang = 'x-default';
    xDefaultLink.href = `${DOMAIN}/en/${toolSlug}`;
    xDefaultLink.setAttribute('data-dynamic-hreflang', 'true');
    document.head.appendChild(xDefaultLink);

    // 20 markets
    SUPPORTED_SEO_MARKETS.forEach(market => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = market.hreflang;
      link.href = `${DOMAIN}/${market.code}/${toolSlug}`;
      link.setAttribute('data-dynamic-hreflang', 'true');
      document.head.appendChild(link);
    });

    // 7. Dynamic JSON-LD Structured Data Schema (WebApplication, FAQPage, BreadcrumbList, HowTo)
    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": `${currentCanonicalUrl}#webapp`,
          "url": currentCanonicalUrl,
          "name": localizedSEO.title,
          "alternateName": localizedContent.name,
          "applicationCategory": getApplicationCategory(tool.id),
          "operatingSystem": "All modern browsers (Chrome, Safari, Firefox, Edge, Android, iOS)",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "inLanguage": lang,
          "description": localizedSEO.description,
          "featureList": localizedContent.usageSteps,
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${currentCanonicalUrl}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Web Calculator",
              "item": `${DOMAIN}/${lang}/`
            },
            ...(!isBasic ? [{
              "@type": "ListItem",
              "position": 2,
              "name": localizedContent.name,
              "item": currentCanonicalUrl
            }] : [])
          ]
        },
        {
          "@type": "FAQPage",
          "@id": `${currentCanonicalUrl}#faq`,
          "mainEntity": localizedContent.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        },
        {
          "@type": "HowTo",
          "@id": `${currentCanonicalUrl}#howto`,
          "name": `How to use ${localizedContent.name}`,
          "description": localizedSEO.description,
          "step": localizedContent.usageSteps.map((step, idx) => ({
            "@type": "HowToStep",
            "position": idx + 1,
            "name": `${localizedContent.name} - Step ${idx + 1}`,
            "text": step
          }))
        }
      ]
    };

    const schemaId = 'dynamic-tool-schema-jsonld';
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(schemaData);

    return () => {
      document.title = prevTitle;
    };
  }, [tool, lang]);

  return null;
};
