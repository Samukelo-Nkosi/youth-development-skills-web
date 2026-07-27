/* =========================================================
   animations.js — Scroll-triggered visual effects.
   Currently handles: animated stat counters (counts up from
   0 to their target number once they scroll into view).
   Built to be extended with fade-ins, etc. in later steps.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initStatCounters();
  initFadeInOnScroll();
  initTypingEffect();
});

/* ---------------------------------------------------------
   Fade-in on scroll — any element with class "fade-in" starts
   slightly translated and transparent, then animates to full
   opacity/position once it enters the viewport.
   --------------------------------------------------------- */
function initFadeInOnScroll() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  // Not supported in this browser? Leave content visible rather than risk
  // hiding it with no way to reveal it again.
  if (typeof IntersectionObserver === 'undefined') return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(function (el) {
    // Only hide the element once it's actually being observed —
    // guarantees anything hidden also has a way to become visible again.
    el.classList.add('fade-in-armed');
    observer.observe(el);
  });
}

/* ---------------------------------------------------------
   Typing effect — types out the text of an element with
   id="typingText" character by character, with a blinking
   cursor. Respects prefers-reduced-motion by just showing
   the full text instantly.
   --------------------------------------------------------- */
function initTypingEffect() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const fullText = el.textContent.trim();
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.setAttribute('aria-hidden', 'true');

  if (reduceMotion) {
    el.textContent = fullText;
    return;
  }

  el.textContent = '';
  el.appendChild(cursor);

  const CHAR_DELAY = 55; // ms per character
  let i = 0;

  function typeNext() {
    if (i < fullText.length) {
      cursor.insertAdjacentText('beforebegin', fullText.charAt(i));
      i++;
      setTimeout(typeNext, CHAR_DELAY);
    }
  }

  typeNext();
}

function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const DURATION = 1500; // ms

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      // Ease-out for a natural deceleration toward the target
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  // Only animate once each counter scrolls into view
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(function (counter) {
    observer.observe(counter);
  });
}