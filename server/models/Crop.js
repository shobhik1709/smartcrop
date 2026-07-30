import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('Crop', cropSchema);
