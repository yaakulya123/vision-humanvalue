/**
 * Face Detection Module
 * Uses MediaPipe FaceLandmarker for 478-point face mesh tracking
 */

export class FaceTracker {
    constructor() {
        this.faceLandmarker = null;
        this.isInitialized = false;
        this.enabled = true;
        this.lastResults = null;
    }

    /**
     * Initialize MediaPipe FaceLandmarker
     */
    async initialize() {
        try {
            const vision = await window.vision;
            const { FaceLandmarker, FilesetResolver } = vision;

            // Load MediaPipe Wasm files
            const filesetResolver = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
            );

            // Create FaceLandmarker
            this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numFaces: 5,
                minFaceDetectionConfidence: 0.5,
                minFacePresenceConfidence: 0.5,
                minTrackingConfidence: 0.5,
                outputFaceBlendshapes: false,
                outputFacialTransformationMatrixes: false
            });

            this.isInitialized = true;
            console.log('✓ Face tracker initialized');
            return true;
        } catch (error) {
            console.error('Face tracker initialization failed:', error);
            return false;
        }
    }

    /**
     * Detect faces in video frame
     */
    detect(video, timestamp) {
        if (!this.isInitialized || !this.enabled) {
            return null;
        }

        try {
            this.lastResults = this.faceLandmarker.detectForVideo(video, timestamp);
            return this.lastResults;
        } catch (error) {
            console.error('Face detection error:', error);
            return null;
        }
    }

    /**
     * Draw face mesh on canvas
     */
    draw(canvas, results, dimensions) {
        if (!results || !results.faceLandmarks || results.faceLandmarks.length === 0) {
            return 0;
        }

        const ctx = canvas.getContext('2d');
        const { width, height } = dimensions;

        // Key face landmarks to draw (simplified for performance)
        const keyLandmarks = [
            // Face oval
            10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
            397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
            172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
            // Eyes
            33, 133, 160, 159, 158, 157, 173, 246, 7, 163, 144, 145, 153, 154, 155,
            362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382,
            // Eyebrows
            70, 63, 105, 66, 107, 55, 65, 52, 53, 46,
            300, 293, 334, 296, 336, 285, 295, 282, 283, 276,
            // Nose
            1, 2, 98, 327, 129, 358,
            // Mouth
            61, 146, 91, 181, 84, 17, 314, 405, 321, 375,
            78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308,
            95, 88, 178, 87, 14, 317, 402, 318, 324
        ];

        // Draw each face
        results.faceLandmarks.forEach((landmarks) => {
            // Draw face mesh with simplified landmarks
            ctx.fillStyle = '#ffff00';

            keyLandmarks.forEach((index) => {
                const landmark = landmarks[index];
                const x = landmark.x * width;
                const y = landmark.y * height;

                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
                ctx.fill();
            });

            // Draw face contour connections
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 1;

            // Face oval connections
            const faceOval = [
                10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
                397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
                172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10
            ];

            ctx.beginPath();
            faceOval.forEach((index, i) => {
                const landmark = landmarks[index];
                const x = landmark.x * width;
                const y = landmark.y * height;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();

            // Draw bounding box
            const xCoords = landmarks.map(lm => lm.x * width);
            const yCoords = landmarks.map(lm => lm.y * height);

            const minX = Math.min(...xCoords);
            const maxX = Math.max(...xCoords);
            const minY = Math.min(...yCoords);
            const maxY = Math.max(...yCoords);

            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            ctx.strokeRect(minX - 10, minY - 10, maxX - minX + 20, maxY - minY + 20);

            // Label
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 18px Arial';
            ctx.fillText('Face Detected', minX, minY - 15);
        });

        return results.faceLandmarks.length;
    }

    /**
     * Toggle face tracking on/off
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
        if (this.faceLandmarker) {
            this.faceLandmarker.close();
            this.faceLandmarker = null;
        }
        this.isInitialized = false;
        console.log('✓ Face tracker closed');
    }
}
