# impressingCrush
This is a beautiful interactive birthday website with a password protection screen and a multi-step questionnaire that logs responses to MongoDB.

## Getting Started

1. **Prerequisites**: Ensure you have Node.js and MongoDB installed/running on your machine.
2. **Configuration**: You can configure your port or MongoDB connection string inside the [.env](file:///Users/kabirmore/Birthday/impressingCrush/.env) file:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/impressingCrush
   ```
3. **Start the Server**:
   ```bash
   npm start
   ```
4. **Access the Page**: Open `http://localhost:3000` in your web browser.

Once your crush answers the questions, their responses will automatically be saved to your local MongoDB database (or Atlas if configured in `.env`).

---
Thanks and Happy Coding.

