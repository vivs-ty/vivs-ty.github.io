// Typing Animation
const typedText = ["Hi, I'm Vivesh 👋", "Cloud Enthusiast", "DevOps Engineer", "Open Source Lover"];
let i = 0, j = 0, isDeleting = false, current = "";
function typeAnim() {
  let display = document.getElementById("typing");
  if(!display) return;
  if(!isDeleting && j <= typedText[i].length) {
    current = typedText[i].slice(0, j++);
    display.innerHTML = current + '<span class="blinker">|</span>';
    setTimeout(typeAnim, 90);
  } else if(isDeleting && j >= 0) {
    current = typedText[i].slice(0, j--);
    display.innerHTML = current + '<span class="blinker">|</span>';
    setTimeout(typeAnim, 35);
  } else {
    if(!isDeleting) isDeleting = true, setTimeout(typeAnim, 800);
    else isDeleting = false, i = (i + 1) % typedText.length, setTimeout(typeAnim, 600);
  }
}

// Small helper: safe query
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// Theme handling
function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  const icon = $('#theme-toggle i');
  if(icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(saved);
  const btn = $('#theme-toggle');
  if(btn) btn.addEventListener('click', () => applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark'));
}

// Navbar scroll highlight & hamburger
function initNav() {
  const navLinks = $$('.nav-links a');
  window.addEventListener('scroll', () => {
    let fromTop = window.scrollY + 80;
    navLinks.forEach(link => {
      let id = link.getAttribute('href');
      if(id && id.startsWith('#')) {
        let section = document.querySelector(id);
        if(section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });
  const menu = $('.menu-toggle');
  if(menu) menu.onclick = () => document.querySelector('.nav-links').classList.toggle('open');
  $$('.nav-links a').forEach(link => link.onclick = () => document.querySelector('.nav-links').classList.remove('open'));
}

// Modal Logic (improved)
function openModal(id) {
  const modal = document.getElementById(id);
  if(!modal) return;
  modal.style.display = 'flex';
  const focusable = modal.querySelector('a,button,input,textarea') || modal.querySelector('.close');
  if(focusable) focusable.focus();
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if(!modal) return;
  modal.style.display = 'none';
}
window.addEventListener('click', function(e) {
  document.querySelectorAll('.modal').forEach(modal => { if (e.target === modal) modal.style.display = 'none'; });
});
window.addEventListener('keydown', function(e) {
  if(e.key === 'Escape') document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
});

// Reveal on scroll
function revealOnScroll() {
  document.querySelectorAll('.fade-in').forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) sec.classList.add('visible');
  });
}

// Simple particle background
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [], running = true;
  function resize() { w = canvas.width = canvas.clientWidth || window.innerWidth; h = canvas.height = canvas.clientHeight || window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();
  class P { constructor(){ this.x = Math.random()*w; this.y = Math.random()*h; this.vx = (Math.random()-0.5)*0.6; this.vy = (Math.random()-0.5)*0.6; this.r = Math.random()*1.6 + 0.6; } move(){ this.x += this.vx; this.y += this.vy; if(this.x<0||this.x>w)this.vx*=-1; if(this.y<0||this.y>h)this.vy*=-1; } }
  for(let k=0;k<Math.min(80, Math.floor(w*h/9000));k++) particles.push(new P());
  function frame(){ if(!running) return; ctx.clearRect(0,0,w,h); ctx.fillStyle = 'rgba(255,255,255,0.06)'; for(let p of particles){ p.move(); ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); }
    // connect
    for(let a=0;a<particles.length;a++) for(let b=a+1;b<particles.length;b++){ let pa=particles[a], pb=particles[b]; let dx=pa.x-pb.x, dy=pa.y-pb.y; let d=dx*dx+dy*dy; if(d<25000){ ctx.strokeStyle = 'rgba(255,255,255,'+ (0.15 - d/25000*0.12) +')'; ctx.lineWidth=0.6; ctx.beginPath(); ctx.moveTo(pa.x,pa.y); ctx.lineTo(pb.x,pb.y); ctx.stroke(); } }
    requestAnimationFrame(frame);
  }
  frame();
  // expose pause toggle
  return { pause: ()=> running=false, resume: ()=>{ running=true; frame(); } };
}

// Project filters
function initProjectFilters() {
  const buttons = $$('.filter-btn');
  const cards = $$('.project-card');
  buttons.forEach(btn => btn.addEventListener('click', ()=>{
    buttons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(c => {
      const tags = (c.dataset.tags||'').split(/\s+/);
      c.style.display = (f==='all' || tags.includes(f)) ? '' : 'none';
    });
  }));
}

// Keyboard shortcuts
function initShortcuts(particleController) {
  document.addEventListener('keydown', (e)=>{
    if(e.key === 't') applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
    if(e.key === 'c') { const f = document.querySelector('input[name="name"]'); if(f){ f.focus(); f.scrollIntoView({behavior:'smooth',block:'center'}); } }
    if(e.key === 'p' && particleController) particleController.paused ? particleController.resume() : particleController.pause();
  });
}

// Bootstrap everything
document.addEventListener('DOMContentLoaded', ()=>{
  typeAnim();
  initTheme();
  initNav();
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
  initProjectFilters();
  const particleController = initParticles();
  initShortcuts(particleController);
});
