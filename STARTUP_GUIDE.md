# 🎂 Birthday Surprise App - Startup & Deployment Guide

This guide explains how to run, test, and deploy both the **Frontend (HTML/JS/CSS)** website and the **Backend (Node.js/Express/MongoDB)** tracking system.

---

## 💻 Local Development & Testing

### 1. Start the Backend Server
The backend stores responses (e.g., when she clicks "Yes!") and page visit logs in your MongoDB Atlas database.

1. Open your terminal.
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Install dependencies (only required the first time):
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *You should see:* `🚀 Server running on port 3000` and `✅ Connected to MongoDB`

---

### 2. Start the Frontend Website
Since the frontend consists of static HTML, CSS, and JS files, you can open them directly.

#### Option A: Direct Open (Simplest)
- Go to the project folder on your computer.
- Double-click **`index.html`** to open it directly in your browser.

#### Option B: Live Server (Recommended)
If you use VS Code, install the **Live Server** extension:
1. Open the project folder in VS Code.
2. Click the **"Go Live"** button in the bottom-right status bar.
3. It will host the frontend at `http://127.0.0.1:5500`.

---

### 3. Open the Admin Panel
To see her responses in real-time:
1. Double-click **`admin.html`** in your project folder.
2. Fill in:
   - **Backend API URL**: `http://localhost:3000`
   - **Admin Secret Key**: `kabir_admin_2026`
3. Click **View Responses**.

---

## 🌐 Production Deployment (Going Live)

When you are ready for Prajkta to view the site, you need to deploy both parts online.

### Step 1: Deploy Backend to Render (Free)
1. Sign up on **[Render.com](https://render.com/)** using your GitHub account.
2. Click **New +** → **Web Service**.
3. Link your GitHub repository (`impressingCrush`).
4. Set the configuration details:
   - **Name**: `birthday-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **Advanced** and add these Environment Variables:
   - `MONGODB_URI` = `mongodb+srv://kabirmore8904_db_user:kabir8904@birthdaycluster0.f0ykhb8.mongodb.net/birthdayApp?retryWrites=true&w=majority&appName=BirthdayCluster0`
   - `ADMIN_SECRET` = `kabir_admin_2026`
6. Click **Deploy Web Service** and wait for it to build. Copy the service URL (e.g., `https://birthday-backend-xxxx.onrender.com`).

---

### Step 2: Link Frontend to Render Backend
1. Open **`tracker.js`** in your editor.
2. Replace the URL on line 3 with your deployed Render backend URL:
   ```javascript
   const DEFAULT_BACKEND_URL = 'https://birthday-backend-xxxx.onrender.com';
   ```
3. Commit and push the changes to GitHub:
   ```bash
   git add tracker.js
   git commit -m "Update API URL for production"
   git push origin main
   ```

---

### Step 3: Deploy Frontend to GitHub Pages (Free)
1. Go to your repository on GitHub: `https://github.com/developerrahulofficial/impressingCrush`.
2. Go to **Settings** → **Pages** (in the left menu).
3. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Click **Save**.
5. Wait ~1 minute. Your site will be live at:
   `https://developerrahulofficial.github.io/impressingCrush/`
