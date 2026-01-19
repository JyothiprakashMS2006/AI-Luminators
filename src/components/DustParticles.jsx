import React, { useRef, useEffect } from 'react';

/**
 * DustParticles Component
 * Creates a subtle, atmospheric dust/bokeh effect using HTML Canvas.
 * No external libraries required.
 */
const DustParticles = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Resize handling
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle configuration
        const particleCount = 50; // Sparser than the chat background for elegance
        const particles = [];

        class DustParticle {
            constructor() {
                this.reset();
                // Randomize initial positions
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 100; // Start below screen

                // Very slow, drifting upward motion
                this.speedY = Math.random() * 0.5 + 0.1;
                this.speedX = (Math.random() - 0.5) * 0.3; // Slight horizontal drift

                this.size = Math.random() * 3 + 1; // Varied sizes for depth
                this.opacity = Math.random() * 0.4 + 0.1; // Low opacity
                this.fadeSpeed = Math.random() * 0.005 + 0.002;
                this.color = `hsl(${Math.random() * 40 + 200}, 70%, 70%)`; // Blue/Cyan/Purple hues
            }

            update() {
                this.y -= this.speedY;
                this.x += this.speedX;

                // Pulse opacity
                this.opacity += Math.sin(Date.now() * 0.001 * this.speedY) * 0.005;

                // Reset if off screen
                if (this.y < -this.size) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));

                // Soft blur for bokeh effect
                ctx.shadowBlur = this.size * 2;
                ctx.shadowColor = this.color;

                ctx.fill();
                ctx.globalAlpha = 1.0; // Reset
                ctx.shadowBlur = 0;
            }
        }

        // Initialize
        for (let i = 0; i < particleCount; i++) {
            particles.push(new DustParticle());
        }

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1 // Above background (0), below content (10)
            }}
        />
    );
};

export default DustParticles;
