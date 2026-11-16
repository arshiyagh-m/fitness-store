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
  phoneSupport: { type: String, default: '021-12345678' },
  announcementText: { type: String, default: 'ارسال با پست پیشتاز، تیپاکس و ماهکس' },
}, { timestamps: true });

export default mongoose.model('Setting', SettingSchema);
