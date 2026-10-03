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
    const whatsappUrl = `https://wa.me/593984911400?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// =========================================================================
// LOCATIONS MAP — Leaflet + OpenStreetMap (CARTO dark tiles), free / no API key
// =========================================================================
const mapEl = document.getElementById('map');
if (mapEl && typeof L !== 'undefined') {
    const branches = [
        {
            name: 'Punto Chino — Manta (Matriz)',
            addr: 'Av. 4 de Noviembre y calle 299, diagonal a hielo “Polar”',
            tel: '0984911400',
            lat: -0.9624580525911236,
            lng: -80.70980779118017
        },
        {
            name: 'Punto Chino — Portoviejo',
            addr: 'Frente al cuerpo de bomberos, Av. 15 de Abril',
            tel: '0963862306',
            lat: -1.0635925940835218,
            lng: -80.45699369349812
        }
    ];

    const map = L.map('map', { scrollWheelZoom: false });
    map.attributionControl.setPrefix(false); // quita el texto "Leaflet"

    // Base oscura de Esri — libre, sin API key ni marca de agua
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 16
    }).addTo(map);
    // Capa de etiquetas (nombres de ciudades y calles)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16
    }).addTo(map);

    const markers = {};
    const bounds = [];

    branches.forEach(b => {
        const key = `${b.lat},${b.lng}`;
        if (markers[key]) return; // evita apilar pines en la misma dirección (Manta)
        const gmaps = `https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}`;
        const marker = L.marker([b.lat, b.lng]).addTo(map);
        marker.bindPopup(
            `<strong>${b.name}</strong><br>${b.addr}<br>` +
            `<a href="tel:${b.tel}">${b.tel}</a><br>` +
            `<a href="${gmaps}" target="_blank" rel="noopener">Ver en Google Maps &rsaquo;</a>`
        );
        markers[key] = marker;
        bounds.push([b.lat, b.lng]);
    });

    map.fitBounds(bounds, { padding: [60, 60] });
    if (map.getZoom() > 12) map.setZoom(12);

    // Fix tile sizing once the container has its final dimensions
    setTimeout(() => map.invalidateSize(), 300);
}

// =========================================================================
// THEME TOGGLE (claro / oscuro) con persistencia en localStorage
// =========================================================================
const themeToggle = document.getElementById('themeToggle');

function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (!icon) return;
    // Oscuro -> muestra sol (para pasar a claro); Claro -> muestra luna
    icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}

updateThemeIcon(document.documentElement.getAttribute('data-theme') || 'dark');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('pc-theme', next); } catch (e) { }
        updateThemeIcon(next);
    });
}

// =========================================================================
// LIGHTBOX — visor de fotos de locales con slider
// =========================================================================
(function () {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    const lbImg = document.getElementById('lbImg');
    const lbCount = document.getElementById('lbCount');
    const btnPrev = document.getElementById('lbPrev');
    const btnNext = document.getElementById('lbNext');
    const btnClose = document.getElementById('lbClose');
    let imgs = [];
    let idx = 0;

    function render() {
        lbImg.src = imgs[idx];
        const multi = imgs.length > 1;
        lbCount.textContent = multi ? (idx + 1) + ' / ' + imgs.length : '';
        btnPrev.style.display = multi ? 'flex' : 'none';
        btnNext.style.display = multi ? 'flex' : 'none';
    }
    function open(list, start) {
        imgs = list;
        idx = start || 0;
        render();
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function close() {
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    function next() { idx = (idx + 1) % imgs.length; render(); }
    function prev() { idx = (idx - 1 + imgs.length) % imgs.length; render(); }

    document.querySelectorAll('.loc-photo').forEach(btn => {
        btn.addEventListener('click', () => {
            const data = btn.getAttribute('data-images');
            if (!data) return;
            open(data.split('|'), 0);
        });
    });

    btnNext.addEventListener('click', (e) => { e.stopPropagation(); next(); });
    btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
    btnClose.addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowRight') next();
        else if (e.key === 'ArrowLeft') prev();
    });
})();
