/* ================================================================
   CLUB PARTENAIRES D'AFFAIRES — JavaScript
   Vanilla JS · Curseur · Parallaxe · Tilt · Magnétique
   ================================================================ */

const isHoverDevice = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

document.addEventListener('DOMContentLoaded', () => {
  injectUI();
  initCursor();
  initScrollHandlers();
  initNavbar();
  initActiveLink();
  initReveal();
  initCounters();
  initParallax();
  initCardTilt();
  initFilter();
  initForm();
  initMobileNav();
  initSmoothAnchors();
});


/* ════════════════════════════════════════════════════════════════
   1. INJECTION DES ÉLÉMENTS UI
   ════════════════════════════════════════════════════════════════ */
function injectUI() {
  if (isHoverDevice) {
    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);
  }

  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);
}


/* ════════════════════════════════════════════════════════════════
   2. CURSEUR PERSONNALISÉ
   Point or (suit la souris immédiatement) +
   anneau avec inertie (lag) — effet luxury.
   ════════════════════════════════════════════════════════════════ */
function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  const setCursorState = (cls, active) => {
    dot.classList.toggle(cls, active);
    ring.classList.toggle(cls, active);
  };

  let mouseX = window.innerWidth  / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX;
  let ringY  = mouseY;
  let moved  = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
    moved = true;
  }, { passive: true });

  const lerp = (a, b, t) => a + (b - a) * t;
  const animateRing = () => {
    if (moved) {
      ringX = lerp(ringX, mouseX, 0.11);
      ringY = lerp(ringY, mouseY, 0.11);
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      moved = Math.abs(ringX - mouseX) > 0.1 || Math.abs(ringY - mouseY) > 0.1;
    }
    requestAnimationFrame(animateRing);
  };
  animateRing();

  document.addEventListener('mouseleave', () => setCursorState('is-hidden', true));
  document.addEventListener('mouseenter', () => setCursorState('is-hidden', false));

  const hoverSel = 'a, button, .btn-gold, .btn-outline-gold, .member-card, .article-card, .event-card, .filter-btn, .value-card, .testimonial-card, label[for], input, textarea';
  document.querySelectorAll(hoverSel).forEach(el => {
    if (el._cursorBound) return;
    el._cursorBound = true;
    el.addEventListener('mouseenter', () => setCursorState('is-hovered', true));
    el.addEventListener('mouseleave', () => setCursorState('is-hovered', false));
  });

  document.addEventListener('mousedown', () => setCursorState('is-clicking', true));
  document.addEventListener('mouseup',   () => setCursorState('is-clicking', false));
}


/* ════════════════════════════════════════════════════════════════
   3. SCROLL HANDLERS (progress bar + navbar)
   Fusionnés en un seul listener pour éviter deux appels par event.
   ════════════════════════════════════════════════════════════════ */
function initScrollHandlers() {
  const bar = document.querySelector('.scroll-progress');
  const nav = document.getElementById('mainNav');

  const onScroll = () => {
    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Supprimé : initScrollProgress et initNavbar fusionnés dans initScrollHandlers */
function initNavbar() {}


/* ════════════════════════════════════════════════════════════════
   4. LIEN ACTIF dans la navbar
   ════════════════════════════════════════════════════════════════ */
function initActiveLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#mainNav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}


/* ════════════════════════════════════════════════════════════════
   5. SCROLL REVEAL — Intersection Observer
   ════════════════════════════════════════════════════════════════ */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}


/* ════════════════════════════════════════════════════════════════
   6. COMPTEURS ANIMÉS — Ease-out cubic
   ════════════════════════════════════════════════════════════════ */
function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-count'), 10);
  const suffix   = el.getAttribute('data-suffix') || '';
  const prefix   = el.getAttribute('data-prefix') || '';
  const duration = 2400;
  const t0       = performance.now();

  const tick = (now) => {
    const p     = Math.min((now - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.floor(eased * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}


/* ════════════════════════════════════════════════════════════════
   7. PARALLAXE HÉROS
   ════════════════════════════════════════════════════════════════ */
function initParallax() {
  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');
  const orb3 = document.querySelector('.hero-orb-3');
  if (!orb1) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        orb1.style.transform = `translateY(${y * 0.18}px)`;
        if (orb2) orb2.style.transform = `translateY(${y * 0.1}px)`;
        if (orb3) orb3.style.transform = `translateY(${y * 0.25}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}


/* ════════════════════════════════════════════════════════════════
   8. TILT 3D SUR LES CARDS
   ════════════════════════════════════════════════════════════════ */
function initCardTilt() {
  if (!isHoverDevice) return;

  const INTENSITY = 7;
  const LIFT_PX   = 8;

  document.querySelectorAll('.member-card, .value-card, .testimonial-card').forEach(card => {
    let leaveTimer = null;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left)  / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)   / rect.height - 0.5;

      card.classList.add('is-tilted');
      card.style.transform = `perspective(700px) rotateX(${-y * INTENSITY}deg) rotateY(${x * INTENSITY}deg) translateZ(${LIFT_PX}px)`;
      card.style.backgroundImage = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(201,168,76,0.07) 0%, transparent 65%)`;
    });

    card.addEventListener('mouseleave', () => {
      clearTimeout(leaveTimer);
      card.classList.remove('is-tilted');
      card.style.transform = '';
      card.style.backgroundImage = '';
      card.style.transition = 'transform 0.55s var(--ease-out), border-color 0.4s var(--ease), background-image 0.3s';
      leaveTimer = setTimeout(() => { card.style.transition = ''; }, 600);
    });
  });
}


/* ════════════════════════════════════════════════════════════════
   10. FILTRE MEMBRES
   ════════════════════════════════════════════════════════════════ */
function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const wraps = document.querySelectorAll('.member-card-wrapper');
  if (!btns.length || !wraps.length) return;

  const hideTimers = new WeakMap();

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const sector = btn.getAttribute('data-filter');

      wraps.forEach(wrap => {
        const match = sector === 'all' || wrap.getAttribute('data-sector') === sector;

        clearTimeout(hideTimers.get(wrap));

        if (match) {
          wrap.style.display = '';
          requestAnimationFrame(() => {
            wrap.style.opacity   = '1';
            wrap.style.transform = 'translateY(0) scale(1)';
          });
        } else {
          wrap.style.opacity   = '0';
          wrap.style.transform = 'translateY(16px) scale(0.97)';
          hideTimers.set(wrap, setTimeout(() => { wrap.style.display = 'none'; }, 320));
        }
      });
    });
  });
}


/* ════════════════════════════════════════════════════════════════
   11. FORMULAIRE DE CONTACT — Feedback visuel (mock)
   ════════════════════════════════════════════════════════════════ */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;

    btn.innerHTML         = '<span>Message envoyé ✓</span>';
    btn.style.background  = 'linear-gradient(135deg, #3a6b49, #4a7c59)';
    btn.style.borderColor = '#4a7c59';
    btn.disabled          = true;

    setTimeout(() => {
      btn.innerHTML         = orig;
      btn.style.background  = '';
      btn.style.borderColor = '';
      btn.disabled          = false;
      form.reset();
    }, 3500);
  });
}


/* ════════════════════════════════════════════════════════════════
   12. FERMETURE DU MENU MOBILE au clic sur un lien
   ════════════════════════════════════════════════════════════════ */
function initMobileNav() {
  const collapse = document.getElementById('navMenu');
  if (!collapse) return;

  document.querySelectorAll('#navMenu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const bs = window.bootstrap && bootstrap.Collapse.getInstance(collapse);
      if (bs) bs.hide();
    });
  });
}


/* ════════════════════════════════════════════════════════════════
   13. SCROLL DOUX pour les ancres internes (#...)
   ════════════════════════════════════════════════════════════════ */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
