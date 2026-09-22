import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400); throw new Error('سبد خرید خالی است');
  }

  const order = new Order({ 
    user: req.user._id, 
    orderItems, 
    shippingAddress, 
    paymentMethod, 
    totalPrice 
  });
  const createdOrder = await order.save();

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

export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id || `TRX-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'SUCCESS',
      update_time: new Date().toISOString(),
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404); throw new Error('سفارش پیدا نشد');
  }
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name phone').sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name phone');
  if (order) res.json(order);
  else { res.status(404); throw new Error('سفارش یافت نشد'); }
});

// ثبت کد رهگیری پستی و آپدیت لجستیک
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.orderStatus = req.body.status || order.orderStatus;
    if (req.body.postalTrackingCode !== undefined) {
      order.postalTrackingCode = req.body.postalTrackingCode;
    }
    if (req.body.courierCompany) {
      order.courierCompany = req.body.courierCompany;
    }
    if (req.body.status === 'ارسال شده' && !order.shippedAt) {
      order.shippedAt = Date.now();
    }
    if (req.body.status === 'تحویل داده شده' && !order.deliveredAt) {
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404); throw new Error('سفارش یافت نشد');
  }
});
