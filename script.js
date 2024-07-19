
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
const items = carousel.querySelectorAll('.feature-item');
let currentIndex = 0;

function updateActiveItem() {
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
    });
}

function rotateCarousel() {
    currentIndex = (currentIndex + 1) % items.length;
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateActiveItem();
}

setInterval(rotateCarousel, 1000); // Rotate every 5 seconds

// Initialize the active state
updateActiveItem();

// Optional: Add touch support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
        rotateCarousel();
    } else if (touchEndX - touchStartX > 50) {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateActiveItem();
    }
});

// Add any additional JavaScript functionality here