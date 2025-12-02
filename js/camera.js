/**
 * Camera Handler
 * Manages webcam access and video stream
 */

export class CameraHandler {
    constructor() {
        this.video = null;
        this.stream = null;
        this.isReady = false;
    }

    /**
     * Initialize camera and request permissions
     */
    async initialize(videoElement) {
        this.video = videoElement;

        try {
            // Request camera access with optimal settings for desktop
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 },
                    facingMode: 'user'
                },
                audio: false
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;

            // Wait for video to be ready
            await new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    this.video.play();
                    resolve();
                };
            });

            this.isReady = true;
            console.log('✓ Camera initialized:', {
                width: this.video.videoWidth,
                height: this.video.videoHeight
            });

            return true;
        } catch (error) {
            console.error('Camera initialization failed:', error);
            this.handleCameraError(error);
            return false;
        }
    }

    /**
     * Handle camera errors
     */
    handleCameraError(error) {
        let message = 'Unable to access camera. ';

        if (error.name === 'NotAllowedError') {
            message += 'Please allow camera access in your browser settings.';
        } else if (error.name === 'NotFoundError') {
            message += 'No camera found on this device.';
        } else if (error.name === 'NotReadableError') {
            message += 'Camera is already in use by another application.';
        } else {
            message += 'Please check your camera connection and permissions.';
        }

        throw new Error(message);
    }

    /**
     * Get video dimensions
     */
    getDimensions() {
        if (!this.video) return { width: 0, height: 0 };

        return {
            width: this.video.videoWidth,
            height: this.video.videoHeight
        };
    }

    /**
     * Check if camera is ready
     */
    ready() {
        return this.isReady && this.video && this.video.readyState === 4;
    }

    /**
     * Stop camera and release resources
     */
    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        if (this.video) {
            this.video.srcObject = null;
        }

        this.isReady = false;
        console.log('✓ Camera stopped');
    }
}
