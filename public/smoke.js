class SmokeEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 30; // Reduced count for larger particles
        this.fadeStarted = false;
        this.startTime = Date.now();
        this.duration = 7000; // 7 seconds total (5 seconds main effect + 2 seconds fade)
        
        this.init();
    }

    init() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '1000';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '1';
        
        this.resize();
        document.body.appendChild(this.canvas);
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        
        // Start fade after 5 seconds
        setTimeout(() => {
            this.fadeStarted = true;
        }, 5000);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: centerX + (Math.random() - 0.5) * this.canvas.width * 0.8,
                y: centerY + (Math.random() - 0.5) * this.canvas.height * 0.8,
                radius: Math.random() * 100 + 50, // Much larger particles
                vx: Math.random() * 0.5 - 0.25, // Slower movement
                vy: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.3 + 0.2, // Lower opacity for more natural look
                blur: Math.random() * 50 + 30 // Added blur effect
            });
        }
    }

    drawSmoke(particle) {
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.radius
        );
        
        // More subtle gradient for realistic smoke
        gradient.addColorStop(0, `rgba(240, 240, 240, ${particle.opacity})`);
        gradient.addColorStop(0.4, `rgba(230, 230, 230, ${particle.opacity * 0.8})`);
        gradient.addColorStop(1, 'rgba(220, 220, 220, 0)');
        
        this.ctx.save();
        this.ctx.filter = `blur(${particle.blur}px)`;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const logo = document.querySelector('.logo');
        const logoRect = logo ? logo.getBoundingClientRect() : null;
        const logoCenter = logoRect ? {
            x: logoRect.left + logoRect.width / 2,
            y: logoRect.top + logoRect.height / 2
        } : null;

        // Calculate global opacity based on time
        const elapsed = Date.now() - this.startTime;
        const globalOpacity = Math.max(0, 1 - (elapsed / this.duration));
        
        this.ctx.globalAlpha = globalOpacity;

        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Smooth wrapping
            if (particle.x < -particle.radius) particle.x = this.canvas.width + particle.radius;
            if (particle.x > this.canvas.width + particle.radius) particle.x = -particle.radius;
            if (particle.y < -particle.radius) particle.y = this.canvas.height + particle.radius;
            if (particle.y > this.canvas.height + particle.radius) particle.y = -particle.radius;
            
            // Fade effect from logo
            if (this.fadeStarted && logoCenter) {
                const dx = particle.x - logoCenter.x;
                const dy = particle.y - logoCenter.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = Math.max(this.canvas.width, this.canvas.height);
                
                particle.opacity *= 0.995;
                particle.opacity *= (distance / maxDistance) * 0.995;
            }
            
            this.drawSmoke(particle);
        }

        // Composite multiple layers for more realistic effect
        this.ctx.globalCompositeOperation = 'screen';
        
        // Continue animation if not completely faded
        if (elapsed < this.duration) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.canvas.remove();
        }
    }
}
