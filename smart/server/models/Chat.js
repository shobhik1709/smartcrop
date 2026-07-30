import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender_type: { type: String },
  message: { type: String, required: true },
  profiles: {
    full_name: { type: String }
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model('Chat', chatSchema);
