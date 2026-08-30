// The Process Guy — shared site behavior. Vanilla JS, no dependencies.

document.addEventListener('DOMContentLoaded', function () {

  /* ---- mobile nav toggle ---- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---- footer year ---- */
  var yearEls = document.querySelectorAll('#year');
  yearEls.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- form handling (demo only — no backend wired up) ----
     Validates required fields, then redirects to thank-you.html
     with a "source" param so that page can tailor its message. */
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field');
        var isEmail = input.type === 'email';
        var value = input.value.trim();
        var ok = value.length > 0 && (!isEmail || /^\S+@\S+\.\S+$/.test(value));
        if (field) field.classList.toggle('invalid', !ok);
        if (!ok) valid = false;
      });

      if (!valid) return;

      var source = form.getAttribute('data-demo-form') || 'form';
      sessionStorage.setItem('lead_submitted', '1');
      window.location.href = 'thankyou.html?source=' + encodeURIComponent(source);
    });

    // clear error state as the person fixes a field
    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field) field.classList.remove('invalid');
      });
    });
  });

  /* ---- thank-you page: tailor message to where the visitor came from ---- */
  var thanksMsg = document.getElementById('thanksMessage');
  if (thanksMsg) {
    var params = new URLSearchParams(window.location.search);
    var source = params.get('source');
    if (source === 'checklist') {
      thanksMsg.textContent = "Your Business Process Checklist is on its way — check your inbox in the next few minutes.";
    } else if (source === 'contact') {
      thanksMsg.textContent = "We've received your message and will get back to you within one business day.";
    }
  }
});