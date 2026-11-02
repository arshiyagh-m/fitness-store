import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, default: '' },
  description: { type: String, default: '' },
  images: [{ type: String }],
  
  attributes: {
    country: { type: String, default: 'آمریکا' },
    targetGoal: { type: String, default: 'عضله‌سازی و ریکاوری' },
    form: { type: String, default: 'پودر' },
    servingSize: { type: String, default: '30 گرم' },
    servingsPerContainer: { type: Number, default: 60 },
    usageGuide: { type: String, default: '' },
  },

  nutritionFacts: [{
    ingredient: { type: String, default: '' },
    amount: { type: String, default: '' },
    dailyValue: { type: String, default: '-' }
  }],

  variants: [{
    sku: { type: String, default: '' },
    flavor: { type: String, default: '' },
    weight: { type: String, default: '' },
    price: { type: Number, required: true, default: 0 },
    discountPrice: { type: Number, default: null },
    stock: { type: Number, required: true, default: 0 },
    sibSalamat: { type: String, default: '' },
    expiryDate: { type: String, default: '' },
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
