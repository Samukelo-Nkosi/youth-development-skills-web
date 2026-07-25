/* =========================================================
   animations.js — Scroll-triggered visual effects.
   Currently handles: animated stat counters (counts up from
   0 to their target number once they scroll into view).
   Built to be extended with fade-ins, etc. in later steps.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initStatCounters();
  initFadeInOnScroll();
});

/* ---------------------------------------------------------
   Fade-in on scroll — any element with class "fade-in" starts
   slightly translated and transparent, then animates to full
   opacity/position once it enters the viewport.
   --------------------------------------------------------- */
function initFadeInOnScroll() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(function (el) {
    observer.observe(el);
  });
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