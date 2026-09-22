import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }], // آرایه چند تصویری
  
  // مشخصات تخصصی فیتنس
  attributes: {
    country: { type: String, default: 'آمریکا' }, // کشور سازنده
    targetGoal: { type: String, default: 'عضله‌سازی' }, // هدف: عضله‌سازی، حجم، کات، انرژی
    form: { type: String, default: 'پودر' }, // پودر، کپسول، قرص
    servingSize: { type: String, default: '30 گرم' }, // اندازه اسکوپ
    servingsPerContainer: { type: Number, default: 60 }, // تعداد کل سروینگ‌ها
  },

  // مشخصات ارزش غذایی در هر سروینگ
  nutritionFacts: {
    protein: { type: String, default: '0' }, // گرم پروتئین
    bcaa: { type: String, default: '0' }, // گرم BCAA
    calories: { type: String, default: '0' }, // کالری
    carbs: { type: String, default: '0' }, // کربوهیدرات
    sugar: { type: String, default: '0' }, // شکر
  },

  variants: [{
    sku: String,
    flavor: String,
    weight: String,
    price: Number,
    discountPrice: Number,
    stock: Number,
    sibSalamat: String
  }],

  reviews: [{
    name: String,
    rating: Number,
    comment: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  rating: { type: Number, default: 5 },
  numReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);
