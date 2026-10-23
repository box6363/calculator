import { Env, jsonResponse, getD1 } from '../../utils/d1Auth';

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
    const body = (await request.json()) as {
      adminKey?: string;
      email?: string;
      plan?: 'monthly' | 'yearly';
      days?: number;
      quota?: number;
      paymentMethod?: string;
    };

    const headerKey = request.headers.get('x-admin-key');
    const providedKey = body.adminKey || headerKey;
    const expectedKey = env.ADMIN_KEY || 'admin_secret_key_123';

    if (!providedKey || providedKey !== expectedKey) {
      return jsonResponse({ success: false, error: 'Sai mã bảo mật ADMIN_KEY. Từ chối quyền truy cập.' }, 403);
    }

    const email = body.email ? body.email.trim().toLowerCase() : '';
    const plan = body.plan === 'yearly' ? 'yearly' : 'monthly';

    if (!email) {
      return jsonResponse({ success: false, error: 'Thiếu email cần cấp quyền VIP' }, 400);
    }

    const db = getD1(env);
    if (!db) {
      return jsonResponse({ success: false, error: 'D1 Database chưa cấu hình' }, 503);
    }

    const durationDays = body.days || (plan === 'yearly' ? 365 : 30);
    const addedQuota = body.quota || (plan === 'yearly' ? 7200 : 1500);
    const price = plan === 'yearly' ? 109.99 : 9.99;
    const now = Date.now();

    let user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first() as any;

    const nowIso = new Date().toISOString();

    if (!user) {
      // Tự động tạo user mới nếu chưa có
      const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const expiresAt = new Date(now + durationDays * 86400000).toISOString();
      const countRow = await db.prepare('SELECT count(*) as total FROM users').first() as any;
      const nextStt = (countRow?.total || 0) + 1;

      await db.prepare(`
        INSERT INTO users (
          id, stt, email, name, avatar, plan, price, currency, payment_method,
          subscribed_at, expires_at, status, ai_quota_remaining, last_login_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'USD', ?, ?, ?, 'active', ?, ?)
      `).bind(
        newId,
        nextStt,
        email,
        email.split('@')[0],
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        plan,
        price,
        body.paymentMethod || 'vietqr_admin',
        nowIso,
        expiresAt,
        addedQuota,
        nowIso
      ).run();

      user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
    } else {
      // Đã có user: tính hạn cộng dồn
      let baseTime = now;
      if (user.expires_at && user.plan !== 'free') {
        const currentExp = new Date(user.expires_at).getTime();
        if (currentExp > now) {
          baseTime = currentExp;
        }
      }
      const newExpiresAt = new Date(baseTime + durationDays * 86400000).toISOString();
      const currentQuota = (typeof user.ai_quota_remaining === 'number' && user.plan !== 'free')
        ? user.ai_quota_remaining
        : 0;
      const newQuota = currentQuota + addedQuota;

      await db.prepare(`
        UPDATE users
        SET plan = ?,
            price = ?,
            payment_method = ?,
            subscribed_at = ?,
            expires_at = ?,
            status = 'active',
            ai_quota_remaining = ?
        WHERE email = ?
      `).bind(plan, price, body.paymentMethod || 'vietqr_admin', nowIso, newExpiresAt, newQuota, email).run();
    }

    // Cập nhật trạng thái trong payment_records nếu có pending
    try {
      await env.DB.prepare(`
        UPDATE payment_records 
        SET status = 'completed', confirmed_at = ?
        WHERE user_email = ? AND status = 'pending'
      `).bind(nowIso, email).run();
    } catch (e) {}

    const updatedUser = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first() as any;
    const daysRemaining = Math.max(0, Math.ceil((new Date(updatedUser.expires_at).getTime() - Date.now()) / 86400000));

    return jsonResponse({
      success: true,
      message: `Admin đã kích hoạt VIP ${plan === 'yearly' ? '1 Năm (+7200 câu)' : '1 Tháng (+1500 câu)'} cho ${email}`,
      customer: {
        ...updatedUser,
        daysRemaining
      }
    });
  } catch (err: any) {
    return jsonResponse({ success: false, error: err?.message || 'Lỗi cấp quyền Admin' }, 500);
  }
}
