/**
 * Main Application Controller - Version 2
 * Uses proper MediaPipe ES6 module imports
 */

// MediaPipe imports
import { FilesetResolver, HandLandmarker, PoseLandmarker, FaceLandmarker } from
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/vision_bundle.mjs';

class VisionApp {
    constructor() {
        // Trackers
        this.handLandmarker = null;
        this.poseLandmarker = null;
        this.faceLandmarker = null;

        // UI elements
        this.video = null;
        this.canvas = null;
        this.ctx = null;

        // State
        this.isRunning = false;
        this.animationId = null;
        this.lastTimestamp = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;

        // Feature toggles
        this.handsEnabled = true;
        this.poseEnabled = true;
        this.faceEnabled = true;

        // Bind methods
        this.processFrame = this.processFrame.bind(this);
    }

    /**
     * Initialize application
     */
    async initialize() {
        try {
            this.updateLoadingStatus('Requesting camera access...');

            // Get DOM elements
            this.video = document.getElementById('webcam');
            this.canvas = document.getElementById('outputCanvas');
            this.ctx = this.canvas.getContext('2d');

            // Initialize camera first
            await this.initializeCamera();

            // Initialize MediaPipe models
            this.updateLoadingStatus('Loading MediaPipe models...');

            const filesetResolver = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
            );

            this.updateLoadingStatus('Loading hand tracking model...');
            this.handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numHands: 2,
                minHandDetectionConfidence: 0.5,
                minHandPresenceConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            this.updateLoadingStatus('Loading pose tracking model...');
            this.poseLandmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                minPoseDetectionConfidence: 0.5,
                minPosePresenceConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            this.updateLoadingStatus('Loading face detection model...');
            this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numFaces: 5,
                minFaceDetectionConfidence: 0.5,
                minFacePresenceConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            // Setup canvas
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;

            // Setup UI
            this.setupEventListeners();

            // Hide loading, show app
            document.getElementById('loadingScreen').style.display = 'none';
            document.getElementById('appContainer').style.display = 'block';

            // Start processing
            this.isRunning = true;
            this.lastFpsUpdate = performance.now();
            this.processFrame();

            console.log('✓ Application initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError(error.message);
        }
    }

    /**
     * Initialize camera
     */
    async initializeCamera() {
        try {
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 },
                    facingMode: 'user'
                },
                audio: false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = stream;

            await new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    this.video.play();
                    resolve();
                };
            });

            console.log('✓ Camera initialized:', this.video.videoWidth, 'x', this.video.videoHeight);
        } catch (error) {
            throw new Error('Camera access denied or not available');
        }
    }

    /**
     * Main processing loop
     */
    processFrame() {
        if (!this.isRunning) return;

        const currentTime = performance.now();

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let handsCount = 0;
        let poseDetected = false;
        let facesCount = 0;

        if (this.video.readyState === 4) {
            // Hand tracking
            if (this.handsEnabled && this.handLandmarker) {
                try {
                    const handResults = this.handLandmarker.detectForVideo(this.video, currentTime);
                    handsCount = this.drawHands(handResults);
                } catch (e) {
                    console.warn('Hand detection error:', e);
                }
            }

            // Pose tracking
            if (this.poseEnabled && this.poseLandmarker) {
                try {
                    const poseResults = this.poseLandmarker.detectForVideo(this.video, currentTime);
                    poseDetected = this.drawPose(poseResults);
                } catch (e) {
                    console.warn('Pose detection error:', e);
                }
            }

            // Face detection
            if (this.faceEnabled && this.faceLandmarker) {
                try {
                    const faceResults = this.faceLandmarker.detectForVideo(this.video, currentTime);
                    facesCount = this.drawFaces(faceResults);
                } catch (e) {
                    console.warn('Face detection error:', e);
                }
            }
        }

        // Update UI
        this.updateStatus(handsCount, poseDetected, facesCount);

        // Calculate FPS
        this.frameCount++;
        if (currentTime - this.lastFpsUpdate > 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
            document.getElementById('fpsCounter').textContent = this.fps;
        }

        // Continue loop
        this.animationId = requestAnimationFrame(this.processFrame);
    }

    /**
     * Draw hands
     */
    drawHands(results) {
        if (!results || !results.landmarks || results.landmarks.length === 0) {
            return 0;
        }

        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [0, 5], [5, 6], [6, 7], [7, 8],
            [0, 9], [9, 10], [10, 11], [11, 12],
            [0, 13], [13, 14], [14, 15], [15, 16],
            [0, 17], [17, 18], [18, 19], [19, 20],
            [5, 9], [9, 13], [13, 17]
        ];

        results.landmarks.forEach((landmarks, handIndex) => {
            const handedness = results.handednesses[handIndex][0].categoryName;
            const color = handedness === 'Left' ? '#00ff00' : '#0088ff';

            // Draw connections
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 2;

            connections.forEach(([start, end]) => {
                const startPoint = landmarks[start];
                const endPoint = landmarks[end];

                this.ctx.beginPath();
                this.ctx.moveTo(startPoint.x * this.canvas.width, startPoint.y * this.canvas.height);
                this.ctx.lineTo(endPoint.x * this.canvas.width, endPoint.y * this.canvas.height);
                this.ctx.stroke();
            });

            // Draw landmarks
            landmarks.forEach((landmark, index) => {
                const x = landmark.x * this.canvas.width;
                const y = landmark.y * this.canvas.height;

                const isFingertip = [4, 8, 12, 16, 20].includes(index);
                const radius = isFingertip ? 6 : 4;

                this.ctx.fillStyle = isFingertip ? '#ffff00' : color;
                this.ctx.beginPath();
                this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
                this.ctx.fill();

                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            });

            // Draw label
            const wrist = landmarks[0];
            const labelX = wrist.x * this.canvas.width;
            const labelY = wrist.y * this.canvas.height - 15;

            this.ctx.fillStyle = color;
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillText(`${handedness} Hand`, labelX, labelY);
        });

        return results.landmarks.length;
    }

    /**
     * Draw pose
     */
    drawPose(results) {
        if (!results || !results.landmarks || results.landmarks.length === 0) {
            return false;
        }

        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8],
            [9, 10], [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
            [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [11, 23], [12, 24],
            [23, 24],
            [23, 25], [25, 27], [27, 29], [29, 31], [27, 31],
            [24, 26], [26, 28], [28, 30], [28, 32], [30, 32]
        ];

        const landmarks = results.landmarks[0];

        // Draw connections
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 3;

        connections.forEach(([start, end]) => {
            const startPoint = landmarks[start];
            const endPoint = landmarks[end];

            if (startPoint.visibility > 0.5 && endPoint.visibility > 0.5) {
                this.ctx.beginPath();
                this.ctx.moveTo(startPoint.x * this.canvas.width, startPoint.y * this.canvas.height);
                this.ctx.lineTo(endPoint.x * this.canvas.width, endPoint.y * this.canvas.height);
                this.ctx.stroke();
            }
        });

        // Draw landmarks
        landmarks.forEach((landmark, index) => {
            if (landmark.visibility > 0.5) {
                const x = landmark.x * this.canvas.width;
                const y = landmark.y * this.canvas.height;

                const isKeyPoint = [0, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26].includes(index);
                const radius = isKeyPoint ? 6 : 4;

                this.ctx.fillStyle = '#ff00ff';
                this.ctx.beginPath();
                this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
                this.ctx.fill();

                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        });

        return true;
    }

    /**
     * Draw faces
     */
    drawFaces(results) {
        if (!results || !results.faceLandmarks || results.faceLandmarks.length === 0) {
            return 0;
        }

        const keyLandmarks = [
            10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
            397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
            172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109
        ];

        results.faceLandmarks.forEach((landmarks) => {
            // Draw key landmarks
            this.ctx.fillStyle = '#ffff00';

            keyLandmarks.forEach((index) => {
                const landmark = landmarks[index];
                const x = landmark.x * this.canvas.width;
                const y = landmark.y * this.canvas.height;

                this.ctx.beginPath();
                this.ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
                this.ctx.fill();
            });

            // Draw bounding box
            const xCoords = landmarks.map(lm => lm.x * this.canvas.width);
            const yCoords = landmarks.map(lm => lm.y * this.canvas.height);

            const minX = Math.min(...xCoords);
            const maxX = Math.max(...xCoords);
            const minY = Math.min(...yCoords);
            const maxY = Math.max(...yCoords);

            this.ctx.strokeStyle = '#ffff00';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(minX - 10, minY - 10, maxX - minX + 20, maxY - minY + 20);

            // Label
            this.ctx.fillStyle = '#ffff00';
            this.ctx.font = 'bold 18px Arial';
            this.ctx.fillText('Face Detected', minX, minY - 15);
        });

        return results.faceLandmarks.length;
    }

    /**
     * Update status overlay
     */
    updateStatus(handsCount, poseDetected, facesCount) {
        document.getElementById('handsCount').textContent = handsCount;
        document.getElementById('poseStatus').textContent = poseDetected ? 'ACTIVE' : 'INACTIVE';
        document.getElementById('faceStatus').textContent = facesCount;

        document.getElementById('poseStatus').style.color = poseDetected ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
        document.getElementById('faceStatus').style.color = facesCount > 0 ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        document.getElementById('toggleHands').addEventListener('click', () => {
            this.handsEnabled = !this.handsEnabled;
            document.getElementById('toggleHands').classList.toggle('active', this.handsEnabled);
        });

        document.getElementById('togglePose').addEventListener('click', () => {
            this.poseEnabled = !this.poseEnabled;
            document.getElementById('togglePose').classList.toggle('active', this.poseEnabled);
        });

        document.getElementById('toggleFace').addEventListener('click', () => {
            this.faceEnabled = !this.faceEnabled;
            document.getElementById('toggleFace').classList.toggle('active', this.faceEnabled);
        });

        document.getElementById('exitBtn').addEventListener('click', () => {
            this.shutdown();
            window.location.href = 'index-pro.html';
        });

        window.addEventListener('beforeunload', () => {
            this.shutdown();
        });
    }

    /**
     * Update loading status
     */
    updateLoadingStatus(message) {
        const statusElement = document.getElementById('loadingStatus');
        if (statusElement) {
            statusElement.textContent = message;
        }
        console.log(message);
    }

    /**
     * Show error screen
     */
    showError(message) {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'none';
        document.getElementById('errorScreen').style.display = 'flex';
        document.getElementById('errorMessage').textContent = message;

        document.getElementById('retryBtn').addEventListener('click', () => {
            window.location.reload();
        });

        document.getElementById('backBtn').addEventListener('click', () => {
            window.location.href = 'index-pro.html';
        });
    }

    /**
     * Shutdown and cleanup
     */
    shutdown() {
        this.isRunning = false;

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        if (this.video && this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }

        if (this.handLandmarker) this.handLandmarker.close();
        if (this.poseLandmarker) this.poseLandmarker.close();
        if (this.faceLandmarker) this.faceLandmarker.close();

        console.log('✓ Application shutdown complete');
    }
}

// Initialize app when page loads
window.addEventListener('load', async () => {
    console.log('Vision Human Value - Initializing...');

    try {
        const app = new VisionApp();
        await app.initialize();
    } catch (error) {
        console.error('Failed to start application:', error);
    }
});
