// Cloudflare D1 Authentication & Quota Helpers

export interface Env {
  DB?: any; // Cloudflare D1 binding
  GEMINI_API_KEY?: string;
  GOOGLE_CLIENT_ID?: string;
  ADMIN_KEY?: string;
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_SECRET?: string;
  APP_URL?: string;
  [key: string]: any;
}

// Vietnam date format YYYY-MM-DD (UTC+7)
export function getVietnamTodayString(): string {
  const now = new Date();
  const vnTime = new Date(now.getTime() + (7 * 60 + now.getTimezoneOffset()) * 60000);
  const year = vnTime.getFullYear();
  const month = String(vnTime.getMonth() + 1).padStart(2, '0');
  const day = String(vnTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Verify Google Token (Access Token or ID Token)
export async function verifyGoogleToken(token: string): Promise<{ email: string; name: string; avatar?: string } | null> {
  if (!token || typeof token !== 'string') return null;

  // 1. Try Google UserInfo Bearer token
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json() as any;
      if (data?.email) {
        return {
          email: data.email.toLowerCase().trim(),
          name: data.name || data.email.split('@')[0],
          avatar: data.picture
        };
      }
    }
  } catch {}

  // 2. Try Google TokenInfo (for ID Token / JWT)
  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
    if (res.ok) {
      const data = await res.json() as any;
      if (data?.email) {
        return {
          email: data.email.toLowerCase().trim(),
          name: data.name || data.email.split('@')[0],
          avatar: data.picture
        };
      }
    }
  } catch {}

  return null;
}

// Helper to format JSON responses with CORS & Security headers
export function jsonResponse(data: any, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-key, x-user-email',
      ...headers
    }
  });
}
