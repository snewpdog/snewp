class SmokeEffect {
    constructor() {
        this.container = document.createElement('div');
        this.video = document.createElement('video');
        this.startTime = Date.now();
        this.duration = 7000; // 7 seconds total
        this.init();
    }

    init() {
        // Setup container
        this.container.style.position = 'fixed';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.zIndex = '9999';
        this.container.style.pointerEvents = 'none';
        
        // Setup video
        this.video.src = 'smoke.mp4';
        this.video.autoplay = true;
        this.video.loop = true;
        this.video.muted = true;
        this.video.playsInline = true;
        this.video.style.width = '100%';
        this.video.style.height = '100%';
        this.video.style.objectFit = 'cover';
        this.video.style.mixBlendMode = 'screen'; // This will remove the black background
        this.video.style.filter = 'contrast(1.2) brightness(2)'; // Enhance the smoke visibility
        this.video.style.opacity = '1';
        
        this.container.appendChild(this.video);
        document.body.appendChild(this.container);
        
        // Start the fade animation after video loads
        this.video.onloadeddata = () => {
            this.video.play();
            this.startFadeAnimation();
        };
        
        // Start logo-based fade after 5 seconds
        setTimeout(() => {
            this.startLogoFade();
        }, 5000);
    }

    startFadeAnimation() {
        const animate = () => {
            const elapsed = Date.now() - this.startTime;
            
            if (elapsed < this.duration) {
                requestAnimationFrame(animate);
            } else {
                this.container.remove();
            }
        };
        
        animate();
    }

    startLogoFade() {
        const logo = document.querySelector('.logo');
        if (!logo) return;
        
        const logoRect = logo.getBoundingClientRect();
        const centerX = logoRect.left + logoRect.width / 2;
        const centerY = logoRect.top + logoRect.height / 2;
        
        // Create a radial gradient mask
        this.container.style.webkitMaskImage = `radial-gradient(circle at ${centerX}px ${centerY}px, transparent 0%, black 100%)`;
        this.container.style.maskImage = `radial-gradient(circle at ${centerX}px ${centerY}px, transparent 0%, black 100%)`;
        
        // Animate the mask size
        let size = 0;
        const maxSize = Math.max(window.innerWidth, window.innerHeight) * 2;
        const duration = 2000; // 2 seconds for the radial fade
        const startTime = Date.now();
        
        const animateMask = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            size = maxSize * progress;
            
            this.container.style.webkitMaskImage = `radial-gradient(circle at ${centerX}px ${centerY}px, transparent ${size}px, black 100%)`;
            this.container.style.maskImage = `radial-gradient(circle at ${centerX}px ${centerY}px, transparent ${size}px, black 100%)`;
            
            if (progress < 1) {
                requestAnimationFrame(animateMask);
            }
        };
        
        animateMask();
    }
}
