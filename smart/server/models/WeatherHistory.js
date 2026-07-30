import mongoose from 'mongoose';

const weatherHistorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  city: { type: String, required: true },
  soil_type: { type: String },
  water_availability: { type: String },
  temperature: { type: Number },
  humidity: { type: Number },
  suggested_crops: [{ type: String }],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model('WeatherHistory', weatherHistorySchema);
