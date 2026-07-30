import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  farm_location: { type: String },
  user_type: { type: String, enum: ['farmer', 'agronomist'], default: 'farmer' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
