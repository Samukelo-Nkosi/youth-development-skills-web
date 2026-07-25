/* =========================================================
   validation.js — Client-side validation for the contact form
   Validates on blur (as the user leaves a field) and again
   on submit. Shows inline error messages under each field.
   ========================================================= */

(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: {
      el: document.getElementById('name'),
      errorEl: document.getElementById('nameError'),
      validate: function (value) {
        if (!value.trim()) return 'Please enter your name.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        return '';
      }
    },
    program: {
      el: document.getElementById('program'),
      errorEl: document.getElementById('programError'),
      validate: function (value) {
        if (!value.trim()) return 'Please tell us which program you\'re interested in.';
        return '';
      }
    },
    email: {
      el: document.getElementById('email'),
      errorEl: document.getElementById('emailError'),
      validate: function (value) {
        if (!value.trim()) return 'Please enter your email address.';
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      }
    },
    message: {
      el: document.getElementById('message'),
      errorEl: document.getElementById('messageError'),
      validate: function (value) {
        if (!value.trim()) return 'Please enter a message.';
        if (value.trim().length < 10) return 'Message should be at least 10 characters.';
        return '';
      }
    }
  };

  // Validate a single field and reflect the result in the UI
  function validateField(key) {
    const field = fields[key];
    const error = field.validate(field.el.value);

    if (error) {
      field.el.classList.add('invalid');
      field.el.setAttribute('aria-invalid', 'true');
      field.errorEl.textContent = error;
    } else {
      field.el.classList.remove('invalid');
      field.el.removeAttribute('aria-invalid');
      field.errorEl.textContent = '';
    }

    return !error;
  }

  // Validate on blur, and re-validate on input once a field has an error
  // (so the message clears as soon as the user fixes it)
  Object.keys(fields).forEach(function (key) {
    const field = fields[key];
    field.el.addEventListener('blur', function () {
      validateField(key);
    });
    field.el.addEventListener('input', function () {
      if (field.el.classList.contains('invalid')) {
        validateField(key);
      }
    });
  });

  // Expose a single function contact.js can call before submitting
  window.validateContactForm = function () {
    let allValid = true;
    Object.keys(fields).forEach(function (key) {
      if (!validateField(key)) allValid = false;
    });
    return allValid;
  };
})();