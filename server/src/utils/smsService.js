import axios from 'axios';
import Setting from '../models/Setting.js';

export const sendAutomatedSMS = async ({ phone, message }) => {
  try {
    const setting = await Setting.findOne();

    // اگر کلید وب‌سرویس در ادمین تنظیم نشده بود، شبیه‌سازی کن
    if (!setting || !setting.smsApiKey || setting.smsProvider === 'simulator') {
      console.log('-----------------------------------------');
      console.log(`[شبیه‌ساز پیامک] به شماره: ${phone}`);
      console.log(`متن پیامک: ${message}`);
      console.log('-----------------------------------------');
      return true;
    }

    // اتصال واقعی به کاوه‌نگار بدون نیاز به کدنویسی مجدد
    if (setting.smsProvider === 'kavenegar') {
      const url = `https://api.kavenegar.com/v1/${setting.smsApiKey}/sms/send.json`;
      await axios.post(url, null, {
        params: {
          receptor: phone,
          message: message,
          sender: setting.smsSenderNumber || '1000888'
        }
      });
      console.log(`[SMS Kavenegar] پیامک واقعی به ${phone} ارسال شد.`);
      return true;
    }

    // اتصال واقعی به فراز اس‌ام‌اس / آی‌پی پنل
    if (setting.smsProvider === 'farazsms') {
      const url = 'https://ippanel.com/services.jspd';
      await axios.post(url, {
        uname: setting.smsSenderNumber,
        pass: setting.smsApiKey,
        from: '+983000505',
        message: message,
        to: [phone],
        op: 'send'
      });
      console.log(`[SMS Faraz] پیامک واقعی به ${phone} ارسال شد.`);
      return true;
    }

  } catch (error) {
    console.error('خطا در ارسال پیامک:', error.message);
    return false;
  }
};
