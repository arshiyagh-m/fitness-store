import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// ثبت سفارش جدید (همراه با کم کردن موجودی از انبار)
export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400); throw new Error('سبد خرید خالی است');
  }

  // ایجاد سفارش در دیتابیس
  const order = new Order({ user: req.user._id, orderItems, shippingAddress, paymentMethod, totalPrice });
  const createdOrder = await order.save();

  // کم کردن موجودی از انبار (Transaction ساده)
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      const variantIndex = product.variants.findIndex(v => v.sku === item.variant.sku);
      if (variantIndex !== -1) {
        product.variants[variantIndex].stock -= item.qty;
        await product.save();
      }
    }
  }
  res.status(201).json(createdOrder);
});

// دریافت سفارشات یک مشتری خاص (برای داشبورد پروفایل)
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// دریافت تمام سفارشات (مخصوص ادمین)
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name phone').sort({ createdAt: -1 });
  res.json(orders);
});

// دریافت جزئیات یک سفارش (ادمین)
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name phone');
  if (order) res.json(order);
  else { res.status(404); throw new Error('سفارش یافت نشد'); }
});

// آپدیت وضعیت سفارش توسط ادمین
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.orderStatus = req.body.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else { res.status(404); throw new Error('سفارش یافت نشد'); }
});
