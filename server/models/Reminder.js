import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['water', 'disease'], required: true },
  crop: { type: String },
  season: { type: String },
  growthstage: { type: String },
  date: { type: String },
  time: { type: String },
  frequency: { type: String },
  amount: { type: String },
  disease: { type: String },
  treatment: { type: String },
  notes: { type: String },
  weatherconsiderations: { type: String },
  completed: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model('Reminder', reminderSchema);
