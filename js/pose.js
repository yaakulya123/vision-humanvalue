/**
 * Pose Tracking Module
 * Uses MediaPipe PoseLandmarker for 33-point body tracking
 */

export class PoseTracker {
    constructor() {
        this.poseLandmarker = null;
        this.isInitialized = false;
        this.enabled = true;
        this.lastResults = null;
    }

    /**
     * Initialize MediaPipe PoseLandmarker
     */
    async initialize() {
        try {
            const vision = await window.vision;
            const { PoseLandmarker, FilesetResolver } = vision;

            // Load MediaPipe Wasm files
            const filesetResolver = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
            );

            // Create PoseLandmarker
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

            this.isInitialized = true;
            console.log('✓ Pose tracker initialized');
            return true;
        } catch (error) {
            console.error('Pose tracker initialization failed:', error);
            return false;
        }
    }

    /**
     * Detect pose in video frame
     */
    detect(video, timestamp) {
        if (!this.isInitialized || !this.enabled) {
            return null;
        }

        try {
            this.lastResults = this.poseLandmarker.detectForVideo(video, timestamp);
            return this.lastResults;
        } catch (error) {
            console.error('Pose detection error:', error);
            return null;
        }
    }

    /**
     * Draw pose skeleton on canvas
     */
    draw(canvas, results, dimensions) {
        if (!results || !results.landmarks || results.landmarks.length === 0) {
            return false;
        }

        const ctx = canvas.getContext('2d');
        const { width, height } = dimensions;

        // Pose connections (33 landmarks)
        const connections = [
            // Face
            [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8],
            // Torso
            [9, 10], [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
            [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [11, 23], [12, 24],
            [23, 24],
            // Legs
            [23, 25], [25, 27], [27, 29], [29, 31], [27, 31],
            [24, 26], [26, 28], [28, 30], [28, 32], [30, 32]
        ];

        const landmarks = results.landmarks[0];

        // Draw connections
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;

        connections.forEach(([start, end]) => {
            const startPoint = landmarks[start];
            const endPoint = landmarks[end];

            // Only draw if both points are visible
            if (startPoint.visibility > 0.5 && endPoint.visibility > 0.5) {
                ctx.beginPath();
                ctx.moveTo(startPoint.x * width, startPoint.y * height);
                ctx.lineTo(endPoint.x * width, endPoint.y * height);
                ctx.stroke();
            }
        });

        // Draw landmarks
        landmarks.forEach((landmark, index) => {
            if (landmark.visibility > 0.5) {
                const x = landmark.x * width;
                const y = landmark.y * height;

                // Key points are larger
                const isKeyPoint = [0, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26].includes(index);
                const radius = isKeyPoint ? 6 : 4;

                ctx.fillStyle = '#ff00ff';
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
                ctx.fill();

                // Draw white border
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });

        // Draw bounding box
        const visibleLandmarks = landmarks.filter(lm => lm.visibility > 0.5);
        if (visibleLandmarks.length > 0) {
            const xCoords = visibleLandmarks.map(lm => lm.x * width);
            const yCoords = visibleLandmarks.map(lm => lm.y * height);

            const minX = Math.min(...xCoords);
            const maxX = Math.max(...xCoords);
            const minY = Math.min(...yCoords);
            const maxY = Math.max(...yCoords);

            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.strokeRect(minX - 10, minY - 10, maxX - minX + 20, maxY - minY + 20);

            // Label
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 18px Arial';
            ctx.fillText('Person Detected', minX, minY - 15);
        }

        return true;
    }

    /**
     * Toggle pose tracking on/off
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
        if (this.poseLandmarker) {
            this.poseLandmarker.close();
            this.poseLandmarker = null;
        }
        this.isInitialized = false;
        console.log('✓ Pose tracker closed');
    }
}
