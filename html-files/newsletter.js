/* =========================================================
   newsletter.js — Handles the footer newsletter signup form.
   Submits to Netlify Forms via AJAX, same pattern as contact.js,
   so subscriptions land in the same Netlify dashboard under a
   separate "newsletter" form.
   ========================================================= */

(function () {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  const statusEl = document.getElementById('newsletterStatus');
  const emailInput = document.getElementById('newsletterEmail');

  function encode(data) {
    return Object.keys(data)
      .map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
      })
      .join('&');
  }

  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'newsletter-status ' + type;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    const formData = new FormData(form);
    const payload = {};
    formData.forEach(function (value, key) {
      payload[key] = value;
    });

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode(payload)
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Network response was not ok');
        showStatus('Thanks for subscribing!', 'success');
        form.reset();
      })
      .catch(function () {
        showStatus('Something went wrong. Please try again later.', 'error');
      });
  });
})();