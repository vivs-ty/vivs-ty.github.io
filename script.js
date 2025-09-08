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
document.addEventListener("DOMContentLoaded",typeAnim);

// Navbar scroll highlight & hamburger
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let fromTop = window.scrollY + 60;
  navLinks.forEach(link => {
    let id = link.getAttribute('href');
    if(id && id.startsWith('#')) {
      let section = document.querySelector(id);
      if(section &&
         section.offsetTop <= fromTop &&
         section.offsetTop + section.offsetHeight > fromTop) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
});

// Responsive nav
document.querySelector('.menu-toggle').onclick = function() {
  document.querySelector('.nav-links').classList.toggle('open');
};
document.querySelectorAll('.nav-links a').forEach(link => {
  link.onclick = () => document.querySelector('.nav-links').classList.remove('open');
});

// Modal Logic
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
window.onclick = function(e) {
  document.querySelectorAll('.modal').forEach(modal => {
    if (e.target === modal) modal.style.display = "none";
  });
}

// Fade-in animation on scroll
function revealOnScroll() {
  document.querySelectorAll('.fade-in').forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) sec.classList.add('visible');
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);
