# Vision Human Value

Real-time computer vision tracking in your browser. Track body pose, hand movements, and facial features using MediaPipe and WebGL - all running locally with no data sent to any server.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- **👋 Hand Tracking** - Track up to 2 hands with 21 landmarks each, including fingertip detection
- **🧍 Body Pose** - Full body skeleton tracking with 33 landmarks
- **😊 Face Detection** - Facial mesh tracking with 478 landmarks
- **🎨 Real-time Visualization** - Live overlay of tracking data on video feed
- **🔒 Privacy-First** - All processing happens in your browser, no data sent to servers
- **⚡ High Performance** - Optimized for 30+ FPS on modern desktops
- **🎯 Easy to Use** - Just open the URL and allow camera access

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vision-humanvalue.git
   cd vision-humanvalue
   ```

2. **Start a local server**
   ```bash
   # Using Python 3
   python3 -m http.server 8000

   # OR using Node.js http-server
   npx http-server -p 8000

   # OR using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

4. **Allow camera access** when prompted

5. **Click "Enter Experience"** to start tracking

### Requirements

- Modern web browser (Chrome 90+, Edge 90+, Firefox 88+, Safari 15+)
- Webcam
- HTTPS or localhost (required for camera access)
- Decent CPU/GPU (for real-time processing)

## 📁 Project Structure

```
vision-humanvalue/
├── index.html          # Landing page
├── app.html            # Main application
├── css/
│   └── style.css       # Styling
├── js/
│   ├── main.js         # Application controller
│   ├── camera.js       # Camera handling
│   ├── hands.js        # Hand tracking module
│   ├── pose.js         # Pose tracking module
│   └── face.js         # Face detection module
├── package.json        # Project metadata
├── vercel.json         # Vercel deployment config
└── README.md           # This file
```

## 🎮 Controls

**In-app Controls:**
- **👋 Hands Button** - Toggle hand tracking on/off
- **🧍 Pose Button** - Toggle pose tracking on/off
- **😊 Face Button** - Toggle face detection on/off
- **❌ Exit Button** - Return to landing page

**Status Display:**
- **FPS** - Current frames per second
- **Hands** - Number of hands detected
- **Pose** - Body pose detection status
- **Face** - Number of faces detected

## 🌐 Deploy to Vercel

### Method 1: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd vision-humanvalue
   vercel
   ```

3. **Follow prompts** and your app will be live!

### Method 2: GitHub Integration

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/vision-humanvalue.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Done!** Your app is now live at `your-project.vercel.app`

### Method 3: Drag & Drop

1. Go to [vercel.com](https://vercel.com)
2. Drag and drop the entire `vision-humanvalue` folder
3. Wait for deployment to complete
4. Your app is live!

## 🔧 Technology Stack

### Core Technologies
- **Vanilla JavaScript** - No framework dependencies
- **MediaPipe Tasks Vision** - Computer vision models
- **WebGL** - GPU-accelerated processing
- **HTML5 Canvas** - Real-time rendering

### MediaPipe Models
- **HandLandmarker** - 21-point hand tracking
- **PoseLandmarker** - 33-point body pose
- **FaceLandmarker** - 478-point face mesh

### Hosting
- **Vercel** - Recommended (automatic HTTPS, fast CDN)
- **Netlify** - Alternative option
- **GitHub Pages** - Free static hosting
- **Any static host** - Works anywhere!

## 📊 Performance

**Typical Performance (Desktop):**
- Resolution: 1280x720
- FPS: 30-60
- Latency: < 100ms
- CPU Usage: 20-40%
- Memory: ~200MB

**Optimization Tips:**
- Close other tabs to free up resources
- Use Chrome or Edge for best performance
- Ensure good lighting for better detection
- Keep full body visible for pose tracking

## 🐛 Troubleshooting

### Camera Not Working

**Error: "Camera access denied"**
- Click the camera icon in browser address bar
- Select "Always allow" for this site
- Reload the page

**Error: "No camera found"**
- Check if your webcam is connected
- Try a different browser
- Close other apps using the camera

**Error: "Camera already in use"**
- Close other tabs using the camera
- Close Zoom, Skype, etc.
- Restart your browser

### Performance Issues

**Low FPS (< 15)**
- Close other browser tabs
- Try a lower camera resolution
- Disable features you don't need
- Use Chrome for best performance

**Tracking Not Working**
- Ensure good lighting
- Position yourself correctly:
  - Hands: Clearly visible in frame
  - Pose: Full body visible
  - Face: Looking at camera
- Move slower for better tracking

### Browser Compatibility

**Safari Issues**
- Must use Safari 15+ for full support
- Camera permissions are stricter
- May need to enable WebGL

**Firefox Issues**
- Generally works well
- Slightly slower than Chrome
- Enable hardware acceleration for better performance

## 🔒 Privacy & Security

- **No data collection** - Nothing is sent to any server
- **No analytics** - No tracking or telemetry
- **No storage** - No data saved locally
- **Camera-only** - Only requires camera permission
- **Open source** - Code is fully transparent

All processing happens locally in your browser using MediaPipe's WebAssembly models.

## 📝 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **MediaPipe** - Google's ML framework
- **Intel RealSense** - Original inspiration from RealSense project
- **OpenCV** - Computer vision concepts

## 📧 Contact

For questions or feedback:
- GitHub Issues: [Create an issue](https://github.com/yourusername/vision-humanvalue/issues)
- Email: your.email@example.com

---

**Made with ❤️ using MediaPipe and Web Technologies**
