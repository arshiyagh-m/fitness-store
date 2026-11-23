import axios from 'axios';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Setting from '../models/Setting.js';

const getDigipayBaseUrl = (sandbox) =>
  sandbox
    ? 'https://uatbusiness.mydigipay.info/digipay/api'
    : 'https://api.mydigipay.com/digipay/api';

// دریافت توکن دسترسی OAuth از دیجی‌پی
const getDigipayAccessToken = async (setting) => {
  const { digipayUsername, digipayPassword, digipayClientId, digipayClientSecret, digipaySandbox } = setting;

  if (!digipayUsername || !digipayPassword || !digipayClientId || !digipayClientSecret) {
    throw new Error('اطلاعات درگاه دیجی‌پی در پنل مدیریت تکمیل نشده است.');
  }

  const baseUrl = getDigipayBaseUrl(digipaySandbox);
  const basicAuth = Buffer.from(`${digipayClientId}:${digipayClientSecret}`).toString('base64');

  const params = new URLSearchParams();
  params.append('username', digipayUsername);
  params.append('password', digipayPassword);
  params.append('grant_type', 'password');

  const { data } = await axios.post(`${baseUrl}/oauth/token`, params.toString(), {
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    timeout: 15000,
  });

  return { token: data.access_token, baseUrl };
};

// @desc    ایجاد تیکت پرداخت دیجی‌پی و دریافت لینک انتقال به بانک
// @route   POST /api/payment/digipay/request
export const requestDigipayPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('سفارش یافت نشد.');
  }
  if (order.isPaid) {
    res.status(400);
    throw new Error('این سفارش قبلاً پرداخت شده است.');
  }

  const setting = await Setting.findOne();
  if (!setting || setting.paymentGatewayProvider !== 'digipay') {
    res.status(400);
    throw new Error('درگاه دیجی‌پی در تنظیمات فروشگاه فعال نیست.');
  }

  try {
    const { token, baseUrl } = await getDigipayAccessToken(setting);

    // ساخت آدرس بازگشت دقیق بر اساس دامنه سایت
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host');
    const callbackUrl = `${protocol}://${host}/api/payment/digipay/callback?orderId=${order._id}`;

    // تبدیل تومان به ریال برای شاپرک/دیجی‌پی
    const amountInRials = Math.round(Number(order.totalPrice) * 10);
    const providerId = `${order.invoiceNumber || order._id.toString().slice(-8)}-${Date.now().toString().slice(-4)}`;

    const payload = {
      amount: amountInRials,
      cellNumber: order.shippingAddress?.phone || '',
      providerId,
      callbackUrl,
      basketDetailsDto: {
        items: order.orderItems.map((item, idx) => ({
          sellerId: 'team9',
          supplierId: 'team9',
          productCode: String(item.product || idx + 1),
          brand: 'Team9',
          productType: 1,
          count: Number(item.qty) || 1,
          categoryId: 'supplements',
        })),
        basketId: String(order._id),
      },
    };

    const { data } = await axios.post(`${baseUrl}/tickets/business?type=11`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Agent: 'WEB',
      },
      timeout: 15000,
    });

    if (data && data.redirectUrl) {
      // ذخیره موقت شماره تیکت در سفارش
      order.paymentResult = {
        id: data.ticket || providerId,
        status: 'PENDING_DIGIPAY',
        update_time: new Date().toISOString(),
      };
      await order.save();

      return res.json({ redirectUrl: data.redirectUrl, ticket: data.ticket });
    } else {
      throw new Error(data?.result?.message || 'پاسخ نامعتبر از درگاه دیجی‌پی');
    }
  } catch (error) {
    const apiMsg =
      error.response?.data?.result?.message ||
      error.response?.data?.error_description ||
      error.message ||
      'خطا در اتصال به درگاه دیجی‌پی';
    res.status(400);
    throw new Error(apiMsg);
  }
});

// @desc    بازگشت از درگاه دیجی‌پی و تایید نهایی (Verify)
// @route   GET & POST /api/payment/digipay/callback
export const verifyDigipayCallback = asyncHandler(async (req, res) => {
  const params = { ...req.query, ...req.body };
  const { orderId, trackingCode, providerId, result } = params;

  const clientFailUrl = orderId ? `/payment/${orderId}?status=failed` : '/cart';

  if (!orderId) {
    return res.redirect(clientFailUrl);
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.redirect('/cart');
  }

  // اگر قبلاً تایید شده، مستقیم به صفحه فاکتور برود
  if (order.isPaid) {
    return res.redirect(`/order/${order._id}/success`);
  }

  // بررسی وضعیت اولیه بازگشت از بانک
  if (result && String(result).toUpperCase() !== 'SUCCESS' && String(result) !== '0') {
    return res.redirect(`/payment/${order._id}?status=canceled`);
  }

  if (!trackingCode) {
    return res.redirect(`/payment/${order._id}?status=failed`);
  }

  try {
    const setting = await Setting.findOne();
    const { token, baseUrl } = await getDigipayAccessToken(setting);

    // ارسال درخواست Verify به دیجی‌پی جهت قطعی‌سازی تراکنش
    const { data } = await axios.post(
      `${baseUrl}/purchases/verify/${trackingCode}`,
      {
        trackingCode,
        providerId: providerId || order.invoiceNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Agent: 'WEB',
        },
        timeout: 15000,
      }
    );

    if (data?.result?.status === 0 || String(data?.result?.message).toUpperCase().includes('SUCCESS')) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentMethod = 'درگاه یکپارچه دیجی‌پی';
      order.paymentResult = {
        id: trackingCode,
        status: 'SUCCESS',
        update_time: new Date().toISOString(),
      };
      await order.save();

      return res.redirect(`/order/${order._id}/success`);
    } else {
      return res.redirect(`/payment/${order._id}?status=verify_failed`);
    }
  } catch (error) {
    console.error('DigiPay Verify Error:', error.response?.data || error.message);
    return res.redirect(`/payment/${order._id}?status=error`);
  }
});
