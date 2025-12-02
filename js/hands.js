/**
 * Hand Tracking Module
 * Uses MediaPipe HandLandmarker for 21-point hand tracking
 */

export class HandTracker {
    constructor() {
        this.handLandmarker = null;
        this.isInitialized = false;
        this.enabled = true;
        this.lastResults = null;
    }

    /**
     * Initialize MediaPipe HandLandmarker
     */
    async initialize() {
        try {
            const vision = await window.vision;
            const { HandLandmarker, FilesetResolver } = vision;

            // Load MediaPipe Wasm files
            const filesetResolver = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
            );

            // Create HandLandmarker
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

            this.isInitialized = true;
            console.log('✓ Hand tracker initialized');
            return true;
        } catch (error) {
            console.error('Hand tracker initialization failed:', error);
            return false;
        }
    }

    /**
     * Detect hands in video frame
     */
    detect(video, timestamp) {
        if (!this.isInitialized || !this.enabled) {
            return null;
        }

        try {
            this.lastResults = this.handLandmarker.detectForVideo(video, timestamp);
            return this.lastResults;
        } catch (error) {
            console.error('Hand detection error:', error);
            return null;
        }
    }

    /**
     * Draw hand landmarks on canvas
     */
    draw(canvas, results, dimensions) {
        if (!results || !results.landmarks || results.landmarks.length === 0) {
            return 0;
        }

        const ctx = canvas.getContext('2d');
        const { width, height } = dimensions;

        // Hand connections (21 landmarks connected)
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],           // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8],           // Index
            [0, 9], [9, 10], [10, 11], [11, 12],      // Middle
            [0, 13], [13, 14], [14, 15], [15, 16],    // Ring
            [0, 17], [17, 18], [18, 19], [19, 20],    // Pinky
            [5, 9], [9, 13], [13, 17]                 // Palm
        ];

        // Draw each hand
        results.landmarks.forEach((landmarks, handIndex) => {
            const handedness = results.handednesses[handIndex][0].categoryName;
            const color = handedness === 'Left' ? '#00ff00' : '#0088ff';

            // Draw connections
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;

            connections.forEach(([start, end]) => {
                const startPoint = landmarks[start];
                const endPoint = landmarks[end];

                ctx.beginPath();
                ctx.moveTo(startPoint.x * width, startPoint.y * height);
                ctx.lineTo(endPoint.x * width, endPoint.y * height);
                ctx.stroke();
            });

            // Draw landmarks
            landmarks.forEach((landmark, index) => {
                const x = landmark.x * width;
                const y = landmark.y * height;

                // Fingertips are larger
                const isFingertip = [4, 8, 12, 16, 20].includes(index);
                const radius = isFingertip ? 6 : 4;

                ctx.fillStyle = isFingertip ? '#ffff00' : color;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
                ctx.fill();

                // Draw white border
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // Draw label
            const wrist = landmarks[0];
            const labelX = wrist.x * width;
            const labelY = wrist.y * height - 15;

            ctx.fillStyle = color;
            ctx.font = 'bold 16px Arial';
            ctx.fillText(`${handedness} Hand`, labelX, labelY);
        });

        return results.landmarks.length;
    }

    /**
     * Toggle hand tracking on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    /**
     * Get current state
     */
    isEnabled() {
        return this.enabled;
    }

    /**
     * Cleanup
     */
    close() {
        if (this.handLandmarker) {
            this.handLandmarker.close();
            this.handLandmarker = null;
        }
        this.isInitialized = false;
        console.log('✓ Hand tracker closed');
    }
}
