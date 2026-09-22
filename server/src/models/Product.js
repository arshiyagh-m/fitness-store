import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  
  // دسته‌بندی مادر و زیردسته تخصصی
  category: { type: String, required: true }, // دسته مادر
  subcategory: { type: String, default: '' }, // زیردسته دقیق
  
  description: { type: String, required: true },
  images: [{ type: String }],
  
  attributes: {
    country: { type: String, default: 'آمریکا' },
    targetGoal: { type: String, default: 'عضله‌سازی' },
    form: { type: String, default: 'پودر' },
    servingSize: { type: String, default: '30 گرم' },
    servingsPerContainer: { type: Number, default: 60 },
  },

  nutritionFacts: {
    protein: { type: String, default: '0' },
    bcaa: { type: String, default: '0' },
    calories: { type: String, default: '0' },
    carbs: { type: String, default: '0' },
    sugar: { type: String, default: '0' },
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
