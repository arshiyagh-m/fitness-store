import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  authorName: { type: String, required: true },
  productTitle: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, default: '' },
  answeredBy: { type: String, default: '' }, // نام کارشناس/مربی پاسخ‌دهنده
  isAnswered: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Question', QuestionSchema);
