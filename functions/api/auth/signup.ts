import { Env, verifyGoogleToken, getVietnamTodayString, jsonResponse, getD1 } from '../../utils/d1Auth';

interface EventContext {
  request: Request;
  env: Env;
}

export async function onRequest(context: EventContext): Promise<Response> {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 200);
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  try {
    const body = (await request.json()) as { accessToken?: string; email?: string; name?: string; avatar?: string };
    let email = '';
    let name = '';
    let avatar = '';

    if (body.accessToken) {
      const verified = await verifyGoogleToken(body.accessToken);
      if (!verified) {
        return jsonResponse({ success: false, error: 'Mã xác thực Google không hợp lệ hoặc đã hết hạn.' }, 401);
      }
      email = verified.email;
      name = verified.name;
      avatar = verified.avatar || '';
    } else if (body.email) {
      email = body.email.trim().toLowerCase();
      name = body.name || email.split('@')[0];
      avatar = body.avatar || '';
    } else {
      return jsonResponse({ success: false, error: 'Thiếu token xác thực Google hoặc email' }, 400);
    }

    const db = getD1(env);
    if (!db) {
      return jsonResponse({
        success: false,
        error: 'Cloudflare D1 Database chưa được liên kết. Vui lòng kiểm tra Bindings trong Cloudflare Pages Settings.'
      }, 503);
    }

    // Tra cứu xem tài khoản đã tồn tại chưa
    const existing = await db.prepare('SELECT id, email FROM users WHERE email = ?').bind(email).first();

    if (existing) {
      return jsonResponse({
        success: false,
        alreadyExists: true,
        error: 'Tài khoản với email này đã tồn tại trên hệ thống. Vui lòng chuyển sang tab Đăng nhập.'
      }, 409);
    }

    // Đếm số lượng users để cấp STT
    const countRow = await db.prepare('SELECT count(*) as total FROM users').first() as any;
    const nextStt = (countRow?.total || 0) + 1;

    const todayVN = getVietnamTodayString();
    const nowIso = new Date().toISOString();
    const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const formattedAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;

    await db.prepare(`
      INSERT INTO users (
        id, stt, email, name, avatar, plan, price, currency, payment_method,
        subscribed_at, expires_at, status, ai_count_today, ai_reset_date,
        ai_quota_remaining, total_ai_queries, last_login_at
      ) VALUES (?, ?, ?, ?, ?, 'free', 0, 'USD', 'google_signup', ?, NULL, 'active', 0, ?, 3, 0, ?)
    `).bind(newId, nextStt, email, name, formattedAvatar, nowIso, todayVN, nowIso).run();

    const customer = {
      id: newId,
      stt: nextStt,
      email,
      name,
      avatar: formattedAvatar,
      plan: 'free',
      price: 0,
      currency: 'USD',
      paymentMethod: 'google_signup',
      subscribedAt: nowIso,
      expiresAt: null,
      status: 'active',
      aiCountToday: 0,
      aiResetDate: todayVN,
      aiQuotaRemaining: 3,
      totalAiQueries: 0
    };

    return jsonResponse({
      success: true,
      isNew: true,
      customer,
      message: `Đăng ký thành công tài khoản Free (3 lượt AI/ngày, có quảng cáo) cho ${email}!`
    });
  } catch (err: any) {
    return jsonResponse({ success: false, error: err?.message || 'Lỗi xử lý đăng ký' }, 500);
  }
}
