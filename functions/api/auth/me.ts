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

  const url = new URL(request.url);
  const emailParam = url.searchParams.get('email');
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  let email = emailParam ? emailParam.trim().toLowerCase() : '';

  if (!email && token) {
    const verified = await verifyGoogleToken(token);
    if (verified) {
      email = verified.email;
    }
  }

  if (!email) {
    return jsonResponse({ success: false, error: 'Chưa đăng nhập' }, 401);
  }

  const db = getD1(env);
  if (!db) {
    return jsonResponse({ success: false, error: 'Database chưa cấu hình' }, 503);
  }

  try {
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first() as any;

    if (!user) {
      return jsonResponse({ success: false, notRegistered: true, error: 'Tài khoản không tồn tại' }, 404);
    }

    const todayVN = getVietnamTodayString();
    let aiCountToday = user.ai_count_today || 0;
    if (user.ai_reset_date !== todayVN) {
      aiCountToday = 0;
    }

    const now = Date.now();
    const isFree = user.plan === 'free';
    const expiresTime = user.expires_at ? new Date(user.expires_at).getTime() : 0;
    const diffMs = expiresTime - now;
    const isVipExpired = !isFree && expiresTime > 0 && diffMs <= 0;
    const effectivePlan = isVipExpired ? 'free' : user.plan;
    const daysRemaining = isFree ? undefined : Math.max(0, Math.ceil(diffMs / 86400000));

    const customer = {
      id: user.id,
      stt: user.stt,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      plan: effectivePlan,
      rawPlan: user.plan,
      isExpired: isVipExpired,
      daysRemaining,
      status: isVipExpired ? 'expired' : user.status,
      aiCountToday,
      aiResetDate: todayVN,
      aiQuotaRemaining: user.ai_quota_remaining ?? (effectivePlan === 'yearly' ? 7200 : effectivePlan === 'monthly' ? 1500 : Math.max(0, 3 - aiCountToday)),
      totalAiQueries: user.total_ai_queries || 0
    };

    return jsonResponse({ success: true, customer });
  } catch (err: any) {
    return jsonResponse({ success: false, error: err?.message || 'Lỗi tra cứu thông tin' }, 500);
  }
}
