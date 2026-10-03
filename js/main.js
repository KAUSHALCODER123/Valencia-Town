/* Valencia Town landing page */
(function () {
  'use strict';

  // ---- Edit these before going live ----
  var CONFIG = {
    phone: '919999999999',          // country code + number, digits only
    phoneLabel: '+91 99999 99999',
    whatsapp: '919999999999',
    whatsappText: 'Hi, I am interested in Valencia Town plots on Indore–Ujjain Road. Please share price and plot sizes.',
    rera: '',                       // e.g. 'P-IND-26-1234'. Empty shows "Applied"
    formEndpoint: 'https://script.google.com/macros/s/AKfycbwnNCz74HjqDYzwVD0q0TPSB8Cw9Yr-FzU9EmfDq0XTHyniRTZDg1wej91xEWx1Qvk0/exec'                // Google Apps Script web app URL (see apps-script/README.md). Empty = lead is sent via WhatsApp
  };

  document.documentElement.classList.add('js');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  if (CONFIG.rera) $$('.js-rera').forEach(function (el) { el.textContent = CONFIG.rera; el.classList.remove('muted'); });
  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  // CTA click tracking
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-cta]');
    if (el) track('cta_click', { cta: el.getAttribute('data-cta') });
  });

  // Header (solid after hero, hides on scroll down), progress bar, mobile bar
  var header = $('.header'), bar = $('#progress'), mbar = $('.mbar'), nav = $('#nav');
  var enquire = $('#enquire'), lastY = window.scrollY, ticking = false;
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('is-solid', y > 40);
    header.classList.toggle('is-hidden', y > lastY && y > 400 && !nav.classList.contains('is-open'));
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (mbar && enquire) {
      var r = enquire.getBoundingClientRect();
      mbar.classList.toggle('is-hidden', r.top < innerHeight * 0.6 && r.bottom > 0);
    }
    lastY = y; ticking = false;
  }
  onScroll();
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  // Mobile menu
  var burger = $('#burger');
  function setNav(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  burger.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });

  // Observers: image reveals, current nav item, stat count-up
  if ('IntersectionObserver' in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    $$('.reveal-img').forEach(function (el) { revealIO.observe(el); });

    var links = {};
    $$('a[href^="#"]', nav).forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = links[en.target.id];
        if (a && !a.classList.contains('nav__cta')) a.classList.toggle('is-current', en.isIntersecting);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) navIO.observe(s); });
  } else {
    $$('.reveal-img').forEach(function (el) { el.classList.add('is-in'); });
  }

  function countUp(el) {
    var end = +el.getAttribute('data-count'), pre = el.getAttribute('data-prefix') || '';
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(end * eased).toLocaleString('en-IN');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (!reduceMotion) setTimeout(function () { $$('[data-count]').forEach(countUp); }, 350);

  // Amenities: hover/tap a row to swap the picture
  var amenView = $('.amen__view'), amenImg = $('#amenImg'), amenCap = $('#amenCap');
  var amenRows = $$('.amen__list li[data-img]');
  function showAmen(li) {
    if (li.classList.contains('is-active')) return;
    amenRows.forEach(function (r) { r.classList.remove('is-active'); });
    li.classList.add('is-active');
    var src = li.getAttribute('data-img'), alt = li.getAttribute('data-alt'), label = $('b', li).textContent;
    var pre = new Image();
    pre.onload = function () {
      amenView.classList.add('is-swapping');
      setTimeout(function () {
        amenImg.src = src; amenImg.alt = alt; amenCap.textContent = label;
        amenView.classList.remove('is-swapping');
      }, reduceMotion ? 0 : 250);
    };
    pre.src = src;
  }
  amenRows.forEach(function (li) {
    li.addEventListener('mouseenter', function () { showAmen(li); });
    li.addEventListener('focus', function () { showAmen(li); });
    li.addEventListener('click', function () {
      showAmen(li);
      if (innerWidth < 900) amenView.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
  });
  if (amenRows[0]) amenRows[0].classList.add('is-active');

  // FAQ: animate open/close height
  $$('.faq details').forEach(function (d) {
    var sum = $('summary', d), body = $('div', d);
    sum.addEventListener('click', function (e) {
      if (reduceMotion || !body.animate) return;
      e.preventDefault();
      if (d.open) {
        var a = body.animate([{ height: body.offsetHeight + 'px' }, { height: '0px' }], { duration: 280, easing: 'ease' });
        a.onfinish = function () { d.open = false; };
      } else {
        d.open = true;
        body.animate([{ height: '0px' }, { height: body.offsetHeight + 'px' }], { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' });
      }
    });
  });

  // UTM / click-id capture (kept for the session)
  var params = new URLSearchParams(location.search);
  var attribution = {};
  try { attribution = JSON.parse(sessionStorage.getItem('vt_attr') || '{}'); } catch (e) {}
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach(function (k) {
    if (params.get(k)) attribution[k] = params.get(k);
  });
  try { sessionStorage.setItem('vt_attr', JSON.stringify(attribution)); } catch (e) {}

  // Lead forms
  var phoneRe = /^[6-9]\d{9}$/;
  $$('.js-lead').forEach(function (form) {
    var phone = form.elements.phone, name = form.elements.name;
    var msg = $('.form__msg', form), btn = $('button[type="submit"]', form), label = $('.btn__label', btn);
    var labelText = label.textContent;

    function say(text, type) { msg.className = 'form__msg ' + (type || ''); msg.textContent = text; }
    function mark(input, bad) {
      var f = input.closest('.field');
      f.classList.remove('invalid');
      if (bad) { void f.offsetWidth; f.classList.add('invalid'); }
    }
    phone.addEventListener('input', function () { phone.value = phone.value.replace(/\D/g, '').slice(0, 10); });

    function loading(on) {
      btn.classList.toggle('is-loading', on);
      btn.disabled = on;
      label.textContent = on ? 'Sending…' : labelText;
    }

    function finish(data) {
      track('generate_lead', { form: data.source });
      say('Thanks, ' + data.name.split(' ')[0] + '. We\'ll call you shortly.', 'ok');
      form.reset();
      loading(false);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var badName = name.value.trim().length < 2, badPhone = !phoneRe.test(phone.value);
      mark(name, badName); mark(phone, badPhone);
      if (badName || badPhone) {
        say(badPhone && !badName ? 'Please enter a 10-digit mobile number.' : 'Please add your name and mobile number.', 'err');
        (badName ? name : phone).focus();
        return;
      }

      var data = Object.assign({
        name: name.value.trim(),
        phone: '+91' + phone.value,
        interest: form.elements.interest.value,
        source: form.elements.source.value,
        page: location.href.split('?')[0],
        submitted_at: new Date().toISOString()
      }, attribution);

      if (form.elements.website && form.elements.website.value) return; // bot filled the hidden field

      loading(true); say('');
      if (CONFIG.formEndpoint) {
        // Sent as text/plain so Apps Script accepts it without a CORS preflight
        fetch(CONFIG.formEndpoint, { method: 'POST', body: JSON.stringify(data) })
          .then(function (r) { return r.json(); })
          .then(function (res) { if (!res.ok) throw new Error(res.error || 'failed'); finish(data); })
          .catch(function () { loading(false); say('That didn\'t go through. Please call or WhatsApp us.', 'err'); });
      } else {
        // No endpoint yet: hand the enquiry over on WhatsApp
        var text = 'New enquiry – Valencia Town\nName: ' + data.name + '\nMobile: ' + data.phone + '\nLooking for: ' + data.interest;
        window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
        finish(data);
      }
    });
  });

  // Floating WhatsApp: show the label once after 20s
  var waFloat = $('.wa-float');
  if (waFloat) setTimeout(function () {
    waFloat.classList.add('is-nudge');
    setTimeout(function () { waFloat.classList.remove('is-nudge'); }, 4000);
  }, 20000);

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

  // Map: load the Google Maps iframe only on click
  var mf = $('#mapFacade');
  if (mf) mf.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = mf.getAttribute('data-src'); f.title = 'Map: Valencia Town, Shahna, Indore–Ujjain Road';
    f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.allowFullscreen = true;
    mf.replaceWith(f);
    track('map_open');
  });

  // Gallery lightbox
  var lb = $('#lightbox'), lbImg = $('img', lb), lbCap = $('figcaption', lb);
  var items = $$('#galleryGrid a'), current = 0;
  function show(i) {
    current = (i + items.length) % items.length;
    var a = items[current];
    lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = '';
    lbImg.src = a.href; lbImg.alt = $('img', a).alt;
    lbCap.textContent = ($('span', a) || {}).textContent || '';
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
