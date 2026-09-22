import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      variant: { type: Object, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    }
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true, default: 'درگاه بانکی' },
  totalPrice: { type: Number, required: true, default: 0 },
  isPaid: { type: Boolean, required: true, default: false },
  orderStatus: { type: String, required: true, default: 'در حال پردازش' },
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);
export default Order;
