import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['خرید مکمل و بار انبار', 'تبلیغات و اسپانسرینگ', 'لجستیک و بسته‌بندی', 'حقوق و دستمزد', 'اجاره و قبوض', 'سایر هزینه‌ها'] 
  },
  amount: { type: Number, required: true },
  note: { type: String, default: '' },
  recordedBy: { type: String, default: 'مدیر مالی' },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Expense', ExpenseSchema);
