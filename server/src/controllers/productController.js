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

export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) { res.status(400); throw new Error('شما قبلاً برای این محصول نظر ثبت کرده‌اید'); }

    const review = { name: req.user.name, rating: Number(rating), comment, user: req.user._id };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'نظر با موفقیت ثبت شد' });
  } else { res.status(404); throw new Error('محصول یافت نشد'); }
});
