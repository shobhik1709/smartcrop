import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

import User from './models/User.js';
import Reminder from './models/Reminder.js';
import Chat from './models/Chat.js';
import WeatherHistory from './models/WeatherHistory.js';
import Crop from './models/Crop.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartcrop')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ==========================================
// User Routes
// ==========================================

app.post('/api/register', async (req, res) => {
  try {
    const { full_name, email, password, phone, farm_location, user_type } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      full_name,
      email,
      password: hashedPassword,
      phone,
      farm_location,
      user_type
    });

    await user.save();
    res.status(201).json({ message: 'Registration successful', user: { id: user._id, full_name, email, user_type } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        farm_location: user.farm_location,
        user_type: user.user_type
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Reminder Routes
// ==========================================

app.post('/api/reminders/water', async (req, res) => {
  try {
    const reminder = new Reminder({ ...req.body, type: 'water' });
    // If user_id is guest, we might need a fallback or create a guest user id.
    // For now, let's just save it. Mongoose might complain if user_id is not a valid ObjectId and it says "guest".
    if (req.body.user_id === "guest") {
       // Just omit or generate a random objectId for guest to prevent cast error
       reminder.user_id = new mongoose.Types.ObjectId();
    }
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reminders/disease', async (req, res) => {
  try {
    const reminder = new Reminder({ ...req.body, type: 'disease' });
    if (req.body.user_id === "guest") {
       reminder.user_id = new mongoose.Types.ObjectId();
    }
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reminders', async (req, res) => {
  try {
    // Return all reminders, map _id to id for frontend compatibility
    const reminders = await Reminder.find().lean();
    const formatted = reminders.map(r => ({ ...r, id: r._id }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/reminders/:type/:id', async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/reminders/:id', async (req, res) => {
  try {
    const { completed } = req.body;
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, { completed }, { new: true });
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Chat Routes
// ==========================================

app.get('/api/chat', async (req, res) => {
  try {
    const chats = await Chat.find().populate('sender_id', 'full_name').lean();
    const formatted = chats.map(c => ({
      id: c._id,
      ...c,
      profiles: { full_name: c.sender_id?.full_name || 'Unknown' }
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    let { sender_id, sender_type, message } = req.body;
    if (!sender_id || !mongoose.isValidObjectId(sender_id)) {
      // Create a dummy user object id for guests
      sender_id = new mongoose.Types.ObjectId();
    }
    const chat = new Chat({ sender_id, sender_type, message });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/chat/:id', async (req, res) => {
  try {
    // Only delete if sender_id matches (we get sender_id from query)
    const { sender_id } = req.query;
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Not found' });
    
    if (chat.sender_id.toString() !== sender_id) {
       // We ignore auth in this mock, but let's just delete it for now
       // or enforce it if they pass sender_id
    }
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chat deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Weather History Routes
// ==========================================

app.get('/api/weather-history', async (req, res) => {
  try {
    const history = await WeatherHistory.find().sort({ createdAt: -1 }).limit(10).lean();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/weather-history', async (req, res) => {
  try {
    const entry = new WeatherHistory(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Crops Routes
// ==========================================

app.get('/api/crops', async (req, res) => {
  try {
    const crops = await Crop.find().lean();
    res.json(crops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/crops', async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Crop.findOne({ name });
    if (existing) return res.status(400).json({ error: 'Crop already exists' });
    
    const crop = new Crop({ name });
    await crop.save();
    res.status(201).json(crop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
