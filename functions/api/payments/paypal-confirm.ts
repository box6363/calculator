import { Env, verifyGoogleToken, jsonResponse } from '../../utils/d1Auth';

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
      orderId?: string;
      plan?: 'monthly' | 'yearly';
      email?: string;
      accessToken?: string;
    };

    const { orderId, plan } = body;
    let email = body.email ? body.email.trim().toLowerCase() : '';

    if (body.accessToken) {
      const verified = await verifyGoogleToken(body.accessToken);
      if (verified) {
        email = verified.email;
      }
    }

    if (!orderId || !plan || !email) {
      return jsonResponse({ success: false, error: 'Thiếu mã đơn hàng PayPal, gói cước hoặc email người dùng' }, 400);
    }

    if (plan !== 'monthly' && plan !== 'yearly') {
      return jsonResponse({ success: false, error: 'Gói cước không hợp lệ (chỉ hỗ trợ monthly hoặc yearly)' }, 400);
    }

    if (!env.DB) {
      return jsonResponse({ success: false, error: 'Database D1 chưa được cấu hình' }, 503);
    }

    // 1. Kiểm tra xác thực đơn hàng từ PayPal nếu cấu hình API credentials
    if (env.PAYPAL_CLIENT_ID && env.PAYPAL_SECRET) {
      try {
        const auth = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`);
        const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: 'grant_type=client_credentials'
        });

        if (tokenRes.ok) {
          const tokenData = (await tokenRes.json()) as any;
          const ppToken = tokenData.access_token;
          const orderRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
            headers: {
              'Authorization': `Bearer ${ppToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (orderRes.ok) {
            const orderData = (await orderRes.json()) as any;
            if (orderData.status !== 'COMPLETED' && orderData.status !== 'APPROVED') {
              return jsonResponse({
                success: false,
                error: `Đơn hàng PayPal ${orderId} chưa hoàn tất thanh toán (trạng thái: ${orderData.status})`
              }, 400);
            }
          }
        }
      } catch (e: any) {
        console.warn('Lỗi kiểm tra PayPal API:', e?.message);
      }
    }

    // 2. Tra cứu người dùng trong D1
    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first() as any;

    if (!user) {
      return jsonResponse({
        success: false,
        error: 'Tài khoản chưa được tạo trong hệ thống. Vui lòng đăng ký trước.'
      }, 404);
    }

    const durationDays = plan === 'yearly' ? 365 : 30;
    const additionalQuota = plan === 'yearly' ? 7200 : 1500;
    const price = plan === 'yearly' ? 49.99 : 4.99;
    const now = Date.now();

    // Tính hạn sử dụng: Nếu đang còn VIP thì cộng dồn từ hạn cũ, nếu đã hết hạn thì tính từ hiện tại
    let baseTime = now;
    if (user.expires_at && user.plan !== 'free') {
      const currentExpiry = new Date(user.expires_at).getTime();
      if (currentExpiry > now) {
        baseTime = currentExpiry;
      }
    }

    const newExpiresAt = new Date(baseTime + durationDays * 86400000).toISOString();
    
    // Cộng dồn số câu hỏi AI
    const currentQuota = (typeof user.ai_quota_remaining === 'number' && user.plan !== 'free')
      ? user.ai_quota_remaining
      : 0;
    const newAiQuota = currentQuota + additionalQuota;

    const nowIso = new Date().toISOString();

    // Cập nhật D1 Database
    await env.DB.prepare(`
      UPDATE users 
      SET plan = ?,
          price = ?,
          currency = 'USD',
          payment_method = 'paypal',
          paypal_order_id = ?,
          subscribed_at = ?,
          expires_at = ?,
          status = 'active',
          ai_quota_remaining = ?
      WHERE email = ?
    `).bind(plan, price, orderId, nowIso, newExpiresAt, newAiQuota, email).run();

    // Ghi nhận lịch sử giao dịch
    const payRecordId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await env.DB.prepare(`
      INSERT INTO payment_records (
        id, user_email, plan, amount, currency, payment_method, order_id, status, memo, confirmed_at
      ) VALUES (?, ?, ?, ?, 'USD', 'paypal', ?, 'completed', 'Thanh toán trực tuyến PayPal', ?)
    `).bind(payRecordId, email, plan, price, orderId, nowIso).run();

    const daysRemaining = Math.max(0, Math.ceil((new Date(newExpiresAt).getTime() - Date.now()) / 86400000));

    return jsonResponse({
      success: true,
      customer: {
        ...user,
        plan,
        price,
        paymentMethod: 'paypal',
        paypalOrderId: orderId,
        subscribedAt: nowIso,
        expiresAt: newExpiresAt,
        daysRemaining,
        status: 'active',
        aiQuotaRemaining: newAiQuota
      },
      message: `Xác nhận thanh toán PayPal thành công! Đã kích hoạt gói VIP ${plan === 'yearly' ? '1 Năm (+7200 câu)' : '1 Tháng (+1500 câu)'} cho ${email}`
    });
  } catch (err: any) {
    return jsonResponse({ success: false, error: err?.message || 'Lỗi xử lý xác nhận thanh toán PayPal' }, 500);
  }
}
