// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Toggle Mobile Menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');

    // Animate Hamburger
    const bars = hamburger.querySelectorAll('.bar');
    if (hamburger.classList.contains('active')) {
        bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

// Close Mobile Menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        const bars = hamburger.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    });
});

// Intersection Observer for scroll animations (To be used later automatically on elements)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-show');
            observer.unobserve(entry.target); // Run once
        }
    });
}, observerOptions);

// Function to initialize animations on specific elements
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

// Header Top Scroll Logic
function handleScroll() {
    const headerTop = document.querySelector('.header-top');
    if (window.scrollY > 50) {
        headerTop.classList.add('hidden');
    } else {
        headerTop.classList.remove('hidden');
    }
}

// Call init when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
});

// Run handleScroll on scroll
window.addEventListener('scroll', handleScroll);

// =========================================================================
// CATALOG FILTERING AND SEARCH
// =========================================================================
const filterBtns = document.querySelectorAll('.tab-btn');
const productCards = document.querySelectorAll('.product-card');
const searchInput = document.getElementById('searchInput');

if (filterBtns.length > 0 && productCards.length > 0 && searchInput) {
    // Tab Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');

            filterCatalog();
        });
    });
}

function filterCatalog() {
    const activeBtn = document.querySelector('.tab-btn.active');
    const activeTab = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    const searchTerm = searchInput.value.toLowerCase().trim();

    productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const title = card.querySelector('.product-title').innerText.toLowerCase();
        const brand = card.querySelector('.tag-brand').innerText.toLowerCase();
        const fitment = card.querySelector('.product-fit').innerText.toLowerCase();

        // Check if matches category
        const matchesCategory = activeTab === 'all' || category === activeTab;

        // Check if matches search
        const matchesSearch = title.includes(searchTerm) || brand.includes(searchTerm) || fitment.includes(searchTerm);

        if (matchesCategory && matchesSearch) {
            card.classList.remove('hide');
        } else {
            card.classList.add('hide');
        }
    });
}

// =========================================================================
// CONTACT FORM WHATSAPP
// =========================================================================
function sendWhatsApp() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const vehicle = document.getElementById('vehicle').value;
    const details = document.getElementById('details').value;

    if (!name || !phone || !vehicle || !details) return;

    const message = `Hola Punto Chino, soy *${name}*.%0A%0AQuisiera cotizar un repuesto para mi vehículo:%0A*Vehículo:* ${vehicle}%0A*Teléfono:* ${phone}%0A*Detalles:* ${details}`;

    // Replace with actual business WhatsApp number
    const whatsappUrl = `https://wa.me/593999999999?text=${message}`;
    window.open(whatsappUrl, '_blank');
}
