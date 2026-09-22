import { LanguageCode } from '../i18n/languages';
import { ToolId } from '../types';
import { getToolSEO } from '../data/internationalSEO';
import { TOOLS_CONFIG } from '../data/toolsData';
import { getLocalizedToolContent } from '../data/localizedToolContent';
import { INTERNATIONAL_SECTION_UI } from '../data/internationalSections';

export const SUPPORTED_LANGS: LanguageCode[] = [
  'en', 'vi', 'ja', 'ko', 'zh', 'es', 'fr', 'de', 'pt', 'ru',
  'id', 'th', 'hi', 'ar', 'it', 'nl', 'tr', 'pl', 'ms', 'sv'
];

export const SEO_MARKETS: { code: LanguageCode; hreflang: string; name: string }[] = [
  { code: 'en', hreflang: 'en', name: 'English' },
  { code: 'vi', hreflang: 'vi', name: 'Tiếng Việt' },
  { code: 'ja', hreflang: 'ja', name: '日本語' },
  { code: 'ko', hreflang: 'ko', name: '한국어' },
  { code: 'zh', hreflang: 'zh-Hans', name: '简体中文' },
  { code: 'es', hreflang: 'es', name: 'Español' },
  { code: 'fr', hreflang: 'fr', name: 'Français' },
  { code: 'de', hreflang: 'de', name: 'Deutsch' },
  { code: 'pt', hreflang: 'pt', name: 'Português' },
  { code: 'ru', hreflang: 'ru', name: 'Русский' },
  { code: 'id', hreflang: 'id', name: 'Bahasa Indonesia' },
  { code: 'th', hreflang: 'th', name: 'ไทย' },
  { code: 'hi', hreflang: 'hi', name: 'हिन्दी' },
  { code: 'ar', hreflang: 'ar', name: 'العربية' },
  { code: 'it', hreflang: 'it', name: 'Italiano' },
  { code: 'nl', hreflang: 'nl', name: 'Nederlands' },
  { code: 'tr', hreflang: 'tr', name: 'Türkçe' },
  { code: 'pl', hreflang: 'pl', name: 'Polski' },
  { code: 'ms', hreflang: 'ms', name: 'Bahasa Melayu' },
  { code: 'sv', hreflang: 'sv', name: 'Svenska' }
];

export const VALID_TOOLS: ToolId[] = Object.keys(TOOLS_CONFIG) as ToolId[];

export function getApplicationCategory(toolId: ToolId): string {
  switch (toolId) {
    case 'bmi':
    case 'calorie':
    case 'bodyfat':
    case 'ovulation':
    case 'pace':
    case 'bmr':
    case 'idealweight':
    case 'pregnancy':
    case 'armybodyfat':
    case 'healthyweight':
      return 'HealthApplication';
    case 'salary':
    case 'loan':
    case 'compound':
    case 'mortgage':
    case 'tax':
    case 'tip':
    case 'discount':
    case 'percentage':
    case 'autoloan':
    case 'interest':
    case 'payment':
    case 'retirement':
    case 'amortization':
    case 'investment':
    case 'inflation':
    case 'finance':
    case 'currency':
      return 'FinanceApplication';
    case 'trigonometry':
    case 'gpa':
    case 'concrete':
    case 'fraction':
    case 'triangle':
    case 'standarddeviation':
    case 'average':
    case 'meanmedianmode':
    case 'root':
    case 'exponent':
    case 'log':
    case 'quadratic':
    case 'slope':
    case 'area':
    case 'volume':
    case 'perimeter':
    case 'circle':
    case 'righttriangle':
    case 'statistics':
    case 'probability':
      return 'EducationalApplication';
    case 'basic':
    case 'unit':
    case 'age':
    case 'time':
    case 'date':
    case 'random':
    case 'password':
    case 'length':
    case 'weight':
    case 'temperature':
    case 'ipsubnet':
    case 'ai':
    default:
      return 'UtilitiesApplication';
  }
}

export function renderServerHtml(
  templateHtml: string,
  lang: LanguageCode,
  toolId?: ToolId,
  domain: string = 'https://web-calculator.com'
): string {
  const activeLang: LanguageCode = SUPPORTED_LANGS.includes(lang) ? lang : 'en';
  const activeToolId: ToolId = toolId && VALID_TOOLS.includes(toolId) ? toolId : 'basic';
  const isToolPage = Boolean(toolId && VALID_TOOLS.includes(toolId) && toolId !== 'basic');
  const isRtl = activeLang === 'ar';

  const localizedContent = getLocalizedToolContent(activeToolId, activeLang);
  const toolSEO = getToolSEO(activeToolId, activeLang);
  const sectionUi = INTERNATIONAL_SECTION_UI[activeLang] || INTERNATIONAL_SECTION_UI.en;

  const pageTitle = isToolPage 
    ? `${toolSEO.title} | Web Calculator`
    : `${toolSEO.title || 'Web Calculator – Free Online Smart Calculation Tools'} | AC Studio`;
    
  const pageDescription = toolSEO.description || localizedContent.description;

  const cleanDomain = domain.replace(/\/+$/, '');

  const canonicalUrl = (activeToolId === 'basic')
    ? `${cleanDomain}/${activeLang}/`
    : `${cleanDomain}/${activeLang}/${activeToolId}`;

  // 1. Build Hreflang Tags with Canonicalization for 'basic'
  const hreflangToolSuffix = (activeToolId === 'basic') ? '' : activeToolId;
  const hreflangTags = [
    `<link rel="alternate" hreflang="x-default" href="${cleanDomain}/en/${hreflangToolSuffix}" />`,
    ...SEO_MARKETS.map(m => 
      `<link rel="alternate" hreflang="${m.hreflang}" href="${cleanDomain}/${m.code}/${hreflangToolSuffix}" />`
    )
  ].join('\n    ');

  // 2. Build Structured Data JSON-LD
  const schemaGraph: any[] = [
    {
      "@type": "Organization",
      "@id": `${cleanDomain}/#organization`,
      "name": "AC Studio",
      "url": `${cleanDomain}/`,
      "logo": `${cleanDomain}/og-image.png`
    },
    {
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#webapp`,
      "url": canonicalUrl,
      "name": toolSEO.title,
      "alternateName": localizedContent.name,
      "applicationCategory": getApplicationCategory(activeToolId),
      "operatingSystem": "All modern browsers (Chrome, Safari, Firefox, Edge, Android, iOS)",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "inLanguage": activeLang,
      "description": toolSEO.description,
      "featureList": localizedContent.usageSteps,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": sectionUi.homeBreadcrumb || "Web Calculator",
          "item": `${cleanDomain}/${activeLang}/`
        },
        ...(isToolPage ? [{
          "@type": "ListItem",
          "position": 2,
          "name": localizedContent.name,
          "item": canonicalUrl
        }] : [])
      ]
    },
    {
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
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
      "@id": `${canonicalUrl}#howto`,
      "name": `${sectionUi.guideTitle(localizedContent.name)}`,
      "description": toolSEO.description,
      "step": localizedContent.usageSteps.map((step, idx) => ({
        "@type": "HowToStep",
        "position": idx + 1,
        "name": `${localizedContent.name} - Step ${idx + 1}`,
        "text": step
      }))
    }
  ];

  // 3. Build Semantic Rich SSR Content inside #root for crawlers before hydration
  const semanticRootContent = `
    <div style="padding: 24px 16px; max-width: 960px; margin: 0 auto; color: #f8fafc; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6;">
      <header style="margin-bottom: 24px; border-bottom: 1px solid #334155; padding-bottom: 16px;">
        <nav aria-label="Breadcrumb" style="font-size: 13px; color: #94a3b8; margin-bottom: 8px;">
          <a href="/${activeLang}/" style="color: #38bdf8; text-decoration: none;">${sectionUi.homeBreadcrumb || 'Home'}</a> &rsaquo; 
          <span style="color: #cbd5e1;">${localizedContent.name}</span>
        </nav>
        <h1 style="font-size: 28px; font-weight: 800; color: #60a5fa; margin: 0 0 10px 0; letter-spacing: -0.5px;">${toolSEO.title}</h1>
        <p style="color: #cbd5e1; font-size: 15px; margin: 0;">${toolSEO.description}</p>
      </header>

      <main style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Formula and Calculation Methodology -->
        <section style="background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155;">
          <h2 style="font-size: 18px; font-weight: 700; color: #38bdf8; margin: 0 0 10px 0;">${sectionUi.formulaTitle}</h2>
          <div style="background: #0f172a; padding: 12px 16px; border-radius: 8px; font-family: monospace; color: #fbbf24; font-size: 15px; margin-bottom: 10px; border-left: 4px solid #38bdf8;">
            ${localizedContent.formulaEquation}
          </div>
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">${localizedContent.formulaDescription}</p>
        </section>

        <!-- Step-by-Step Instructions -->
        <section style="background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155;">
          <h2 style="font-size: 18px; font-weight: 700; color: #38bdf8; margin: 0 0 12px 0;">${sectionUi.guideTitle(localizedContent.name)}</h2>
          <ol style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 14px; display: flex; flex-direction: column; gap: 8px;">
            ${localizedContent.usageSteps.map(step => `<li>${step}</li>`).join('\n')}
          </ol>
        </section>

        <!-- FAQ Accordion -->
        <section style="background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155;">
          <h2 style="font-size: 18px; font-weight: 700; color: #38bdf8; margin: 0 0 14px 0;">${sectionUi.faqTitle}</h2>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${localizedContent.faqs.map(faq => `
              <details style="background: #0f172a; padding: 12px 16px; border-radius: 8px; border: 1px solid #334155;">
                <summary style="font-weight: 600; color: #f1f5f9; cursor: pointer; font-size: 14px;">${faq.question}</summary>
                <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 13.5px; line-height: 1.5;">${faq.answer}</p>
              </details>
            `).join('')}
          </div>
        </section>

        <!-- Related Tools Directory -->
        <section style="margin-top: 8px;">
          <h3 style="font-size: 15px; font-weight: 700; color: #cbd5e1; margin: 0 0 12px 0;">${sectionUi.relatedTitle}</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px;">
            ${VALID_TOOLS.slice(0, 10).map(tId => {
              const otherSEO = getToolSEO(tId, activeLang);
              const otherContent = getLocalizedToolContent(tId, activeLang);
              const isCurrent = tId === activeToolId;
              const targetPath = tId === 'basic' ? `/${activeLang}/` : `/${activeLang}/${tId}`;
              return `
                <a href="${targetPath}" style="display: block; padding: 10px 14px; background: ${isCurrent ? '#2563eb' : '#1e293b'}; color: #f8fafc; text-decoration: none; border-radius: 8px; border: 1px solid #334155; font-size: 13px;">
                  <strong>${otherContent.name}</strong>
                  <div style="font-size: 11px; color: ${isCurrent ? '#dbeafe' : '#94a3b8'}; margin-top: 2px;">${otherSEO.title.slice(0, 50)}...</div>
                </a>
              `;
            }).join('')}
          </div>
        </section>
      </main>

      <footer style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; text-align: center;">
        <p>&copy; 2026 AC Studio. All rights reserved. 100% Client-Side Privacy Standard.</p>
      </footer>
    </div>
  `;

  // 4. Inject into HTML Template
  let result = templateHtml;

  // Replace <html lang="...">
  result = result.replace(/<html[^>]*>/i, `<html lang="${activeLang}" dir="${isRtl ? 'rtl' : 'ltr'}">`);

  // Replace <title>...</title>
  result = result.replace(/<title>[\s\S]*?<\/title>/i, `<title>${pageTitle}</title>`);

  // Replace meta description
  result = result.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, `<meta name="description" content="${pageDescription}" />`);

  // Enforce noindex robots meta tags
  result = result.replace(/<meta\s+name=["']robots["'][\s\S]*?>/i, `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />`);
  if (!result.includes('name="googlebot"')) {
    result = result.replace('</head>', `    <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet" />\n  </head>`);
  }

  // Replace canonical link
  result = result.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);

  // Replace Open Graph and Twitter
  result = result.replace(/<meta\s+property=["']og:title["'][\s\S]*?>/i, `<meta property="og:title" content="${pageTitle}" />`);
  result = result.replace(/<meta\s+property=["']og:description["'][\s\S]*?>/i, `<meta property="og:description" content="${pageDescription}" />`);
  result = result.replace(/<meta\s+property=["']og:url["'][\s\S]*?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  result = result.replace(/<meta\s+property=["']og:image["'][\s\S]*?>/i, `<meta property="og:image" content="${cleanDomain}/og-image.png" />`);
  result = result.replace(/<meta\s+name=["']twitter:title["'][\s\S]*?>/i, `<meta name="twitter:title" content="${pageTitle}" />`);
  result = result.replace(/<meta\s+name=["']twitter:description["'][\s\S]*?>/i, `<meta name="twitter:description" content="${pageDescription}" />`);
  result = result.replace(/<meta\s+name=["']twitter:image["'][\s\S]*?>/i, `<meta name="twitter:image" content="${cleanDomain}/og-image.png" />`);

  // Inject dynamic keywords meta
  const keywordsMeta = `<meta name="keywords" content="${toolSEO.keywords.join(', ')}" />`;
  if (result.includes('<meta name="keywords"')) {
    result = result.replace(/<meta\s+name=["']keywords["'][\s\S]*?>/i, keywordsMeta);
  } else {
    result = result.replace('</head>', `    ${keywordsMeta}\n  </head>`);
  }

  // Replace hreflang alternate links
  const hreflangRegex = /<!-- Hreflang Alternate Links[\s\S]*?<!-- Open Graph/i;
  if (hreflangRegex.test(result)) {
    result = result.replace(
      hreflangRegex,
      `<!-- Hreflang Alternate Links for 20 International Markets -->\n    ${hreflangTags}\n\n    <!-- Open Graph`
    );
  }

  // Replace Structured Data JSON-LD
  const schemaScriptRegex = /<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i;
  const newSchemaScript = `<script type="application/ld+json">\n${JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph }, null, 2)}\n    </script>`;
  if (schemaScriptRegex.test(result)) {
    result = result.replace(schemaScriptRegex, newSchemaScript);
  }

  // Replace content inside <div id="root">...</div> with our SEO-rich semantic HTML
  const rootRegex = /<div\s+id=["']root["']>[\s\S]*?<\/div>\s*<script/i;
  if (rootRegex.test(result)) {
    result = result.replace(rootRegex, `<div id="root">${semanticRootContent}</div>\n    <script`);
  }

  return result;
}

export function generateDynamicSitemap(baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  // 1. Root URL
  xml += `  <url>\n`;
  xml += `    <loc>${cleanBase}/</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanBase}/en/" />\n`;
  for (const m of SEO_MARKETS) {
    xml += `    <xhtml:link rel="alternate" hreflang="${m.hreflang}" href="${cleanBase}/${m.code}/" />\n`;
  }
  xml += `  </url>\n`;

  // 2. Language Index URLs (Canonical for basic tool)
  for (const m of SEO_MARKETS) {
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBase}/${m.code}/</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanBase}/en/" />\n`;
    for (const alt of SEO_MARKETS) {
      xml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${cleanBase}/${alt.code}/" />\n`;
    }
    xml += `  </url>\n`;
  }

  // 3. Tool URLs for every specialized tool (excluding basic, which is canonicalized to /${m.code}/)
  const specializedTools = VALID_TOOLS.filter(tId => tId !== 'basic');
  for (const toolId of specializedTools) {
    for (const m of SEO_MARKETS) {
      xml += `  <url>\n`;
      xml += `    <loc>${cleanBase}/${m.code}/${toolId}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${toolId === 'salary' || toolId === 'loan' || toolId === 'compound' ? '0.9' : '0.8'}</priority>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanBase}/en/${toolId}" />\n`;
      for (const alt of SEO_MARKETS) {
        xml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${cleanBase}/${alt.code}/${toolId}" />\n`;
      }
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;
  return xml;
}

export function generateRobotsTxt(_baseUrl: string): string {
  return `User-agent: *\nDisallow: /\n\nUser-agent: Googlebot\nDisallow: /\n\nUser-agent: Googlebot-Image\nDisallow: /\n\nUser-agent: Mediapartners-Google\nDisallow: /\n`;
}
