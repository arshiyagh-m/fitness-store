import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, default: '' },
  description: { type: String, required: true },
  images: [{ type: String }],
  
  attributes: {
    country: { type: String, default: 'آمریکا' },
    targetGoal: { type: String, default: 'عضله‌سازی و ریکاوری' },
    form: { type: String, default: 'پودر' },
    servingSize: { type: String, default: '30 گرم' },
    servingsPerContainer: { type: Number, default: 60 },
    usageGuide: { type: String, default: '' },
  },

  // جدول پویای ارزش غذایی (نام ماده + مقدار در سروینگ + درصد نیاز روزانه)
  nutritionFacts: [{
    ingredient: { type: String, required: true },
    amount: { type: String, required: true },
    dailyValue: { type: String, default: '-' }
  }],

  variants: [{
    sku: String,
    flavor: String,
    weight: String,
    price: Number,
    discountPrice: Number,
    stock: Number,
    sibSalamat: String,
    expiryDate: String, // تاریخ انقضای بچ
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
