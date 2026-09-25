import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  invoiceNumber: { type: String, unique: true }, // شماره فاکتور رسمی شرکتی
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
  paymentMethod: { type: String, required: true, default: 'درگاه بانکی شاپرک' },
  shippingPrice: { type: Number, required: true, default: 0 }, // هزینه پستی
  totalPrice: { type: Number, required: true, default: 0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  paymentResult: { id: String, status: String, update_time: String },
  orderStatus: { type: String, required: true, default: 'در حال پردازش' },
  postalTrackingCode: { type: String, default: '' },
  courierCompany: { type: String, default: 'پست پیشتاز' },
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
