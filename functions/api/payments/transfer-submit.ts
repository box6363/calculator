import { Env, verifyGoogleToken, jsonResponse, getD1 } from '../../utils/d1Auth';

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
      plan?: 'monthly' | 'yearly';
      paymentMethod?: string;
      email?: string;
      memo?: string;
      amount?: number;
      accessToken?: string;
    };

    const { plan, paymentMethod = 'vietqr', memo, amount } = body;
    let email = body.email ? body.email.trim().toLowerCase() : '';

    if (body.accessToken) {
      const verified = await verifyGoogleToken(body.accessToken);
      if (verified) {
        email = verified.email;
      }
    }

    if (!email || !plan) {
      return jsonResponse({ success: false, error: 'Thiếu email hoặc gói cước' }, 400);
    }

    const priceVND = amount || (plan === 'yearly' ? 2750000 : 250000);
    const payRecordId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const nowIso = new Date().toISOString();

    const db = getD1(env);
    if (db) {
      try {
        await db.prepare(`
          INSERT INTO payment_records (
            id, user_email, plan, amount, currency, payment_method, order_id, status, memo
          ) VALUES (?, ?, ?, ?, 'VND', ?, ?, 'pending', ?)
        `).bind(payRecordId, email, plan, priceVND, paymentMethod, `TRANS-${Date.now()}`, memo || 'Chờ đối soát ngân hàng').run();
      } catch (dbErr) {
        console.warn('Lỗi lưu payment_records:', dbErr);
      }
    }

    return jsonResponse({
      success: true,
      pending: true,
      recordId: payRecordId,
      memo,
      message: 'Đã ghi nhận thông tin chuyển khoản! Ban quản trị sẽ đối soát và kích hoạt gói VIP cho bạn trong thời gian sớm nhất (thường từ 1-5 phút).'
    });
  } catch (err: any) {
    return jsonResponse({ success: false, error: err?.message || 'Lỗi ghi nhận chuyển khoản' }, 500);
  }
}
