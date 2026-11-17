import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Setting from '../models/Setting.js';
import { sendAutomatedSMS } from '../utils/smsService.js';
import { createDigipayTicket, verifyDigipayPayment } from '../utils/digipayService.js';

export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, shippingNotes, paymentMethod, courierCompany, shippingPrice, totalPrice } = req.body;
  if (orderItems && orderItems.length === 0) { res.status(400); throw new Error('سبد خالی است'); }
  const invoiceNumber = 'INV-' + Date.now().toString().slice(-6) + '-' + Math.floor(100 + Math.random() * 900);
  const order = new Order({ 
    user: req.user._id, invoiceNumber, orderItems, shippingAddress, 
    shippingNotes: shippingNotes || '', paymentMethod: paymentMethod || 'دیجی‌پی', 
    courierCompany: courierCompany || 'پست پیشتاز', shippingPrice: Number(shippingPrice) || 0, totalPrice: Number(totalPrice) 
  });
  const createdOrder = await order.save();
  for (const item of orderItems) {
    const p = await Product.findById(item.product);
    if (p) {
      const idx = p.variants.findIndex(v => v.sku === item.variant.sku);
      if (idx !== -1) { p.variants[idx].stock -= item.qty; await p.save(); }
    }
  }
  res.status(201).json(createdOrder);
});

export const requestPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const setting = await Setting.findOne();
  if (setting && setting.paymentGatewayProvider === 'digipay' && setting.digipayClientId) {
    try {
      const callbackUrl = 'https://team9.ir/api/orders/digipay/callback?orderId=' + order._id;
      const ticket = await createDigipayTicket({ order, amountInRials: order.totalPrice * 10, callbackUrl });
      return res.json({ paymentUrl: ticket.redirectUrl });
    } catch (err) {
      res.status(400); throw new Error('خطا در دیجی‌پی: ' + err.message);
    }
  }
  res.json({ paymentUrl: '/payment/' + order._id });
});

export const digipayCallback = asyncHandler(async (req, res) => {
  const { orderId, trackingCode } = req.query;
  const order = await Order.findById(orderId);
  if (!order) return res.redirect('/cart');
  try {
    if (trackingCode) {
      await verifyDigipayPayment(trackingCode);
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = { id: trackingCode, status: 'SUCCESS' };
      await order.save();
      return res.redirect('/order/' + order._id + '/success');
    }
    res.redirect('/payment/' + order._id);
  } catch (err) {
    res.redirect('/order/' + order._id + '/success');
  }
});

export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  order.isPaid = true; order.paidAt = Date.now();
  order.paymentResult = { id: req.body.id || ('TRX-' + Date.now()), status: 'SUCCESS' };
  res.json(await order.save());
});
export const getMyOrders = asyncHandler(async (req, res) => {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
});
export const getOrders = asyncHandler(async (req, res) => {
  res.json(await Order.find({}).populate('user', 'name phone').sort({ createdAt: -1 }));
});
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name phone');
  res.json(order);
});
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  order.orderStatus = req.body.status || order.orderStatus;
  if (req.body.postalTrackingCode !== undefined) order.postalTrackingCode = req.body.postalTrackingCode;
  if (req.body.courierCompany) order.courierCompany = req.body.courierCompany;
  res.json(await order.save());
});
