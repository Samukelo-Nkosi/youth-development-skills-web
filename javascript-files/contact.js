/* =========================================================
   contact.js — Handles submission of the contact form to
   Netlify Forms via AJAX (no full page reload).

   How it works:
   - The form has data-netlify="true" and a hidden "form-name"
     field, so Netlify detects and registers it automatically
     when the site is deployed/built.
   - On submit, we prevent the default page reload, run
     validation (validation.js), then POST the encoded form
     data to "/" — which is what Netlify's form handler expects.
   ========================================================= */

(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const statusEl = document.getElementById('formStatus');

  // Encodes form data the way Netlify's form endpoint expects
  function encode(data) {
    return Object.keys(data)
      .map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
      })
      .join('&');
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle('loading', isLoading);
  }

  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'form-status ' + type;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Don't submit anything if the honeypot field was filled in (bot)
    const honeypot = form.querySelector('input[name="bot-field"]');
    if (honeypot && honeypot.value) {
      return;
    }

    // Run validation.js checks before sending
    if (typeof window.validateContactForm === 'function') {
      const isValid = window.validateContactForm();
      if (!isValid) {
        showStatus('Please fix the errors above before sending.', 'error');
        return;
      }
    }

    setLoading(true);
    showStatus('', '');

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
        showStatus('Thanks for reaching out! We\'ll get back to you soon.', 'success');
        form.reset();
      })
      .catch(function () {
        showStatus('Something went wrong. Please try again, or email us directly.', 'error');
      })
      .finally(function () {
        setLoading(false);
      });
  });
})();