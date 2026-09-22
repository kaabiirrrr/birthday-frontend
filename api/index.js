const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-secret']
}));
app.use(express.json());

// Serverless MongoDB connection caching
let isConnected = false;
async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://kabirmore8904_db_user:kabir8904@birthdaycluster0.f0ykhb8.mongodb.net/birthdayApp?retryWrites=true&w=majority&appName=BirthdayCluster0';
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  isConnected = true;
}

// Middleware to ensure DB connection for API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB connection error in serverless:', err);
    res.status(500).json({ error: 'Database connection failed: ' + err.message });
  }
});

// Schema & Model
const responseSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  answer: { type: String, default: 'Visited 👀' },
  answerRaw: { type: String, default: 'visited' },
  opinion: { type: String, default: '' },
  isBestFriend: { type: String, default: '' },
  returnGift: { type: String, default: '' },
  pagesVisited: { type: [String], default: [] },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const Response = mongoose.models.Response || mongoose.model('Response', responseSchema);

app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: '🎂 Birthday API running on Vercel!' });
});

app.post('/api/response', async (req, res) => {
  try {
    const { sessionId, answer, answerRaw, pageName, opinion, isBestFriend, returnGift } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });

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
    if (returnGift) response.returnGift = returnGift;

    if (pageName && !response.pagesVisited.includes(pageName)) {
      response.pagesVisited.push(pageName);
    }

    response.timestamp = new Date();
    await response.save();
    res.status(200).json({ success: true, message: 'Response saved!' });
  } catch (err) {
    console.error('Error saving response:', err);
    res.status(500).json({ error: 'Failed to save response' });
  }
});

app.get('/api/responses', async (req, res) => {
  const secret = req.headers['x-admin-secret'] || req.query.secret;
  const adminSecret = process.env.ADMIN_SECRET || 'kabir_admin_2026';
  if (secret !== adminSecret) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const responses = await Response.find().sort({ timestamp: -1 });
    res.json({ total: responses.length, responses });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

app.delete('/api/responses', async (req, res) => {
  const secret = req.headers['x-admin-secret'] || req.query.secret;
  const adminSecret = process.env.ADMIN_SECRET || 'kabir_admin_2026';
  if (secret !== adminSecret) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await Response.deleteMany({});
    res.json({ success: true, message: 'All responses cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear responses' });
  }
});

module.exports = app;
