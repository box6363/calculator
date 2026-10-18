import { Env, verifyGoogleToken, getVietnamTodayString, jsonResponse } from '../../utils/d1Auth';

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

    if (!env.DB) {
      return jsonResponse({
        success: false,
        error: 'Cloudflare D1 Database chưa được liên kết với binding DB.'
      }, 503);
    }

    // Tra cứu người dùng trong D1 Database
    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first() as any;

    if (!user) {
      return jsonResponse({
        success: false,
        notRegistered: true,
        error: 'Chưa có tài khoản. Vui lòng chuyển sang tab Đăng ký để tạo tài khoản mới.'
      }, 404);
    }

    const todayVN = getVietnamTodayString();
    let aiCountToday = user.ai_count_today || 0;
    if (user.ai_reset_date !== todayVN) {
      aiCountToday = 0;
    }

    // Kiểm tra hết hạn gói VIP
    const now = Date.now();
    const isFree = user.plan === 'free';
    const expiresTime = user.expires_at ? new Date(user.expires_at).getTime() : 0;
    const diffMs = expiresTime - now;
    const isVipExpired = !isFree && expiresTime > 0 && diffMs <= 0;
    const effectivePlan = isVipExpired ? 'free' : user.plan;
    const effectiveStatus = isVipExpired ? 'expired' : 'active';
    const daysRemaining = isFree ? undefined : Math.max(0, Math.ceil(diffMs / 86400000));

    // Cập nhật lại trạng thái nếu có thay đổi
    const nowIso = new Date().toISOString();
    await env.DB.prepare(`
      UPDATE users 
      SET last_login_at = ?,
          plan = ?,
          status = ?,
          ai_count_today = ?,
          ai_reset_date = ?
      WHERE email = ?
    `).bind(nowIso, effectivePlan, effectiveStatus, aiCountToday, todayVN, email).run();

    const customer = {
      id: user.id,
      stt: user.stt,
      email: user.email,
      name: name || user.name,
      avatar: avatar || user.avatar,
      plan: effectivePlan,
      rawPlan: user.plan,
      isExpired: isVipExpired,
      daysRemaining,
      status: effectiveStatus,
      aiCountToday,
      aiResetDate: todayVN,
      aiQuotaRemaining: user.ai_quota_remaining ?? (effectivePlan === 'yearly' ? 7200 : effectivePlan === 'monthly' ? 1500 : Math.max(0, 3 - aiCountToday)),
      totalAiQueries: user.total_ai_queries || 0
    };

    return jsonResponse({
      success: true,
      customer,
      message: isVipExpired
        ? 'Đăng nhập thành công! Gói VIP đã hết hạn và chuyển về gói Free.'
        : `Đăng nhập thành công! Chào mừng ${customer.name}.`
    });
  } catch (err: any) {
    return jsonResponse({ success: false, error: err?.message || 'Lỗi xử lý đăng nhập' }, 500);
  }
}
