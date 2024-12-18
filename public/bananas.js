// Create falling bananas with .gif for visuals
function createBananas() {
    const container = document.getElementById('bananas');
    if (!container) return; // Ensure container exists

    // Clear any existing bananas first
    container.innerHTML = '';

    for (let i = 0; i < 20; i++) {
        const banana = document.createElement('div');
        banana.className = 'banana fixed absolute'; // Tailwind classes for positioning

        const gif = document.createElement('img');
        gif.src = 'munky.gif';  // Path to your .gif
        gif.className = 'w-32 h-32'; // Adjust size as needed

        // Set random horizontal position across the entire width of the container
        banana.style.left = `${Math.random() * 100}%`;
        
        // Ensure bananas start completely outside the bottom of the viewport
        banana.style.bottom = '-100px';
        
        // Random rotation and slight horizontal movement for variety
        const horizontalMovement = (Math.random() - 0.5) * 200; // Random lateral movement
        const rotation = (Math.random() - 0.5) * 720; // Random rotation

        // Random duration and delay for more natural falling effect
        const animationDuration = 5 + Math.random() * 10;
        const animationDelay = Math.random() * 5;

        // Create a custom animation that includes vertical movement and optional horizontal drift
        banana.style.animation = `
            moveUp ${animationDuration}s linear ${animationDelay}s infinite,
            driftSide ${animationDuration}s linear ${animationDelay}s infinite
        `;

        // Add the image element to the banana container
        banana.appendChild(gif);
        container.appendChild(banana);

        // Add inline styles for individual banana's unique movement
        banana.style.setProperty('--drift', `${horizontalMovement}px`);
        banana.style.setProperty('--rotate', `${rotation}deg`);
    }
}

// Add global styles for flying up animation
function addFallingBananaStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes moveUp {
            from {
                transform: translateY(0) rotate(0deg);
            }
            to {
                transform: translateY(-100vh) rotate(360deg);
            }
        }

        @keyframes driftSide {
            from {
                transform: translateX(0) translateY(0) rotate(0deg);
            }
            to {
                transform: 
                    translateX(var(--drift)) 
                    translateY(-100vh) 
                    rotate(var(--rotate));
            }
        }

        .banana {
            z-index: -1;
            user-select: none;
            pointer-events: none;
            position: fixed;
        }
    `;
    document.head.appendChild(style);
}

// Call these functions when the page loads
document.addEventListener('DOMContentLoaded', () => {
    addFallingBananaStyles();
    createBananas();
});

// Optional: Recreate bananas if window is resized
window.addEventListener('resize', createBananas);
