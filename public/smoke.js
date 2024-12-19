class SmokeEffect {
    constructor() {
        console.log('SmokeEffect constructor called');
        // Hide content immediately
        this.hideContent();
        this.container = document.createElement('div');
        this.video = document.createElement('video');
        this.overlay = document.createElement('div');
        this.init();
    }

    hideContent() {
        // Create and insert a style tag to hide content
        const style = document.createElement('style');
        style.id = 'smoke-effect-style';
        style.textContent = `
            body > *:not(#smoke-container):not(#smoke-overlay):not(#smoke-mask) {
                opacity: 0 !important;
                transition: opacity 0.5s ease-in-out;
            }
        `;
        document.head.appendChild(style);
    }

    showContent() {
        // Remove the style tag to show content
        const style = document.getElementById('smoke-effect-style');
        if (style) {
            style.textContent = `
                body > *:not(#smoke-container):not(#smoke-overlay):not(#smoke-mask) {
                    opacity: 1 !important;
                    transition: opacity 0.5s ease-in-out;
                }
            `;
        }
    }

    init() {
        // Setup overlay
        this.overlay.id = 'smoke-overlay';
        this.overlay.style.position = 'fixed';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.backgroundColor = '#000';
        this.overlay.style.zIndex = '9998';
        
        // Setup container
        this.container.id = 'smoke-container';
        this.container.style.position = 'fixed';
        this.container.style.top = '50%';
        this.container.style.left = '50%';
        this.container.style.width = '200%';
        this.container.style.height = '200%';
        this.container.style.transform = 'translate(-50%, -50%)';
        this.container.style.zIndex = '9999';
        this.container.style.pointerEvents = 'none';
        
        // Setup video with mobile-specific attributes
        this.video.id = 'smoke-video';
        this.video.src = '/smoke.mp4';
        this.video.muted = true;
        this.video.playsInline = true;
        this.video.setAttribute('playsinline', ''); // iOS support
        this.video.setAttribute('webkit-playsinline', ''); // iOS support
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

        // Handle video loading and errors
        this.video.addEventListener('loadeddata', () => {
            console.log('Video loaded, starting effect');
            this.startVideo();
        });

        this.video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            // If video fails, still show the content
            this.showContent();
            this.cleanup();
        });

        // Fallback if video takes too long to load
        this.setupLoadingTimeout();
    }

    setupLoadingTimeout() {
        // If video takes more than 3 seconds to load, show content anyway
        setTimeout(() => {
            if (!this.video.readyState >= 4) {
                console.log('Video taking too long to load, showing content');
                this.showContent();
                this.cleanup();
            }
        }, 3000);
    }

    async startVideo() {
        try {
            await this.video.play();
            // Wait a bit before starting the reveal
            setTimeout(() => this.startReveal(), 1000);
        } catch (err) {
            console.error('Error playing video:', err);
            // If video fails to play, show content
            this.showContent();
            this.cleanup();
        }
    }

    startReveal() {
        const logo = document.querySelector('.logo');
        if (!logo) {
            console.error('Logo element not found');
            this.showContent();
            this.cleanup();
            return;
        }

        // Create mask for reveal effect
        const mask = document.createElement('div');
        mask.id = 'smoke-mask';
        mask.style.position = 'fixed';
        mask.style.top = '0';
        mask.style.left = '0';
        mask.style.width = '100%';
        mask.style.height = '100%';
        mask.style.zIndex = '9997';
        document.body.appendChild(mask);

        // Get logo position relative to viewport
        const logoRect = logo.getBoundingClientRect();
        const centerX = logoRect.left + logoRect.width / 2;
        const centerY = logoRect.top + logoRect.height / 2;

        // Animation variables
        let progress = 0;
        const animationDuration = 3000;
        const startTime = Date.now();
        const maxRadius = Math.max(
            Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2))
        ) * 1.5; // Make sure it covers the entire screen

        // Show content before starting animation
        this.showContent();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            progress = Math.min(elapsed / animationDuration, 1);

            const currentRadius = maxRadius * progress;
            const gradientMask = `radial-gradient(circle ${currentRadius}px at ${centerX}px ${centerY}px, 
                                                transparent 0%, 
                                                black 70%)`;
            mask.style.background = gradientMask;

            this.container.style.opacity = Math.max(0, 1 - progress);
            this.overlay.style.opacity = Math.max(0, 1 - progress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.cleanup();
            }
        };

        animate();
    }

    cleanup() {
        // Remove all effect elements
        const elements = [
            this.container,
            this.overlay,
            document.getElementById('smoke-mask'),
            document.getElementById('smoke-effect-style')
        ];
        
        elements.forEach(el => el?.remove());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SmokeEffect();
    });
} else {
    new SmokeEffect();
}
