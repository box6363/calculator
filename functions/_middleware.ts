import { 
  renderServerHtml, 
  generateDynamicSitemap, 
  generateRobotsTxt,
  SUPPORTED_LANGS,
  VALID_TOOLS 
} from '../src/server/seoPrerender';
import { ToolId } from '../src/types';

interface Env {
  GEMINI_API_KEY?: string;
  APP_URL?: string;
  [key: string]: any;
}

interface EventContext {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}

// Map Cloudflare cf-ipcountry to supported ISO languages
const GEO_COUNTRY_MAP: Record<string, string> = {
  VN: 'vi',
  JP: 'ja',
  KR: 'ko',
  CN: 'zh', TW: 'zh', HK: 'zh',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es',
  FR: 'fr', BE: 'fr',
  DE: 'de', AT: 'de', CH: 'de',
  BR: 'pt', PT: 'pt',
  RU: 'ru', BY: 'ru', KZ: 'ru',
  ID: 'id',
  TH: 'th',
  IN: 'hi',
  SA: 'ar', AE: 'ar', EG: 'ar', QA: 'ar', KW: 'ar', OM: 'ar',
  IT: 'it',
  NL: 'nl',
  TR: 'tr',
  PL: 'pl',
  MY: 'ms',
  SE: 'sv',
  US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en', SG: 'en'
};

export async function onRequest(context: EventContext): Promise<Response> {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Determine base domain from config or current request
  const baseUrl = (env.APP_URL || url.origin).replace(/\/+$/, '');

  // 1. Dynamic Sitemap.xml (180+ international URLs with hreflang)
  if (pathname === '/sitemap.xml') {
    const xml = generateDynamicSitemap(baseUrl);
    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  }

  // 2. Dynamic Robots.txt
  if (pathname === '/robots.txt') {
    const txt = generateRobotsTxt(baseUrl);
    return new Response(txt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  }

  // 3. Health check API
  if (pathname === '/api/health') {
    return new Response(
      JSON.stringify({
        status: 'ok',
        platform: 'cloudflare-pages',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  }

  // 4. Gemini AI API endpoint for Cloudflare Pages Functions
  if (pathname === '/api/gemini/answer' && request.method === 'POST') {
    try {
      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'GEMINI_API_KEY is not configured on Cloudflare' }),
          { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
        );
      }

      const body = (await request.json()) as { prompt?: string; context?: string };
      const userPrompt = body.prompt;

      if (!userPrompt || typeof userPrompt !== 'string' || !userPrompt.trim()) {
        return new Response(
          JSON.stringify({ error: 'Missing prompt parameter' }),
          { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
        );
      }

      const systemInstruction = `You are an expert mathematician and financial calculator assistant for Web Calculator (AC Studio). 
Give concise, clear step-by-step explanations for mathematical, financial, health (BMI), or unit conversion queries. 
Always output clean plain text or simple markdown. Keep answers under 150 words.`;

      const fullPrompt = body.context 
        ? `${systemInstruction}\nContext: ${body.context}\nUser Question: ${userPrompt}`
        : `${systemInstruction}\nUser Question: ${userPrompt}`;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 600,
          },
        }),
      });

      if (!geminiRes.ok) {
        const errorText = await geminiRes.text();
        return new Response(
          JSON.stringify({ error: 'Gemini API Error', details: errorText }),
          { status: 502, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
        );
      }

      const geminiData = (await geminiRes.json()) as any;
      const answer = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No explanation generated.';

      return new Response(
        JSON.stringify({ answer }),
        { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: 'Internal Server Error', details: err?.message || String(err) }),
        { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }
  }

  // 5. Geo-redirect for root '/'
  if (pathname === '/' || pathname === '') {
    const cfCountry = request.headers.get('cf-ipcountry') || '';
    const detectedLang = GEO_COUNTRY_MAP[cfCountry.toUpperCase()] || 'en';
    
    // Redirect to localized default (e.g. /vi/ or /en/)
    const redirectUrl = new URL(`/${detectedLang}/`, request.url);
    return Response.redirect(redirectUrl.toString(), 302);
  }

  // 6. Check if URL matches /:lang or /:lang/:toolId for Server-Side Prerendering
  const pathParts = pathname.split('/').filter(Boolean);
  if (pathParts.length >= 1) {
    const langCandidate = pathParts[0].toLowerCase();

    if (SUPPORTED_LANGS.includes(langCandidate as any)) {
      const toolCandidate = pathParts[1]?.toLowerCase();
      const toolId: ToolId = (toolCandidate && VALID_TOOLS.includes(toolCandidate as any))
        ? (toolCandidate as ToolId)
        : 'basic';

      // Fetch the static index.html built by Vite from Cloudflare Pages static assets
      const response = await next();
      
      // If the static asset was fetched successfully, inject the complete SEO Prerender markup
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html') || response.status === 200 || response.status === 404) {
        const templateHtml = await response.text();
        const renderedHtml = renderServerHtml(templateHtml, langCandidate as any, toolId, baseUrl);

        const newHeaders = new Headers(response.headers);
        newHeaders.set('Content-Type', 'text/html; charset=utf-8');
        newHeaders.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');

        return new Response(renderedHtml, {
          status: 200,
          headers: newHeaders,
        });
      }

      return response;
    }
  }

  // Default passthrough to static assets
  return next();
}
