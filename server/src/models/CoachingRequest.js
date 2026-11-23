import mongoose from 'mongoose';

const coachingRequestSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    goal: { type: String, default: '' },
    formData: { type: mongoose.Schema.Types.Mixed, required: true },
    formattedText: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'contacted'],
      default: 'pending',
    },
    adminNote: { type: String, default: '' },
  },
  { timestamps: true }
);

const CoachingRequest = mongoose.model('CoachingRequest', coachingRequestSchema);
export default CoachingRequest;
