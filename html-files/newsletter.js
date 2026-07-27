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
  const submitBtn = document.getElementById('newsletterSubmitBtn');

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

  function setLoading(isLoading) {
    if (submitBtn) submitBtn.disabled = isLoading;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Same honeypot pattern as contact.js: don't actually send anything
    // if the hidden field was filled in, but still show success so a
    // legitimate visitor caught by autofill isn't left with no feedback.
    const honeypot = form.querySelector('input[name="nl-bot-field"]');
    if (honeypot && honeypot.value) {
      showStatus('Thanks for subscribing!', 'success');
      form.reset();
      return;
    }

    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);

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
      })
      .finally(function () {
        setLoading(false);
      });
  });
})();