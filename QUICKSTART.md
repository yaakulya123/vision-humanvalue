# 🚀 Quick Start Guide

## Test Locally (RIGHT NOW!)

1. **Open Terminal** and navigate to project folder:
   ```bash
   cd /Users/yaakulyasabbani/Documents/GitHub/vision-humanvalue
   ```

2. **Start local server**:
   ```bash
   python3 -m http.server 8000
   ```

3. **Open browser** and go to:
   ```
   http://localhost:8000
   ```

4. **Allow camera access** when prompted

5. **Click "Enter Experience"** button

6. **You should see:**
   - Your webcam feed
   - Hand tracking (green/blue lines on hands)
   - Body pose skeleton (green lines)
   - Face mesh (yellow dots)
   - FPS counter in top-left

## Deploy to Vercel (5 minutes!)

### Option 1: Vercel CLI (Fastest)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd /Users/yaakulyasabbani/Documents/GitHub/vision-humanvalue
   vercel
   ```

3. **Follow prompts**:
   - Login/Sign up
   - Select "Yes" to deploy
   - Project name: `vision-humanvalue` (or your choice)
   - Done!

4. **You'll get a URL like**: `https://vision-humanvalue-xyz.vercel.app`

5. **Share that URL** with anyone - they just click and their camera starts tracking!

### Option 2: Vercel Website (No CLI)

1. **Go to**: https://vercel.com

2. **Sign up/Login** (free)

3. **Click "Add New Project"**

4. **Choose**: "Import Git Repository" OR "Deploy from folder"
   - If Git: Connect GitHub and select this repo
   - If Folder: Drag & drop the `vision-humanvalue` folder

5. **Click "Deploy"**

6. **Wait ~30 seconds** for deployment

7. **Get your URL** and share with friends!

## Sharing with Friends

Once deployed, just send them the URL:
```
Hey! Check this out: https://your-app.vercel.app

It will ask for camera access - just click "Allow"
Then click "Enter" and you'll see real-time tracking of your hands, body, and face!
```

## Troubleshooting

**If camera doesn't work:**
- Make sure you're using HTTPS (Vercel does this automatically)
- localhost also works for testing
- Check browser permissions (click lock icon in address bar)

**If models don't load:**
- Check internet connection (models download from CDN)
- Wait 10-20 seconds on first load
- Try refreshing the page

**If tracking is slow:**
- Use Chrome or Edge (fastest)
- Close other tabs
- Click the toggle buttons to disable features you don't need

## What Gets Tracked?

### ✅ Hands (21 landmarks per hand)
- Wrist
- All finger joints
- **Fingertips highlighted in yellow**
- Left/Right hand labels
- Green = Left, Blue = Right

### ✅ Body Pose (33 landmarks)
- Face outline
- Shoulders, elbows, wrists
- Hips, knees, ankles
- Full body skeleton in green
- "Person Detected" label

### ✅ Face (478 landmarks simplified)
- Face oval
- Eyes and eyebrows
- Nose
- Mouth
- Yellow mesh overlay
- "Face Detected" label

## Controls

- **👋 Hands** - Toggle hand tracking
- **🧍 Pose** - Toggle pose tracking
- **😊 Face** - Toggle face detection
- **❌ Exit** - Go back to home page

## Performance

- **30+ FPS** on modern laptops
- **1280x720** camera resolution
- **< 100ms latency**
- All processing in browser (GPU accelerated)

---

**Need help?** Check README.md for detailed documentation!
