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
    product.subcategory = req.body.subcategory || product.subcategory;
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

// 🚀 کنترلر افزایش/کاهش درصدی قیمت کلیه محصولات
export const bulkAdjustPrices = asyncHandler(async (req, res) => {
  const { percentage, roundToThousand = true } = req.body;
  const percent = Number(percentage);

  if (isNaN(percent) || percent === 0) {
    res.status(400); throw new Error('درصد تغییر قیمت نامعتبر است');
  }

  const products = await Product.find({ isActive: true });
  let count = 0;

  for (const product of products) {
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(variant => {
        if (variant.price) {
          let newPrice = variant.price * (1 + percent / 100);
          variant.price = roundToThousand ? Math.round(newPrice / 1000) * 1000 : Math.round(newPrice);
        }
        if (variant.discountPrice) {
          let newDisc = variant.discountPrice * (1 + percent / 100);
          variant.discountPrice = roundToThousand ? Math.round(newDisc / 1000) * 1000 : Math.round(newDisc);
        }
      });
      await product.save();
      count++;
    }
  }

  res.json({ message: 'قیمت ' + count + ' محصول با موفقیت ' + percent + ' درصد تغییر یافت.', count });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'محصول با موفقیت حذف شد' });
  } else {
    res.status(404); throw new Error('محصول یافت نشد');
  }
});

export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) { res.status(400); throw new Error('شما قبلاً نظر ثبت کرده‌اید'); }
    product.reviews.push({ name: req.user.name, rating: Number(rating), comment, user: req.user._id });
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'نظر ثبت شد' });
  } else {
    res.status(404); throw new Error('محصول یافت نشد');
  }
});
