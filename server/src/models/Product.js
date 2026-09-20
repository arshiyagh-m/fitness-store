// filepath: server/src/models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // برای URLهای سئو فرندلی
    brand: { type: String, required: true },
    category: {
      type: String,
      enum: ['whey', 'creatine', 'gainer', 'amino', 'pre-workout', 'fat-burner', 'vitamins'],
      required: true,
    },
    description: { type: String, required: true },
    images: [{ type: String }], // مسیر عکس‌ها

    // مشخصات کلی مصرف
    attributes: {
      form: { type: String, enum: ['powder', 'pill', 'liquid', 'bar'], default: 'powder' },
      servingSize: { type: String }, // مثلا: "1 Scoop (30g)"
      servingsPerContainer: { type: Number }, // مثلا: 75 سروینگ
    },

    // جدول ارزش غذایی
    nutritionFacts: [
      {
        ingredient: { type: String }, // مثلا: Protein
        amount: { type: String },     // مثلا: 24g
        dailyValue: { type: String }, // مثلا: 48%
      }
    ],

    // متغیرهای کالا (طعم و وزن) - بخش کلیدی دیجی‌کالا
    variants: [
      {
        sku: { type: String, required: true, unique: true }, // کد اختصاصی انبار
        flavor: { type: String }, // مثلا: شکلات، وانیل
        weight: { type: String }, // مثلا: 2.2kg
        price: { type: Number, required: true },
        discountPrice: { type: Number }, // در صورت داشتن تخفیف
        stock: { type: Number, required: true, default: 0 },
        
        // برچسب‌های اصالت و سلامت
        authenticity: {
          batchNumber: { type: String },
          expiryDate: { type: Date },
          sibSalamat: { type: String }, // کد سیب سلامت
        }
      }
    ],

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', ProductSchema);
export default Product;
