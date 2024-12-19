// Save this as smoke.js
class SmokeEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.fadeStarted = false;
        
        this.init();
    }

    init() {
        // Style the canvas
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '1000';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '1';
        
        // Set canvas size
        this.resize();
        
        // Add to DOM
        document.body.appendChild(this.canvas);
        
        // Create initial particles
        this.createParticles();
        
        // Start animation
        this.animate();
        
        // Add resize listener
        window.addEventListener('resize', () => this.resize());
        
        // Start fade after 2 seconds
        setTimeout(() => {
            this.fadeStarted = true;
        }, 2000);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 20 + 10,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
                opacity: Math.random() * 0.5 + 0.5
            });
        }
    }

    drawSmoke(particle) {
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.radius
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Get logo position for fade effect
        const logo = document.querySelector('.logo');
        const logoRect = logo ? logo.getBoundingClientRect() : null;
        const logoCenter = logoRect ? {
            x: logoRect.left + logoRect.width / 2,
            y: logoRect.top + logoRect.height / 2
        } : null;

        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            // Move particles
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Fade effect
            if (this.fadeStarted && logoCenter) {
                const dx = particle.x - logoCenter.x;
                const dy = particle.y - logoCenter.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = Math.max(this.canvas.width, this.canvas.height);
                
                particle.opacity *= 0.99;
                particle.opacity *= (distance / maxDistance) * 0.99;
            }
            
            this.drawSmoke(particle);
        }
        
        // Remove fully faded particles
        this.particles = this.particles.filter(p => p.opacity > 0.01);
        
        // Continue animation if particles remain
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.canvas.remove();
        }
    }
}