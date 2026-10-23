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

  // Block insecure /api/customers/subscribe
  if (pathname === '/api/customers/subscribe') {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Route /api/customers/subscribe đã bị vô hiệu hóa vì lý do bảo mật. Vui lòng sử dụng /api/payments/paypal-confirm hoặc xác nhận qua Admin.' 
      }),
      { status: 403, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
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

      const body = (await request.json()) as { 
        prompt?: string; 
        context?: string; 
        userEmail?: string; 
        token?: string; 
      };
      const userPrompt = body.prompt;

      if (!userPrompt || typeof userPrompt !== 'string' || !userPrompt.trim()) {
        return new Response(
          JSON.stringify({ error: 'Missing prompt parameter' }),
          { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
        );
      }

      // Kiểm tra đăng nhập (Khách chưa đăng nhập không dùng được AI tools)
      const userEmail = (body.userEmail || request.headers.get('x-user-email') || '').trim().toLowerCase();
      if (!userEmail) {
        return new Response(
          JSON.stringify({
            error: 'Vui lòng đăng nhập bằng tài khoản Google để sử dụng công cụ AI giải toán & phân tích.',
            requireLogin: true
          }),
          { status: 401, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
        );
      }

      // Kiểm tra hạn mức trong Cloudflare D1
      let userRecord: any = null;
      const now = new Date();
      const vnTime = new Date(now.getTime() + (7 * 60 + now.getTimezoneOffset()) * 60000);
      const todayVN = `${vnTime.getFullYear()}-${String(vnTime.getMonth() + 1).padStart(2, '0')}-${String(vnTime.getDate()).padStart(2, '0')}`;

      const db = env.DB || env.acccalculator || env.DATABASE || env.d1;
      if (db) {
        try {
          userRecord = await db.prepare('SELECT * FROM users WHERE email = ?').bind(userEmail).first();
          if (!userRecord) {
            return new Response(
              JSON.stringify({
                error: 'Tài khoản chưa tồn tại trong hệ thống. Vui lòng bấm Đăng ký để bắt đầu.',
                requireLogin: true
              }),
              { status: 401, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
            );
          }

          // Kiểm tra hạn VIP
          const isFree = userRecord.plan === 'free';
          const expiresTime = userRecord.expires_at ? new Date(userRecord.expires_at).getTime() : 0;
          const isVipExpired = !isFree && expiresTime > 0 && expiresTime <= Date.now();

          if (isVipExpired) {
            userRecord.plan = 'free';
            await env.DB.prepare("UPDATE users SET plan = 'free', status = 'expired' WHERE email = ?").bind(userEmail).run();
          }

          if (userRecord.plan === 'free') {
            // Tài khoản Free: Giới hạn 3 câu/ngày theo giờ VN
            let aiCountToday = userRecord.ai_count_today || 0;
            if (userRecord.ai_reset_date !== todayVN) {
              aiCountToday = 0;
            }
            if (aiCountToday >= 3) {
              return new Response(
                JSON.stringify({
                  error: 'Bạn đã sử dụng hết 3 lượt AI miễn phí hôm nay (theo giờ Việt Nam). Vui lòng nâng cấp VIP để tiếp tục hoặc quay lại ngày mai.',
                  quotaExceeded: true,
                  plan: 'free',
                  usedToday: aiCountToday,
                  limitToday: 3
                }),
                { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
              );
            }
          } else {
            // Tài khoản VIP: Kiểm tra số câu hỏi còn lại
            const quota = typeof userRecord.ai_quota_remaining === 'number' ? userRecord.ai_quota_remaining : 1500;
            if (quota <= 0) {
              return new Response(
                JSON.stringify({
                  error: 'Bạn đã dùng hết số câu hỏi trong gói VIP hiện tại. Vui lòng gia hạn để tiếp tục.',
                  quotaExceeded: true,
                  plan: userRecord.plan
                }),
                { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
              );
            }
          }
        } catch (dbErr) {
          console.warn('Lỗi kiểm tra quota trong D1:', dbErr);
        }
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

      // Cập nhật lượt hỏi trong D1
      if (db && userRecord) {
        try {
          if (userRecord.plan === 'free') {
            let nextCount = (userRecord.ai_reset_date === todayVN ? (userRecord.ai_count_today || 0) : 0) + 1;
            await db.prepare(`
              UPDATE users 
              SET ai_count_today = ?, ai_reset_date = ?, total_ai_queries = total_ai_queries + 1
              WHERE email = ?
            `).bind(nextCount, todayVN, userEmail).run();
          } else {
            await db.prepare(`
              UPDATE users 
              SET ai_quota_remaining = MAX(0, ai_quota_remaining - 1), total_ai_queries = total_ai_queries + 1
              WHERE email = ?
            `).bind(userEmail).run();
          }
        } catch (updateErr) {
          console.warn('Lỗi cập nhật quota D1:', updateErr);
        }
      }

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
      
      // If the static asset was fetched successfully, inject the complete SEO Prerender markup only for HTML responses
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
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
