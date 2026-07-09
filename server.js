const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/impressingCrush';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Response Schema
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

const Response = mongoose.model('Response', responseSchema);

// API Endpoint to save responses
app.post('/api/response', async (req, res) => {
  try {
    const { sessionId, answer, answerRaw, pageName, opinion, isBestFriend, returnGift } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'sessionId is required.' });
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
    if (returnGift) response.returnGift = returnGift;

    if (pageName && !response.pagesVisited.includes(pageName)) {
      response.pagesVisited.push(pageName);
    }

    response.timestamp = new Date();
    await response.save();
    
    console.log('Saved response to database:', response);
    res.status(200).json({ success: true, message: 'Response saved successfully!' });
  } catch (error) {
    console.error('Error saving response:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Fallback to index.html for undefined routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
