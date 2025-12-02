/**
 * Professional Sci-Fi Drawing Utilities
 */

export class DrawingUtils {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
    }

    /**
     * Draw corner brackets around a bounding box
     */
    drawCornerBrackets(x, y, width, height, color = '#00ffff', size = 20) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;

        // Top-left
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + size);
        this.ctx.lineTo(x, y);
        this.ctx.lineTo(x + size, y);
        this.ctx.stroke();

        // Top-right
        this.ctx.beginPath();
        this.ctx.moveTo(x + width - size, y);
        this.ctx.lineTo(x + width, y);
        this.ctx.lineTo(x + width, y + size);
        this.ctx.stroke();

        // Bottom-left
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + height - size);
        this.ctx.lineTo(x, y + height);
        this.ctx.lineTo(x + size, y + height);
        this.ctx.stroke();

        // Bottom-right
        this.ctx.beginPath();
        this.ctx.moveTo(x + width - size, y + height);
        this.ctx.lineTo(x + width, y + height);
        this.ctx.lineTo(x + width, y + height - size);
        this.ctx.stroke();
    }

    /**
     * Draw data label with background
     */
    drawDataLabel(x, y, text, color = '#00ffff') {
        this.ctx.font = '12px "Courier New", monospace';
        const metrics = this.ctx.measureText(text);
        const padding = 6;

        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(x - padding, y - 16, metrics.width + padding * 2, 20);

        // Border
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x - padding, y - 16, metrics.width + padding * 2, 20);

        // Text
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }

    /**
     * Draw measurement line between two points
     */
    drawMeasurementLine(x1, y1, x2, y2, label, color = '#00ffff') {
        // Dashed line
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Midpoint label
        if (label) {
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            this.drawDataLabel(midX, midY, label, color);
        }
    }

    /**
     * Draw landmark with crosshair
     */
    drawLandmarkCrosshair(x, y, size = 8, color = '#00ffff') {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1.5;

        // Outer circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, 2 * Math.PI);
        this.ctx.stroke();

        // Inner dot
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
        this.ctx.fill();

        // Crosshair lines
        const lineLength = size + 5;
        this.ctx.beginPath();
        this.ctx.moveTo(x - lineLength, y);
        this.ctx.lineTo(x + lineLength, y);
        this.ctx.moveTo(x, y - lineLength);
        this.ctx.lineTo(x, y + lineLength);
        this.ctx.stroke();
    }

    /**
     * Draw connection with glow effect
     */
    drawGlowLine(x1, y1, x2, y2, color = '#00ffff', width = 2) {
        // Glow
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = color;

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        // Reset shadow
        this.ctx.shadowBlur = 0;
    }

    /**
     * Draw coordinate axes overlay
     */
    drawCoordinateOverlay(x, y, width, height, color = '#00ffff') {
        this.ctx.strokeStyle = color;
        this.ctx.globalAlpha = 0.3;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([2, 4]);

        // Vertical lines
        for (let i = 0; i <= 4; i++) {
            const vx = x + (width / 4) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(vx, y);
            this.ctx.lineTo(vx, y + height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let i = 0; i <= 4; i++) {
            const hy = y + (height / 4) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(x, hy);
            this.ctx.lineTo(x + width, hy);
            this.ctx.stroke();
        }

        this.ctx.setLineDash([]);
        this.ctx.globalAlpha = 1.0;
    }

    /**
     * Draw tech-style header
     */
    drawTechHeader(x, y, title, subtitle, color = '#00ffff') {
        // Title
        this.ctx.font = 'bold 14px "Courier New", monospace';
        this.ctx.fillStyle = color;
        this.ctx.fillText(title, x, y);

        // Subtitle
        this.ctx.font = '10px "Courier New", monospace';
        this.ctx.fillStyle = `${color}99`;
        this.ctx.fillText(subtitle, x, y + 14);

        // Underline
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + 18);
        this.ctx.lineTo(x + 150, y + 18);
        this.ctx.stroke();
    }
}
