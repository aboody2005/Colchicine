/* ===================================
   MAIN.JS — Colchicine Portfolio
   =================================== */

'use strict';

// ========= LOADER =========
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1800);
});

// ========= CUSTOM CURSOR =========
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

const hoverTargets = document.querySelectorAll('a, button, .glass-card, .ring, .nav-link');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

// Hide cursor outside window
document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });

// ========= PARTICLE CANVAS =========
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 70;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLORS = ['rgba(168,85,247', 'rgba(6,182,212', 'rgba(139,92,246'];

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.size = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }
  update(t) {
    this.x += this.vx;
    this.y += this.vy;
    const pa = this.alpha * (0.7 + 0.3 * Math.sin(t * this.pulseSpeed + this.pulsePhase));
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    return pa;
  }
  draw(t) {
    const pa = this.update(t);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `${this.color},${pa})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

// Draw connections between nearby particles
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const alpha = (1 - dist / 100) * 0.08;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(168,85,247,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

let animFrame = 0;
function animateParticles() {
  animFrame++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => p.draw(animFrame));
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ========= NAVBAR =========
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
  updateBackToTop();
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  navLinks.classList.contains('open')
    ? spans.forEach((s, i) => { if (i === 1) s.style.opacity = '0'; if (i === 0) s.style.transform = 'rotate(45deg) translate(5px, 5px)'; if (i === 2) s.style.transform = 'rotate(-45deg) translate(5px, -5px)'; })
    : spans.forEach(s => { s.style.opacity = '1'; s.style.transform = ''; });
});

// Close mobile menu on link click
navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) {
      current = sec.id;
    }
  });
  navLinkItems.forEach(link => {
    link.classList.toggle('active', link.dataset.id === current);
  });
}

// ========= SCROLL REVEAL =========
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ========= BACK TO TOP =========
const backToTopBtn = document.getElementById('back-to-top');
function updateBackToTop() {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========= SMOOTH SCROLL FOR ANCHOR LINKS =========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ========= NUMBER COUNTER ANIMATION =========
function animateCounter(el, target, suffix = '', duration = 1500) {
  const isYear = target > 1000 && !suffix;
  const start = isYear ? target - 50 : 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = Math.floor(start + (target - start) * ease);
    el.textContent = (isYear ? '~' : '') + current + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = (isYear ? '~' : '') + target + suffix;
  }
  requestAnimationFrame(update);
}

// Observe stat numbers
const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const text = entry.target.textContent.trim();
      if (text.includes('1820')) animateCounter(entry.target, 1820, '', 1200);
      else if (text.includes('399')) animateCounter(entry.target, 399.4, '', 1500);
      else if (text.includes('3')) animateCounter(entry.target, 3, '+', 1000);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterObserver.observe(el));

// ========= EVIDENCE BAR ANIMATION =========
const evidenceFills = document.querySelectorAll('.evidence-fill');
const evidenceObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // CSS handles the fill via the ::after pseudo-element width from --fill variable
      entry.target.classList.add('animated');
    }
  });
}, { threshold: 0.5 });
evidenceFills.forEach(el => evidenceObserver.observe(el));

// ========= DISTRIBUTION BAR ANIMATION =========
const distBars = document.querySelectorAll('.dist-bar');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.3 });
distBars.forEach(bar => {
  bar.style.animationPlayState = 'paused';
  barObserver.observe(bar);
});

// ========= PARALLAX EFFECT (HERO) =========
const heroBgImg = document.querySelector('.hero-bg-img');
if (heroBgImg) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBgImg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  }, { passive: true });
}

// ========= TYPING EFFECT FOR HERO SUBTITLE  =========
const heroDesc = document.querySelector('.hero-desc');
if (heroDesc) {
  const originalText = heroDesc.innerHTML;
  heroDesc.style.opacity = '0';
  setTimeout(() => {
    heroDesc.style.opacity = '1';
    heroDesc.style.transition = 'opacity 0.8s ease';
  }, 2200);
}

// ========= GLOWING SECTION INDICATORS =========
const sections = document.querySelectorAll('section[id]');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateActiveNav();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ========= MOUSE PARALLAX ON CARDS =========
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) / rect.width;
    const offsetY = (e.clientY - centerY) / rect.height;
    card.style.transform = `translateY(-4px) rotateX(${-offsetY * 4}deg) rotateY(${offsetX * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ========= RING DIAGRAM HOVER TOOLTIP =========
document.querySelectorAll('.ring').forEach(ring => {
  ring.addEventListener('mouseenter', () => {
    ring.querySelector('.ring-info').style.opacity = '1';
  });
  ring.addEventListener('mouseleave', () => {
    ring.querySelector('.ring-info').style.opacity = '0';
  });
});

// ========= FLOATING MOLECULE ANIMATION ON HERO =========
function createFloatingMolecule() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const mol = document.createElement('div');
  mol.style.cssText = `
    position: absolute;
    width: ${Math.random() * 6 + 2}px;
    height: ${Math.random() * 6 + 2}px;
    border-radius: 50%;
    background: ${Math.random() > 0.5 ? 'rgba(168,85,247,0.4)' : 'rgba(6,182,212,0.4)'};
    left: ${Math.random() * 100}%;
    bottom: 0;
    pointer-events: none;
    animation: floatUp ${Math.random() * 6 + 4}s ease-out forwards;
    z-index: 1;
  `;
  hero.appendChild(mol);
  setTimeout(() => mol.remove(), 10000);
}

// Add floating particles style
const floatStyle = document.createElement('style');
floatStyle.textContent = `
  @keyframes floatUp {
    0% { transform: translateY(0) scale(1); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 0.3; }
    100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
  }
`;
document.head.appendChild(floatStyle);
setInterval(createFloatingMolecule, 800);

console.log('%cColchicine Portfolio', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #a855f7, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cC₂₂H₂₅NO₆ · Tropolone Alkaloid · MW 399.44 g/mol', 'color: #94a3b8; font-size: 14px;');
