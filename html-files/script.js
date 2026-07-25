/* =========================================================
   Youth Skills Development Initiative
   script.js — Core site behaviour
   Handles: mobile navigation, sticky navbar, active link
   highlighting, and the back-to-top button.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initStickyNavbar();
  initActiveLink();
  initBackToTop();
});

/* ---------------------------------------------------------
   1. Mobile navigation (hamburger menu)
   --------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('navMenu');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close the menu when a link is tapped (mobile UX)
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close the menu with the Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}

/* ---------------------------------------------------------
   2. Sticky navbar — adds a "scrolled" class once the page
      has been scrolled past a small threshold, so it can be
      styled (e.g. shadow, tighter padding) in CSS.
   --------------------------------------------------------- */
function initStickyNavbar() {
  const header = document.querySelector('header');
  if (!header) return;

  const THRESHOLD = 10;

  function onScroll() {
    if (window.scrollY > THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // set initial state on load
}

/* ---------------------------------------------------------
   3. Active link highlighting — keeps the "active" class in
      sync with the current page automatically, so you don't
      have to hand-edit it in every HTML file.
   --------------------------------------------------------- */
function initActiveLink() {
  const links = document.querySelectorAll('nav ul li a');
  let currentPage = window.location.pathname.split('/').pop();
  if (currentPage === '') currentPage = 'index.html';

  links.forEach(function (link) {
    const linkPage = link.getAttribute('href');
    const isActive = linkPage === currentPage;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

/* ---------------------------------------------------------
   4. Back-to-top button — appears after scrolling down,
      smooth-scrolls to the top when clicked.
   --------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const SHOW_AFTER = 300;

  function toggleVisibility() {
    btn.classList.toggle('visible', window.scrollY > SHOW_AFTER);
  }

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}