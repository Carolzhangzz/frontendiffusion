// Particle animation for hero section
const particles = document.querySelector('.particles');
for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 5px;
        height: 5px;
        background-color: rgba(255, 255, 255, 0.5);
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: float 20s infinite linear;
    `;
    particles.appendChild(particle);
}

// Feature carousel
const carousel = document.querySelector('.feature-carousel');
let currentIndex = 0;
setInterval(() => {
    currentIndex = (currentIndex + 1) % 3;
    carousel.scrollTo({
        left: currentIndex * carousel.offsetWidth,
        behavior: 'smooth'
    });
}, 5000);

// Add any additional JavaScript functionality here