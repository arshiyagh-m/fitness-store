import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  // ۱. برندینگ، بنر و تم زنده
  siteName: { type: String, default: 'Team 9' },
  siteSlogan: { type: String, default: 'بزرگترین مرجع تخصصی مکمل‌های ورزشی اورجینال و فرآورده‌های دارویی' },
  theme: { type: String, default: 'default' },
  bannerTitle: { type: String, default: 'سوختِ عضلات خود را تامین کنید.' },
  bannerSubtitle: { type: String, default: 'کالکشن جدید ۲۰۲۴' },
  bannerActive: { type: Boolean, default: true },
  announcementText: { type: String, default: '🔥 ارسال رایگان کلیه سفارشات بالای ۱.۵ میلیون تومان به سراسر کشور!' },
  announcementActive: { type: Boolean, default: true },

  // ۲. تماس، پشتیبانی و شبکه‌های اجتماعی
  phoneSupport: { type: String, default: '021-12345678' },
  phoneMobile: { type: String, default: '09120000000' },
  emailOfficial: { type: String, default: 'support@team9.ir' },
  officeAddress: { type: String, default: 'تهران، خیابان ولیعصر، برج ورزشی، طبقه ۵' },
  instagramId: { type: String, default: 'team9_store' },
  telegramChannel: { type: String, default: 'team9_supplements' },
  workingHours: { type: String, default: 'شنبه تا پنج‌شنبه ۹ الی ۲۱' },

  // ۳. تعرفه‌های حمل‌ونقل و لجستیک
  shippingPostPrice: { type: Number, default: 55000 },
  shippingTipaxPrice: { type: Number, default: 85000 },
  shippingMahexPrice: { type: Number, default: 95000 },
  freeShippingThreshold: { type: Number, default: 1500000 },

  // ۴. درگاه بانکی شاپرک و وب‌سرویس پیامک
  paymentGatewayProvider: { type: String, default: 'simulator' },
  zarinpalMerchantId: { type: String, default: '' },
  zarinpalSandbox: { type: Boolean, default: false },
  smsProvider: { type: String, default: 'simulator' },
  smsApiKey: { type: String, default: '' },
  smsSenderNumber: { type: String, default: '1000888' },
}, { timestamps: true });

export default mongoose.model('Setting', SettingSchema);
