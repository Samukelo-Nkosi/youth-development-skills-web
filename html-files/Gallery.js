/* =========================================================
   gallery.js — Lightbox for the photo gallery on the About page.
   Clicking a thumbnail opens a larger version in a full-screen
   overlay. Closes via the close button, Escape key, or clicking
   the backdrop. Keeps focus management sane for keyboard users.
   ========================================================= */

(function () {
  const lightbox = document.getElementById('lightbox');
  const items = document.querySelectorAll('.gallery-item');
  if (!lightbox || !items.length) return;

  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');

  let lastFocusedElement = null;

  function openLightbox(item) {
    const fullSrc = item.getAttribute('data-full');
    const caption = item.getAttribute('data-caption') || '';
    const thumbImg = item.querySelector('img');

    lightboxImage.src = fullSrc;
    lightboxImage.alt = thumbImg ? thumbImg.alt : caption;
    lightboxCaption.textContent = caption;

    lastFocusedElement = item;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden'; // prevent background scroll
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.src = '';
    document.body.style.overflow = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  items.forEach(function (item) {
    item.addEventListener('click', function () {
      openLightbox(item);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  // Click on the backdrop (but not the image or caption) closes it
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !lightbox.hidden) {
      closeLightbox();
    }
  });
})();