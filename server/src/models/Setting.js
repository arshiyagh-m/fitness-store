import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  paymentGatewayProvider: { type: String, default: 'simulator' },
  digipayUsername: { type: String, default: '' },
  digipayClientId: { type: String, default: '' },
  digipayClientSecret: { type: String, default: '' },
  digipayPassword: { type: String, default: '' },
  zarinpalMerchantId: { type: String, default: '' },
  smsProvider: { type: String, default: 'simulator' },
  smsApiKey: { type: String, default: '' },
  smsSenderNumber: { type: String, default: '1000888' },
  shippingPostPrice: { type: Number, default: 55000 },
  shippingTipaxPrice: { type: Number, default: 85000 },
  shippingMahexPrice: { type: Number, default: 95000 },
  freeShippingThreshold: { type: Number, default: 1500000 },
  siteName: { type: String, default: 'Team 9' },
  siteSlogan: { type: String, default: 'مرجع تخصصی مکمل‌های اورجینال و دارویی' },
  theme: { type: String, default: 'default' },
  bannerTitle: { type: String, default: 'سوختِ عضلات خود را تامین کنید.' },
  bannerSubtitle: { type: String, default: 'کالکشن جدید ۲۰۲۴' },
  bannerActive: { type: Boolean, default: true },
  announcementText: { type: String, default: 'ارسال با پست پیشتاز، تیپاکس و ماهکس' },
  announcementActive: { type: Boolean, default: true },
  phoneSupport: { type: String, default: '021-12345678' },
  phoneMobile: { type: String, default: '09120000000' },
  emailOfficial: { type: String, default: 'support@team9.ir' },
  officeAddress: { type: String, default: 'تهران، خیابان ولیعصر، برج ورزشی، طبقه ۵' },
  instagramId: { type: String, default: 'team9_store' },
  telegramChannel: { type: String, default: 'team9_supplements' },
  workingHours: { type: String, default: 'شنبه تا پنج‌شنبه ۹ الی ۲۱' },
}, { timestamps: true });

export default mongoose.model('Setting', SettingSchema);
