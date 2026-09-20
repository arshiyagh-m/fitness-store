// filepath: server/src/controllers/productController.js
import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Fetch all products (with advanced filtering)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, brand, minPrice, maxPrice } = req.query;

  // ساخت کوئری فیلتر
  const query = { isActive: true };

  // جستجو در عنوان
  if (keyword) {
    query.title = { $regex: keyword, $options: 'i' };
  }
  if (category) query.category = category;
  if (brand) query.brand = brand;

  // فیلتر بازه قیمت روی متغیرها (Variants)
  if (minPrice || maxPrice) {
    query.variants = { $elemMatch: { price: {} } };
    if (minPrice) query.variants.$elemMatch.price.$gte = Number(minPrice);
    if (maxPrice) query.variants.$elemMatch.price.$lte = Number(maxPrice);
  }

  // دریافت محصولات و مرتب‌سازی بر اساس جدیدترین
  const products = await Product.find(query).sort({ createdAt: -1 });
  res.json(products);
});

// @desc    Fetch single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
  
  const product = isObjectId 
    ? await Product.findById(req.params.id)
    : await Product.findOne({ slug: req.params.id });

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('محصول یافت نشد');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product(req.body);
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'محصول با موفقیت حذف شد' });
  } else {
    res.status(404);
    throw new Error('محصول یافت نشد');
  }
});
