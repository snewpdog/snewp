class SmokeEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 40; // Increased for better coverage
        this.fadeStarted = false;
        this.startTime = Date.now();
        this.duration = 7000; // 7 seconds total
        
        this.init();
    }

    init() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '9999'; // Increased z-index to be above everything
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '1';
        this.canvas.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'; // Initial background to ensure full coverage
        
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
                x: centerX + (Math.random() - 0.5) * this.canvas.width,
                y: centerY + (Math.random() - 0.5) * this.canvas.height,
                radius: Math.random() * 150 + 100, // Even larger particles
                vx: Math.random() * 0.3 - 0.15, // Slower movement
                vy: Math.random() * 0.3 - 0.15,
                opacity: Math.random() * 0.4 + 0.6, // Higher initial opacity
                blur: Math.random() * 70 + 50 // Increased blur for smoother effect
            });
        }
    }

    drawSmoke(particle) {
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.radius
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${particle.opacity * 0.8})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${particle.opacity * 0.3})`);
        
        this.ctx.save();
        this.ctx.filter = `blur(${particle.blur}px)`;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.restore();
    }

    animate() {
        // Start with a solid white background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const logo = document.querySelector('.logo');
        const logoRect = logo ? logo.getBoundingClientRect() : null;
        const logoCenter = logoRect ? {
            x: logoRect.left + logoRect.width / 2,
            y: logoRect.top + logoRect.height / 2
        } : null;

        // Calculate global opacity
        const elapsed = Date.now() - this.startTime;
        let globalOpacity = 1;
        
        if (this.fadeStarted) {
            globalOpacity = Math.max(0, 1 - ((elapsed - 5000) / (this.duration - 5000)));
        }
        
        this.ctx.globalAlpha = 1; // Reset global alpha

        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen
            if (particle.x < -particle.radius) particle.x = this.canvas.width + particle.radius;
            if (particle.x > this.canvas.width + particle.radius) particle.x = -particle.radius;
            if (particle.y < -particle.radius) particle.y = this.canvas.height + particle.radius;
            if (particle.y > this.canvas.height + particle.radius) particle.y = -particle.radius;
            
            // Fade effect from logo
            if (this.fadeStarted && logoCenter) {
                const dx = particle.x - logoCenter.x;
                const dy = particle.y - logoCenter.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = Math.max(this.canvas.width, this.canvas.height) * 0.5;
                
                // Faster fade near logo
                const fadeFactor = Math.min(1, distance / maxDistance);
                particle.opacity *= 0.99;
                particle.opacity *= fadeFactor;
            }
            
            this.drawSmoke(particle);
        }

        // Apply global fade
        this.canvas.style.opacity = globalOpacity.toString();
        
        // Continue animation if not completely faded
        if (elapsed < this.duration) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.canvas.remove();
        }
    }
}
