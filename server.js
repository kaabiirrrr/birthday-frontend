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
  opinion: { type: String, required: true },
  isBestFriend: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Response = mongoose.model('Response', responseSchema);

// API Endpoint to save responses
app.post('/api/response', async (req, res) => {
  try {
    const { opinion, isBestFriend } = req.body;
    
    if (!opinion || !isBestFriend) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const newResponse = new Response({ opinion, isBestFriend });
    await newResponse.save();
    
    console.log('Saved response to database:', newResponse);
    res.status(201).json({ success: true, message: 'Response saved successfully!' });
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
