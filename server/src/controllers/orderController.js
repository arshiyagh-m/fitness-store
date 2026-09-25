import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendAutomatedSMS } from '../utils/smsService.js';

export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, courierCompany, shippingPrice, totalPrice } = req.body;
  
  if (orderItems && orderItems.length === 0) {
    res.status(400); throw new Error('سبد خرید خالی است');
  }

  // تولید شماره فاکتور رسمی اختصاصی (مثال: INV-1403-84920)
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const order = new Order({ 
    user: req.user._id, 
    invoiceNumber,
    orderItems, 
    shippingAddress, 
    paymentMethod,
    courierCompany: courierCompany || 'پست پیشتاز',
    shippingPrice: Number(shippingPrice) || 0,
    totalPrice: Number(totalPrice)
  });
  
  const createdOrder = await order.save();

  // ارسال پیامک ثبت سفارش با ذکر شماره فاکتور
  sendAutomatedSMS({
    phone: shippingAddress.phone,
    message: `ورزشکار گرامی، سفارش شما با شماره فاکتور رسمی ${invoiceNumber} در Team 9 ثبت شد و به زودی تحویل ${order.courierCompany} می‌گردد.`
  });

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

    const updatedOrder = await order.save();

    if (req.body.postalTrackingCode) {
      sendAutomatedSMS({
        phone: order.shippingAddress.phone,
        message: `سفارش فاکتور #${order.invoiceNumber || order._id.substring(18)} تحویل ${order.courierCompany} گردید.\nکد رهگیری پستی:\n${req.body.postalTrackingCode}\nفروشگاه Team 9`
      });
    }

    res.json(updatedOrder);
  } else {
    res.status(404); throw new Error('سفارش یافت نشد');
  }
});
