const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins (update to your deployed frontend URL for production)
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schema & Model
const responseSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  answer: { type: String, default: 'Visited 👀' },
  answerRaw: { type: String, default: 'visited' },
  opinion: { type: String, default: '' },          // Text typed by her about Kabir
  isBestFriend: { type: String, default: '' },     // "Yes! 😍" or "No 😢"
  pagesVisited: { type: [String], default: [] },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const Response = mongoose.model('Response', responseSchema);

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: '🎂 Birthday API is running!' });
});

// POST /api/response — save/update her answer & visits
app.post('/api/response', async (req, res) => {
  try {
    const { sessionId, answer, answerRaw, pageName, opinion, isBestFriend } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    let response = await Response.findOne({ sessionId });

    if (!response) {
      response = new Response({
        sessionId,
        userAgent: req.headers['user-agent'] || 'unknown',
        pagesVisited: []
      });
    }

    if (answer) {
      response.answer = answer;
      response.answerRaw = answerRaw;
    }

    if (opinion) response.opinion = opinion;
    if (isBestFriend) response.isBestFriend = isBestFriend;

    if (pageName && !response.pagesVisited.includes(pageName)) {
      response.pagesVisited.push(pageName);
    }

    response.timestamp = new Date();

    await response.save();
    console.log(`💌 Session ${sessionId} | Answer: ${response.answer} | Opinion: "${response.opinion}" | BestFriend: ${response.isBestFriend}`);

    res.status(200).json({ success: true, message: 'Response saved!' });
  } catch (err) {
    console.error('Error saving response:', err);
    res.status(500).json({ error: 'Failed to save response' });
  }
});

// GET /api/responses — view all responses (protected by secret key)
app.get('/api/responses', async (req, res) => {
  const secret = req.headers['x-admin-secret'] || req.query.secret;

  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const responses = await Response.find().sort({ timestamp: -1 });
    res.json({ total: responses.length, responses });
  } catch (err) {
    console.error('Error fetching responses:', err);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

// DELETE /api/responses — clear all (protected)
app.delete('/api/responses', async (req, res) => {
  const secret = req.headers['x-admin-secret'] || req.query.secret;

  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await Response.deleteMany({});
    res.json({ success: true, message: 'All responses cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear responses' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
