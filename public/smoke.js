class SmokeEffect {
    constructor() {
        console.log('SmokeEffect constructor called');
        this.container = document.createElement('div');
        this.video = document.createElement('video');
        this.overlay = document.createElement('div');
        this.init();
    }

    init() {
        // Setup overlay (this will mask the content)
        this.overlay.style.position = 'fixed';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.backgroundColor = '#000';
        this.overlay.style.zIndex = '9998';
        
        // Setup container for smoke video
        this.container.style.position = 'fixed';
        this.container.style.top = '50%';
        this.container.style.left = '50%';
        this.container.style.width = '200%'; // Make video 2x bigger
        this.container.style.height = '200%'; // Make video 2x bigger
        this.container.style.transform = 'translate(-50%, -50%)';
        this.container.style.zIndex = '9999';
        this.container.style.pointerEvents = 'none';
        
        // Setup video
        this.video.src = '/smoke.mp4';
        this.video.muted = true;
        this.video.playsInline = true;
        this.video.style.width = '100%';
        this.video.style.height = '100%';
        this.video.style.objectFit = 'cover';
        this.video.style.opacity = '0.8';
        this.video.style.mixBlendMode = 'screen';
        this.video.style.filter = 'contrast(1.2) brightness(2)';

        // Add elements to DOM
        this.container.appendChild(this.video);
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.container);

        // Start the effect when video is loaded
        this.video.addEventListener('loadeddata', () => {
            console.log('Video loaded, starting effect');
            this.video.play();
            // Wait a bit before starting the reveal
            setTimeout(() => this.startReveal(), 1000);
        });
    }

    startReveal() {
        const logo = document.querySelector('.logo');
        if (!logo) {
            console.error('Logo element not found');
            return;
        }

        // Get logo position
        const logoRect = logo.getBoundingClientRect();
        const centerX = logoRect.left + logoRect.width / 2;
        const centerY = logoRect.top + logoRect.height / 2;

        // Create a mask that will reveal the content
        const mask = document.createElement('div');
        mask.style.position = 'fixed';
        mask.style.top = '0';
        mask.style.left = '0';
        mask.style.width = '100%';
        mask.style.height = '100%';
        mask.style.zIndex = '9997';
        mask.style.background = `radial-gradient(circle at ${centerX}px ${centerY}px, 
                                               transparent 0%, 
                                               black 100%)`;
        document.body.appendChild(mask);

        // Animation variables
        let progress = 0;
        const animationDuration = 3000; // 3 seconds
        const startTime = Date.now();
        const maxRadius = Math.max(
            Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2))
        );

        // Animate the reveal
        const animate = () => {
            const elapsed = Date.now() - startTime;
            progress = Math.min(elapsed / animationDuration, 1);

            // Calculate current radius
            const currentRadius = maxRadius * progress;

            // Update gradient masks
            const gradientMask = `radial-gradient(circle ${currentRadius}px at ${centerX}px ${centerY}px, 
                                                transparent 0%, 
                                                black 70%)`;
            mask.style.background = gradientMask;

            // Fade out smoke effect as content is revealed
            this.container.style.opacity = Math.max(0, 1 - progress);
            this.overlay.style.opacity = Math.max(0, 1 - progress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Cleanup when animation is done
                mask.remove();
                this.container.remove();
                this.overlay.remove();
            }
        };

        // Start animation
        animate();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing smoke effect');
    new SmokeEffect();
});
