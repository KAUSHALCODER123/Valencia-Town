/* Valencia Town landing page */
(function () {
  'use strict';

  // ---- Edit these before going live ----
  var CONFIG = {
    phone: '919999999999',          // country code + number, digits only
    phoneLabel: '+91 99999 99999',
    whatsapp: '919999999999',
    whatsappText: 'Hi, I am interested in Valencia Town plots on Indore–Ujjain Road. Please share price and plot sizes.',
    rera: '',                       // e.g. 'P-IND-26-1234'. Empty shows "Applied / TBA"
    formEndpoint: ''                // CRM / Google Apps Script / webhook URL. Empty = lead is sent via WhatsApp
  };

  document.documentElement.classList.add('js');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  window.dataLayer = window.dataLayer || [];
  function track(event, data) {
    window.dataLayer.push(Object.assign({ event: event }, data || {}));
    if (typeof window.fbq === 'function' && event === 'generate_lead') window.fbq('track', 'Lead');
  }

  // Contact links from CONFIG
  var waUrl = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(CONFIG.whatsappText);
  $$('.js-wa').forEach(function (a) { a.href = waUrl; });
  $$('.js-call').forEach(function (a) { a.href = 'tel:+' + CONFIG.phone; });
  $$('.js-phone-label').forEach(function (el) { el.textContent = CONFIG.phoneLabel; });
  if (CONFIG.rera) $$('.js-rera').forEach(function (el) { el.textContent = CONFIG.rera; el.classList.remove('tbd'); });
  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  // CTA click tracking
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-cta]');
    if (el) track('cta_click', { cta: el.getAttribute('data-cta') });
  });

  // Header: solid on scroll
  var header = $('.header');
  var onScroll = function () { header.classList.toggle('is-solid', window.scrollY > 40); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  var burger = $('#burger'), nav = $('#nav');
  function closeNav() { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  // UTM / click-id capture (kept for the session)
  var params = new URLSearchParams(location.search);
  var attribution = {};
  try { attribution = JSON.parse(sessionStorage.getItem('vt_attr') || '{}'); } catch (e) {}
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach(function (k) {
    if (params.get(k)) attribution[k] = params.get(k);
  });
  try { sessionStorage.setItem('vt_attr', JSON.stringify(attribution)); } catch (e) {}

  function postJSON(url, body) {
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json().catch(function () { return {}; }); });
  }

  // Lead forms
  var phoneRe = /^[6-9]\d{9}$/;

  $$('.js-lead').forEach(function (form) {
    var phone = form.elements.phone, name = form.elements.name;
    var msg = $('.form__msg', form);

    function say(text, type) { msg.className = 'form__msg ' + (type || ''); msg.textContent = text; }
    phone.addEventListener('input', function () { phone.value = phone.value.replace(/\D/g, '').slice(0, 10); });

    function collect() {
      return Object.assign({
        name: name.value.trim(),
        phone: '+91' + phone.value,
        interest: form.elements.interest.value,
        source: form.elements.source.value,
        page: location.href.split('?')[0],
        submitted_at: new Date().toISOString()
      }, attribution);
    }

    function finish(data) {
      track('generate_lead', { form: data.source });
      say('Thank you, ' + data.name.split(' ')[0] + '! Our team will contact you shortly.', 'ok');
      form.reset();
    }

    function sendLead(data) {
      if (CONFIG.formEndpoint) {
        return postJSON(CONFIG.formEndpoint, data).then(function () { finish(data); })
          .catch(function () { say('Something went wrong. Please call or WhatsApp us.', 'err'); });
      }
      // No endpoint yet: hand the enquiry over on WhatsApp
      var text = 'New enquiry – Valencia Town\nName: ' + data.name + '\nMobile: ' + data.phone + '\nLooking for: ' + data.interest;
      window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      finish(data);
      return Promise.resolve();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      [name, phone].forEach(function (f) { f.classList.remove('invalid'); });
      if (name.value.trim().length < 2) { name.classList.add('invalid'); ok = false; }
      if (!phoneRe.test(phone.value)) { phone.classList.add('invalid'); ok = false; }
      if (!ok) { say('Please enter your name and a valid 10-digit mobile number.', 'err'); return; }

      var btn = $('button[type="submit"]', form);
      btn.disabled = true;
      sendLead(collect()).then(function () { btn.disabled = false; });
    });

  });

  // Video: load only when the visitor clicks play
  var vf = $('#videoFacade');
  if (vf) vf.addEventListener('click', function () {
    var v = document.createElement('video');
    v.src = vf.getAttribute('data-src'); v.controls = true; v.autoplay = true; v.playsInline = true;
    v.poster = $('img', vf).src; v.width = 832; v.height = 464;
    v.setAttribute('aria-label', '3D walkthrough of Valencia Town');
    vf.replaceWith(v);
    track('video_play', { video: '3d_walkthrough' });
  });

  // Map: load the Google Maps iframe only on click (keeps page fast)
  var mf = $('#mapFacade');
  if (mf) mf.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = mf.getAttribute('data-src'); f.title = 'Map: Valencia Town, Shahna, Indore–Ujjain Road';
    f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.allowFullscreen = true;
    mf.replaceWith(f);
    track('map_open');
  });

  // Gallery lightbox
  var lb = $('#lightbox'), lbImg = $('img', lb);
  var items = $$('#galleryGrid a'), current = 0;
  function show(i) {
    current = (i + items.length) % items.length;
    lbImg.src = items[current].href;
    lbImg.alt = $('img', items[current]).alt;
  }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; items[current].focus(); }
  items.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); show(i); lb.hidden = false; document.body.style.overflow = 'hidden';
      $('.lightbox__close', lb).focus();
    });
  });
  $('.lightbox__close', lb).addEventListener('click', closeLb);
  $('.lightbox__prev', lb).addEventListener('click', function () { show(current - 1); });
  $('.lightbox__next', lb).addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  var sx = 0;
  lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
  });
})();
