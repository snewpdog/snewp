class SmokeEffect {
    constructor() {
        console.log('SmokeEffect constructor called');
        this.maxLoadAttempts = 3;
        this.loadAttempts = 0;
        this.loadTimeout = 2000; // 2 seconds timeout
        this.initialized = false;
        this.hideContent();
        this.setupElements();
        this.initWithRetry();
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
        requestAnimationFrame(() => {
            const style = document.getElementById('smoke-effect-style');
            if (style) {
                style.textContent = `
                    body > *:not(#smoke-container):not(#smoke-overlay):not(#smoke-mask) {
                        opacity: 1 !important;
                        transition: opacity 0.5s ease-in-out;
                    }
                `;
            }
        });
    }

    setupElements() {
        // Setup container
        this.container = document.createElement('div');
        this.container.id = 'smoke-container';
        this.container.style.position = 'fixed';
        this.container.style.top = '50%';
        this.container.style.left = '50%';
        this.container.style.transform = 'translate(-50%, -50%)';
        this.container.style.zIndex = '9999';
        this.container.style.pointerEvents = 'none';
        
        // Setup overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'smoke-overlay';
        this.overlay.style.position = 'fixed';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.backgroundColor = '#000';
        this.overlay.style.zIndex = '9998';

        // Add elements to DOM
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.container);
    }

    async initWithRetry() {
        if (this.loadAttempts >= this.maxLoadAttempts) {
            console.log('Max load attempts reached, showing content');
            this.showContentAndCleanup();
            return;
        }

        this.loadAttempts++;
        console.log(`Attempt ${this.loadAttempts} to initialize smoke effect`);

        try {
            await this.initializeVideo();
        } catch (error) {
            console.error('Failed to initialize video:', error);
            setTimeout(() => this.initWithRetry(), 1000);
        }
    }

    async initializeVideo() {
        return new Promise((resolve, reject) => {
            // Create new video element
            this.video = document.createElement('video');
            this.video.id = 'smoke-video';
            
            // Set up video properties
            const videoProperties = {
                src: '/smoke.webm',
                muted: true,
                playsInline: true,
                autoplay: true,
                style: {
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'cover',
                    opacity: '0.8',
                    mixBlendMode: 'screen',
                    filter: 'contrast(1.2) brightness(2)',
                    transform: 'scale(2)',
                }
            };

            // Apply properties
            Object.assign(this.video, videoProperties);
            Object.assign(this.video.style, videoProperties.style);

            // Set additional attributes for mobile
            this.video.setAttribute('playsinline', '');
            this.video.setAttribute('webkit-playsinline', '');

            // Clear container and add video
            this.container.innerHTML = '';
            this.container.appendChild(this.video);

            // Set up event listeners
            let loadTimeout = setTimeout(() => {
                reject(new Error('Video load timeout'));
            }, this.loadTimeout);

            this.video.addEventListener('loadeddata', async () => {
                clearTimeout(loadTimeout);
                console.log('Video loaded successfully');
                try {
                    await this.video.play();
                    this.initialized = true;
                    setTimeout(() => this.startReveal(), 1000);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });

            this.video.addEventListener('error', (e) => {
                clearTimeout(loadTimeout);
                reject(new Error(`Video error: ${this.video.error?.message || 'Unknown error'}`));
            });
        });
    }

    startReveal() {
        if (!this.initialized) return;

        const logo = document.querySelector('.logo');
        if (!logo) {
            this.showContentAndCleanup();
            return;
        }

        // Get viewport dimensions
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

        // Create mask
        const mask = document.createElement('div');
        mask.id = 'smoke-mask';
        mask.style.position = 'fixed';
        mask.style.top = '0';
        mask.style.left = '0';
        mask.style.width = '100%';
        mask.style.height = '100%';
        mask.style.zIndex = '9997';
        document.body.appendChild(mask);

        // Get logo position and adjust for current scroll position
        const logoRect = logo.getBoundingClientRect();
        const centerX = logoRect.left + (logoRect.width / 2);
        const centerY = logoRect.top + (logoRect.height / 2);

        // Show content before animation
        this.showContent();

        // Animation variables
        const startTime = Date.now();
        const animationDuration = 3000;
        const maxRadius = Math.sqrt(Math.pow(vw, 2) + Math.pow(vh, 2)) * 1.5;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            const currentRadius = maxRadius * progress;

            requestAnimationFrame(() => {
                const gradientMask = `radial-gradient(circle ${currentRadius}px at ${centerX}px ${centerY}px, 
                                                    transparent 0%, 
                                                    black 70%)`;
                mask.style.background = gradientMask;

                this.container.style.opacity = Math.max(0, 1 - progress);
                this.overlay.style.opacity = Math.max(0, 1 - progress);

                if (progress < 1) {
                    animate();
                } else {
                    this.cleanup();
                }
            });
        };

        animate();
    }

    showContentAndCleanup() {
        this.showContent();
        this.cleanup();
    }

    cleanup() {
        const elements = [
            this.container,
            this.overlay,
            document.getElementById('smoke-mask'),
            document.getElementById('smoke-effect-style')
        ];
        
        elements.forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
    }
}

// Initialize when DOM is ready and handle potential errors
const initSmokeEffect = () => {
    try {
        new SmokeEffect();
    } catch (error) {
        console.error('Failed to initialize smoke effect:', error);
        // Remove any leftover elements
        ['smoke-container', 'smoke-overlay', 'smoke-mask', 'smoke-effect-style'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
        // Show content
        document.body.style.opacity = '1';
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmokeEffect);
} else {
    initSmokeEffect();
}
