// ===== Barra de progreso + navbar compacta =====
const navbar = document.getElementById('navbar');
const progress = document.getElementById('progress');
function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
    navbar.classList.toggle('scrolled', scrollY > 40);
}
addEventListener('scroll', onScroll);
onScroll();

// ===== Menu movil =====
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));

// ===== Maquina de escribir (solo en Home) =====
const typed = document.getElementById('typed');
if (typed) {
    const roles = ['Luau Developer', 'Systems Designer', 'Roblox Game Dev'];
    let r = 0, c = 0, deleting = false;
    (function type() {
        const word = roles[r];
        typed.textContent = word.slice(0, c);
        if (!deleting && c++ === word.length) { deleting = true; return setTimeout(type, 1600); }
        if (deleting && c-- === 0) { deleting = false; r = (r + 1) % roles.length; }
        setTimeout(type, deleting ? 40 : 90);
    })();
}

// ===== Aparicion al hacer scroll =====
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), e.target.dataset.delay || 0);
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.delay = (i % 3) * 120;
    io.observe(el);
});

// ===== Luz que sigue al mouse en las cards =====
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const b = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - b.left) + 'px');
        card.style.setProperty('--my', (e.clientY - b.top) + 'px');
    });
});

// ===== Transicion suave entre paginas =====
document.querySelectorAll('a[href]').forEach(a => {
    const url = new URL(a.href, location.href);
    const internal = url.origin === location.origin && !a.target && !url.hash;
    if (!internal) return;
    a.addEventListener('click', e => {
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        document.body.classList.add('leaving');
        setTimeout(() => location.href = a.href, 250);
    });
});
addEventListener('pageshow', e => { if (e.persisted) document.body.classList.remove('leaving'); });

// ===== Particulas de fondo =====
const cv = document.getElementById('fx');
if (cv && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = cv.getContext('2d');
    let W, H, pts = [];
    function size() {
        W = cv.width = innerWidth; H = cv.height = innerHeight;
        pts = Array.from({ length: Math.min(70, W / 18 | 0) }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3
        }));
    }
    function draw() {
        ctx.clearRect(0, 0, W, H);
        pts.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
            ctx.fillStyle = 'rgba(0,240,255,.6)';
            ctx.fillRect(p.x, p.y, 2, 2);
            for (let j = i + 1; j < pts.length; j++) {
                const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
                if (d < 130) {
                    ctx.strokeStyle = `rgba(138,92,255,${.18 * (1 - d / 130)})`;
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
                }
            }
        });
        requestAnimationFrame(draw);
    }
    size(); draw();
    addEventListener('resize', size);
}
