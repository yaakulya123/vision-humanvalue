# Surveillance - Human Value

Real-time computer vision tracking system built with MediaPipe and vanilla JavaScript.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Overview

This is a web-based surveillance system that provides real-time tracking of hands, faces, and motion detection directly in the browser. All processing happens client-side using MediaPipe's vision models - no data is transmitted to external servers.

## Features

- **Hand Tracking** - Detect up to 2 hands simultaneously with 21 landmarks per hand
- **Face Detection** - Track up to 5 faces with 478 facial landmarks each
- **Motion Detection** - Frame-by-frame pixel difference analysis with adjustable sensitivity
- **Real-time Visualization** - Live overlay of tracking data on video feed
- **Privacy-First** - All processing happens in your browser, no data sent to servers
- **High Performance** - Optimized for 30+ FPS on modern hardware
- **Easy to Use** - Just open the URL and allow camera access

## Quick Start

### Local Development

1. Clone the repository
   ```bash
   git clone https://github.com/yaakulya123/vision-humanvalue.git
   cd vision-humanvalue
   ```

2. Start a local server
   ```bash
   # Using Python 3
   python3 -m http.server 8000

   # OR using Node.js http-server
   npx http-server -p 8000

   # OR using PHP
   php -S localhost:8000
   ```

3. Open in browser
   ```
   http://localhost:8000
   ```

4. Allow camera access when prompted

5. Click "Enter System" to start tracking

### Requirements

- Modern web browser (Chrome 90+, Edge 90+, Firefox 88+, Safari 15+)
- Webcam
- HTTPS or localhost (required for camera access)
- Decent CPU/GPU (for real-time processing)

## Project Structure

```
vision-humanvalue/
├── index.html          # Landing page
├── app.html            # Main application page
├── css/
│   └── style.css       # Professional black/white theme
├── js/
│   └── main.js         # Main application controller
├── package.json        # Project metadata
├── vercel.json         # Vercel deployment config
└── README.md           # This file
```

## Controls

### In-app Controls
- **Hands Button** - Toggle hand tracking on/off
- **Face Button** - Toggle face detection on/off
- **Motion Button** - Toggle motion detection on/off
- **Exit Button** - Return to landing page

### Status Display
- **FPS** - Current frames per second
- **HANDS_DETECTED** - Number of hands detected (0-2)
- **FACE_COUNT** - Number of faces detected (0-5)
- **MOTION** - Motion detection status (DETECTED/NONE)

## Technology Stack

### Core Technologies
- **Vanilla JavaScript ES6** - No framework dependencies
- **MediaPipe Tasks Vision 0.10.8** - Computer vision models
- **WebGL** - GPU-accelerated processing
- **HTML5 Canvas** - Real-time rendering
- **getUserMedia API** - Camera access

### MediaPipe Models
- **HandLandmarker** - 21-point hand tracking
- **FaceLandmarker** - 478-point face mesh

## Performance

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
- Toggle off features you don't need

## Configuration

You can adjust these values in `main.js`:

```javascript
// Motion detection sensitivity
this.motionThreshold = 30;      // RGB difference threshold (0-255)
this.motionSensitivity = 0.02;  // % of pixels needed (0.0-1.0)

// MediaPipe confidence thresholds
minHandDetectionConfidence: 0.5
minFaceDetectionConfidence: 0.5

// Camera constraints
width: { ideal: 1280 }
height: { ideal: 720 }
frameRate: { ideal: 30 }
```

## Troubleshooting

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
- Toggle off features you don't need
- Use Chrome for best performance
- Check CPU usage in task manager

**Tracking Not Working**
- Ensure good lighting
- Position yourself correctly in frame
- Move slower for better tracking
- Check if feature is toggled on

### Browser Compatibility

**Safari Issues**
- Must use Safari 15+ for full support
- Camera permissions are stricter
- May need to enable WebGL in settings

**Firefox Issues**
- Generally works well
- Slightly slower than Chrome
- Enable hardware acceleration for better performance

## Privacy & Security

- No data collection - Nothing is sent to any server
- No analytics - No tracking or telemetry
- No storage - No data saved locally
- Camera-only - Only requires camera permission
- Open source - Code is fully transparent

All processing happens locally in your browser using MediaPipe's WebAssembly models.

## License

MIT License - See LICENSE file for details

## Acknowledgments

- MediaPipe - Google's ML framework for vision tasks
- Intel RealSense - Original inspiration from RealSense project
- OpenCV - Computer vision concepts

---

Built with MediaPipe and Web Technologies
