// filepath: server/src/models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    category: {
      type: String,
      enum: ['whey', 'creatine', 'gainer', 'amino', 'pre-workout', 'fat-burner', 'vitamins'],
      required: true,
    },
    description: { type: String, required: true },
    images: [{ type: String }],
    attributes: {
      form: { type: String, enum: ['powder', 'pill', 'liquid', 'bar'], default: 'powder' },
      servingSize: { type: String },
      servingsPerContainer: { type: Number },
    },
    nutritionFacts: [
      { ingredient: { type: String }, amount: { type: String }, dailyValue: { type: String } }
    ],
    variants: [
      {
        sku: { type: String, required: true, unique: true },
        flavor: { type: String },
        weight: { type: String },
        price: { type: Number, required: true },
        discountPrice: { type: Number },
        stock: { type: Number, required: true, default: 0 },
        authenticity: {
          batchNumber: { type: String },
          expiryDate: { type: Date },
          sibSalamat: { type: String },
        }
      }
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);
export default Product;
