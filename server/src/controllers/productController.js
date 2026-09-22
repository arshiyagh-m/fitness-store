import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
  const product = isObjectId ? await Product.findById(req.params.id) : await Product.findOne({ slug: req.params.id });
  if (product) res.json(product);
  else { res.status(404); throw new Error('محصول یافت نشد'); }
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product(req.body);
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.title = req.body.title || product.title;
    product.slug = req.body.slug || product.slug;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.description = req.body.description || product.description;
    product.images = req.body.images || product.images;
    product.attributes = req.body.attributes || product.attributes;
    product.nutritionFacts = req.body.nutritionFacts || product.nutritionFacts;
    if (req.body.variants) product.variants = req.body.variants;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404); throw new Error('محصول یافت نشد');
  }
});

// ویرایش سریع موجودی یک SKU خاص در انبار
export const updateStockQuick = asyncHandler(async (req, res) => {
  const { productId, sku, newStock } = req.body;
  const product = await Product.findById(productId);
  if (product) {
    const variant = product.variants.find(v => v.sku === sku);
    if (variant) {
      variant.stock = Number(newStock);
      await product.save();
      res.json({ message: 'موجودی انبار با موفقیت بروز شد', sku, newStock });
    } else {
      res.status(404); throw new Error('تنوع کالایی یافت نشد');
    }
  } else {
    res.status(404); throw new Error('محصول یافت نشد');
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'محصول حذف شد' });
  } else {
    res.status(404); throw new Error('محصول یافت نشد');
  }
});

export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) { res.status(400); throw new Error('شما قبلاً نظر داده‌اید'); }
    product.reviews.push({ name: req.user.name, rating: Number(rating), comment, user: req.user._id });
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'نظر ثبت شد' });
  } else {
    res.status(404); throw new Error('محصول یافت نشد');
  }
});
