import mongoose from 'mongoose';

const AthleteIntakeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['در انتظار بررسی', 'در حال طراحی برنامه', 'برنامه تحویل داده شد', 'بایگانی'], 
    default: 'در انتظار بررسی' 
  },
  coachNotes: { type: String, default: '' },
  
  // کل ۱۱ بخش فرم به صورت ساختاریافته در دیتابیس
  formData: { type: Object, required: true },
}, { timestamps: true });

export default mongoose.model('AthleteIntake', AthleteIntakeSchema);
