import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

// @desc    ثبت سفارش جدید
// @route   POST /api/orders
// @access  Private (فقط کاربران لاگین شده)
export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('سبد خرید خالی است');
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});
