class SmokeEffect {
    constructor() {
        console.log('SmokeEffect constructor called');
        this.container = document.createElement('div');
        this.video = document.createElement('video');
        this.startTime = Date.now();
        this.duration = 7000; // 7 seconds total
        this.init().catch(err => console.error('Smoke effect initialization failed:', err));
    }

    async init() {
        // Create a background div that will block all content
        const background = document.createElement('div');
        background.style.position = 'fixed';
        background.style.top = '0';
        background.style.left = '0';
        background.style.width = '100%';
        background.style.height = '100%';
        background.style.backgroundColor = '#000'; // Black background
        background.style.zIndex = '9998'; // Just below the smoke

        // Setup container
        this.container.style.position = 'fixed';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.zIndex = '9999'; // Highest z-index to be on top
        this.container.style.pointerEvents = 'none';
        
        // Setup video
        this.video.src = '/smoke.mp4';
        this.video.autoplay = true;
        this.video.loop = true;
        this.video.muted = true;
        this.video.playsInline = true;
        this.video.style.width = '100%';
        this.video.style.height = '100%';
        this.video.style.objectFit = 'cover';
        this.video.style.mixBlendMode = 'screen';
        this.video.style.filter = 'contrast(1.2) brightness(2)';
        
        // Add error handling for video
        this.video.onerror = (e) => {
            console.error('Video loading error:', e);
            background.remove();
            this.container.remove();
        };

        document.body.appendChild(background);
        this.container.appendChild(this.video);
        document.body.appendChild(this.container);
        
        // Return a promise that resolves when video is loaded
        return new Promise((resolve, reject) => {
            this.video.onloadeddata = () => {
                console.log('Video loaded successfully');
                this.video.play().then(() => {
                    setTimeout(() => {
                        this.startLogoFade();
                    }, 5000); // Start logo fade after 5 seconds
                    resolve();
                }).catch(reject);
            };
        });
    }

    startLogoFade() {
        console.log('Starting logo fade');
        const logo = document.querySelector('.logo');
        if (!logo) {
            console.error('Logo element not found');
            return;
        }
        
        const logoRect = logo.getBoundingClientRect();
        const centerX = logoRect.left + logoRect.width / 2;
        const centerY = logoRect.top + logoRect.height / 2;
        
        // Create a radial gradient that starts from the logo
        const maxSize = Math.max(window.innerWidth, window.innerHeight) * 1.5;
        const duration = 2000; // 2 seconds for the fade
        const startTime = Date.now();
        
        const animateMask = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const size = maxSize * progress;
            
            // Find the background div
            const background = document.querySelector('div[style*="z-index: 9998"]');
            if (background) {
                background.style.opacity = (1 - progress).toString();
            }
            
            this.container.style.opacity = (1 - progress).toString();
            
            if (progress < 1) {
                requestAnimationFrame(animateMask);
            } else {
                // Remove both elements when animation is complete
                background?.remove();
                this.container.remove();
            }
        };
        
        animateMask();
    }
}

// Initialize immediately after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing smoke effect');
    new SmokeEffect();
});
