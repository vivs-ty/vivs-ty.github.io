// ===================== Typing Animation =====================
const typedText = ["Hi, I'm Vivesh 👋", "Cloud Enthusiast", "DevOps Engineer", "Open Source Lover"];
let i = 0, j = 0, isDeleting = false, current = "";
function typeAnim() {
  const display = document.getElementById("typing");
  if (!display) return;
  if (!isDeleting && j <= typedText[i].length) {
    current = typedText[i].slice(0, j++);
    display.innerHTML = current + '<span class="blinker">|</span>';
    setTimeout(typeAnim, 90);
  } else if (isDeleting && j >= 0) {
    current = typedText[i].slice(0, j--);
    display.innerHTML = current + '<span class="blinker">|</span>';
    setTimeout(typeAnim, 35);
  } else {
    if (!isDeleting) { isDeleting = true; setTimeout(typeAnim, 900); }
    else { isDeleting = false; i = (i + 1) % typedText.length; setTimeout(typeAnim, 600); }
  }
}

// ===================== Helpers =====================
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// ===================== Theme =====================
function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  const icon = $('#theme-toggle i');
  if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('theme') ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(saved);
  const btn = $('#theme-toggle');
  if (btn) btn.addEventListener('click', () => applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark'));
}

// ===================== Navbar =====================
function initNav() {
  const navLinks = $$('.nav-links a');
  const navbar   = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    // active link highlight
    let fromTop = window.scrollY + 90;
    navLinks.forEach(link => {
      const id = link.getAttribute('href');
      if (id && id.startsWith('#')) {
        const section = document.querySelector(id);
        if (section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
    // glassmorphism on scroll
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  const menu = $('.menu-toggle');
  if (menu) menu.onclick = () => document.querySelector('.nav-links').classList.toggle('open');
  navLinks.forEach(link => link.onclick = () => document.querySelector('.nav-links').classList.remove('open'));
}

// ===================== Scroll Progress Bar =====================
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width  = (docHeight > 0 ? (scrollTop / docHeight * 100) : 0) + '%';
  });
}

// ===================== Back to Top =====================
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 420));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===================== Stats Counters =====================
function animateCounters() {
  $$('.stat-number').forEach(el => {
    if (el.dataset.counted) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.dataset.counted = '1';
      const target = parseInt(el.dataset.target, 10);
      let count = 0;
      const duration = 1200;
      const steps    = 40;
      const increment = Math.max(1, Math.ceil(target / steps));
      const interval  = duration / steps;
      const timer = setInterval(() => {
        count = Math.min(count + increment, target);
        el.textContent = count;
        if (count >= target) clearInterval(timer);
      }, interval);
    }
  });
}

// ===================== Skill Bars =====================
function animateSkillBars() {
  $$('.skill-bar-fill').forEach(bar => {
    if (bar.dataset.animated) return;
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight - 40) {
      bar.dataset.animated = '1';
      bar.style.width = bar.dataset.pct + '%';
    }
  });
}

// ===================== Reveal on Scroll =====================
function revealOnScroll() {
  $$('.fade-in').forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) sec.classList.add('visible');
  });
  animateCounters();
  animateSkillBars();
}

// ===================== Particle Background =====================
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [], running = true;
  function resize() {
    w = canvas.width  = canvas.clientWidth  || window.innerWidth;
    h = canvas.height = canvas.clientHeight || window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();
  class P {
    constructor() {
      this.x  = Math.random() * w; this.y  = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.65; this.vy = (Math.random() - 0.5) * 0.65;
      this.r  = Math.random() * 1.7 + 0.5;
    }
    move() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
  }
  for (let k = 0; k < Math.min(80, Math.floor(w * h / 9000)); k++) particles.push(new P());
  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    for (const p of particles) {
      p.move();
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const pa = particles[a], pb = particles[b];
        const dx = pa.x - pb.x, dy = pa.y - pb.y, d = dx*dx + dy*dy;
        if (d < 25000) {
          ctx.strokeStyle = 'rgba(255,255,255,' + (0.14 - d / 25000 * 0.11) + ')';
          ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
  return {
    pause:  () => { running = false; },
    resume: () => { running = true; frame(); },
    get paused() { return !running; }
  };
}

// ===================== Project Filters =====================
function initProjectFilters() {
  const buttons = $$('.filter-btn');
  const cards   = $$('.project-card');
  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(c => {
      const tags = (c.dataset.tags || '').split(/\s+/);
      c.style.display = (f === 'all' || tags.includes(f)) ? '' : 'none';
    });
  }));
}

// ===================== Modal Logic =====================
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.style.display = 'flex';
  const focusable = modal.querySelector('a,button,input,textarea') || modal.querySelector('.close');
  if (focusable) focusable.focus();
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}
window.addEventListener('click', e => {
  $$('.modal').forEach(m => { if (e.target === m) m.style.display = 'none'; });
});
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') $$('.modal').forEach(m => m.style.display = 'none');
});

// ===================== Keyboard Shortcuts =====================
function initShortcuts(pc) {
  document.addEventListener('keydown', e => {
    if (e.key === 't') applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
    if (e.key === 'c') {
      const f = $('input[name="name"]');
      if (f) { f.focus(); f.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }
    if (e.key === 'p' && pc) {
      if (pc.paused) { pc.resume(); pc.paused = false; }
      else           { pc.pause();  pc.paused = true; }
    }
  });
}

// ===================== Cursor Spotlight =====================
function initCursorSpotlight() {
  const el = document.getElementById('cursor-spotlight');
  if (!el) return;
  document.addEventListener('mousemove', e => {
    el.style.left = e.clientX + 'px';
    el.style.top  = e.clientY + 'px';
  });
}

// ===================== Ripple Effect =====================
function initRipple() {
  const targets = '.btn-primary, .btn-outline, button[type=submit], .filter-btn, .resume-btn, #theme-toggle, #back-to-top';
  document.addEventListener('click', e => {
    const btn = e.target.closest(targets);
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

// ===================== 3D Card Tilt =====================
function initCardTilt() {
  $$('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-5px) scale(1.02) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ===================== Quote Typewriter =====================
function initQuoteTypewriter() {
  const el = document.getElementById('quote-typewriter');
  if (!el) return;
  const quote = '✨  "Always learning, always building."';
  let idx = 0;
  function tick() {
    if (idx <= quote.length) {
      el.textContent = quote.slice(0, idx++);
      setTimeout(tick, 55);
    }
  }
  // start when element is in view
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { obs.disconnect(); tick(); }
  }, { threshold: 0.5 });
  obs.observe(el.parentElement || el);
}

// ===================== Fun Fact Rotator =====================
function initFunFact() {
  const facts = [
    { emoji: '⚡', text: "When I'm not exploring tech, you'll find me solving puzzles 🧩 or experimenting with new recipes 🍲" },
    { emoji: '☁️', text: "I've automated my home network using Ansible playbooks — yes, really." },
    { emoji: '🧩', text: "I can solve a Rubik's Cube in under 2 minutes. Muscle memory + algorithms!" },
    { emoji: '🍲', text: "I believe cooking and DevOps have the same secret: having a good pipeline." },
    { emoji: '🚀', text: "\"Move fast, but don't break prod.\" — My personal motto." }
  ];
  const emojiEl = document.getElementById('fun-fact-emoji');
  const bodyEl  = document.getElementById('fun-fact-body');
  if (!emojiEl || !bodyEl) return;
  let current = 0;
  const intervalId = setInterval(() => {
    current = (current + 1) % facts.length;
    emojiEl.style.animation = 'none';
    void emojiEl.offsetWidth; // reflow
    emojiEl.style.animation = '';
    emojiEl.textContent = facts[current].emoji;
    bodyEl.textContent   = facts[current].text;
  }, 5000);
  return intervalId;
}

// ===================== Flip Card Keyboard Support =====================
function initFlipCards() {
  $$('.flip-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const inner = card.querySelector('.flip-card-inner');
        inner.style.transform = inner.style.transform === 'rotateY(180deg)' ? '' : 'rotateY(180deg)';
      }
    });
  });
}


document.addEventListener('DOMContentLoaded', () => {
  typeAnim();
  initTheme();
  initNav();
  initScrollProgress();
  initBackToTop();
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
  initProjectFilters();
  const pc = initParticles();
  initShortcuts(pc);
  initCursorSpotlight();
  initRipple();
  initCardTilt();
  initQuoteTypewriter();
  initFunFact();
  initFlipCards();
});
