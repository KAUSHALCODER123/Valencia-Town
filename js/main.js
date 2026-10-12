/* Valencia Town. Generated from js/parts by scripts/build.py; edit the parts. */
(() => {
'use strict';
/* 00-core.js */
/* Core: works with or without the motion layer. Dialogs, enquiry form, map, masterplan viewer, gallery viewer, FAQ, progress. */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const project = JSON.parse($('#project-data').textContent);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const isDesktop = matchMedia('(min-width: 1024px)');
const html = document.documentElement;
window.dataLayer = window.dataLayer || [];
const track = (event, extra = {}) => window.dataLayer.push({event, ...extra});
const hooks = {dialogOpen: [], dialogClose: [], scrollTo: null};
const scrollToTarget = target => hooks.scrollTo ? hooks.scrollTo(target) : target.scrollIntoView({behavior: reduceMotion.matches ? 'auto' : 'smooth'});
$('#year').textContent = new Date().getFullYear();

/* Dialogs. Native <dialog> traps focus and makes the page inert; Escape always closes. */
const openDialog = dialog => {
  if (dialog.open) return;
  dialog._opener = document.activeElement;
  dialog.showModal(); document.body.classList.add('modal-open');
  hooks.dialogOpen.forEach(fn => fn(dialog));
};
const closeDialog = dialog => dialog.close();
$$('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target.closest('[data-close]')) closeDialog(dialog);
    if (event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog(dialog);
    }
  });
  dialog.addEventListener('close', () => {
    const stillOpen = !!$('dialog[open]');
    document.body.classList.toggle('modal-open', stillOpen);
    if (!stillOpen) hooks.dialogClose.forEach(fn => fn(dialog));
    if (dialog._opener?.isConnected) dialog._opener.focus({preventScroll: true});
  });
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const open = $$('dialog[open]').pop(); if (open) { event.preventDefault(); closeDialog(open); }
});

/* Menu: the same labels as the footer nav. */
const menu = $('#menu');
const menuToggle = $('.menu-toggle');
menuToggle.addEventListener('click', () => openDialog(menu));
menu.addEventListener('close', () => menuToggle.setAttribute('aria-expanded', 'false'));
hooks.dialogOpen.push(d => { if (d === menu) menuToggle.setAttribute('aria-expanded', 'true'); });
menuToggle.setAttribute('aria-expanded', 'false');
document.addEventListener('click', event => {
  const a = event.target.closest('a[href^="#"]');
  if (!a || a.getAttribute('href') === '#') { if (a?.getAttribute('aria-disabled')) event.preventDefault(); return; }
  const target = document.getElementById(a.getAttribute('href').slice(1)); if (!target) return;
  event.preventDefault();
  const go = () => { scrollToTarget(target); history.replaceState(null, '', a.getAttribute('href')); };
  if (menu.open) { menu.close(); requestAnimationFrame(go); } else go();
});

/* Enquiry: every CTA opens one form. data-enquiry lists the boxes to pre-tick. */
const enquiry = $('#enquiry-modal');
const form = $('#enquiry-form');
const status = $('#form-status');
const boxes = $$('input[name="interest"]', form);
let submitting = false;
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-enquiry]');
  if (trigger) {
    if (menu.open) menu.close();
    if (!submitting) {
      form.hidden = false; $('#enquiry-success').hidden = true; status.textContent = '';
      const wanted = trigger.dataset.enquiry.split(',');
      boxes.forEach(box => { box.checked = wanted.includes(box.value); });
    }
    openDialog(enquiry);
    track('cta_click', {cta: trigger.dataset.enquiry});
  }
  if (event.target.closest('[data-privacy]')) openDialog($('#privacy-modal'));
  if (event.target.closest('[data-terms]')) openDialog($('#terms-modal'));
  const mapButton = event.target.closest('[data-load-map]');
  if (mapButton) {
    const frame = document.createElement('iframe');
    frame.src = 'https://www.google.com/maps?q=' + project.mapsQuery + '&z=11&output=embed';
    frame.title = project.mapTitle; frame.loading = 'lazy'; frame.referrerPolicy = 'no-referrer-when-downgrade'; frame.allowFullscreen = true;
    mapButton.replaceWith(frame); track('map_load');
  }
});

/* Attribution stays tab-local; personal field values never go to analytics. */
const keys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'];
let attribution = {};
try { attribution = JSON.parse(sessionStorage.getItem('valencia-attribution') || '{}'); } catch {}
const params = new URLSearchParams(location.search);
keys.forEach(key => { if (params.has(key)) attribution[key] = params.get(key).slice(0, 200); });
try { sessionStorage.setItem('valencia-attribution', JSON.stringify(attribution)); } catch {}
const cleanPhone = value => String(value || '').replace(/\D/g, '');
const fieldError = (field, message) => {
  const id = field.id + '-error'; let note = document.getElementById(id);
  if (!note) { note = document.createElement('small'); note.id = id; note.className = 'field-error'; note.setAttribute('role', 'alert'); (field.closest('.phone-field') || field).insertAdjacentElement('afterend', note); }
  note.textContent = message; note.hidden = !message;
  field.classList.toggle('is-invalid', !!message); field.setAttribute('aria-invalid', String(!!message));
  const described = [field.getAttribute('aria-describedby'), message ? id : null].filter(Boolean); if (described.length) field.setAttribute('aria-describedby', [...new Set(described)].join(' '));
  if (message) field.focus();
};
['name','phone','email'].forEach(key => form.elements[key].addEventListener('input', () => fieldError(form.elements[key], '')));
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting || form.elements.website.value) return;
  const name = form.elements.name.value.trim();
  let number = cleanPhone(form.elements.phone.value);
  if (number.length === 12 && number.startsWith('91')) number = number.slice(2);
  const email = form.elements.email.value.trim();
  if (name.length < 2) { fieldError(form.elements.name, 'May we have your full name?'); return; }
  if (!/^[6-9]\d{9}$/.test(number)) { fieldError(form.elements.phone, 'A 10-digit Indian mobile number, please, so the team can reach you.'); return; }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { fieldError(form.elements.email, 'That email address does not look complete.'); return; }
  if (!project.formEndpoint) { status.textContent = 'Online requests are currently unavailable. Please try again later.'; return; }
  const chosen = boxes.filter(box => box.checked).map(box => box.value);
  const interest = chosen.join(', ') || 'General enquiry';
  const submit = $('button[type="submit"]', form);
  submitting = true; submit.disabled = true; submit.textContent = 'Sending your request…'; status.textContent = '';
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const payload = {name, phone: '+91' + number, email, preferred_time: form.elements.preferredTime.value, interest, source: 'private-visit-modal', page: location.origin + location.pathname, submitted_at: new Date().toISOString(), website: '', ...attribution};
    const response = await fetch(project.formEndpoint, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=UTF-8'}, body: JSON.stringify(payload), signal: controller.signal});
    if (!response.ok) throw new Error('HTTP failure');
    const result = await response.json();
    if (result.ok !== true) throw new Error('Request not acknowledged');
    const offer = (id, wanted, url) => { const a = $(id); a.hidden = !(wanted && url); if (!a.hidden) a.href = url; };
    offer('#success-brochure', chosen.includes('Brochure'), project.brochureUrl);
    offer('#success-layout', chosen.includes('Layout'), project.layoutUrl);
    const next = $('#success-whatsapp'); next.hidden = !project.whatsapp;
    if (!next.hidden) next.href = project.whatsapp.split('?')[0] + '?text=' + encodeURIComponent('Hello, I am ' + name + '. I just sent a request about ' + interest.toLowerCase() + ' at Valencia Town.');
    form.hidden = true; $('#enquiry-success').hidden = false;
    $('#enquiry-success').setAttribute('tabindex', '-1'); $('#enquiry-success').focus();
    track('generate_lead', {form: 'private-visit-modal'}); form.reset();
  } catch {
    status.textContent = 'We could not confirm receipt. Your details are still here. Please try again in a moment.';
  } finally {
    clearTimeout(timeout); submitting = false; submit.disabled = false; submit.textContent = 'Send request';
  }
});

/* Masterplan viewer: zoom, pan, pinch. */
const pan = $('.plan-pan'), zoomImage = $('#zoom-image');
let zoom = 1;
function setZoom(value, anchorX = pan.clientWidth / 2, anchorY = pan.clientHeight / 2) {
  const next = Math.max(1, Math.min(2, value)); /* raise to 4 when a 3000px+ plan is supplied */ const ratio = next / zoom;
  const left = (pan.scrollLeft + anchorX) * ratio - anchorX;
  const top = (pan.scrollTop + anchorY) * ratio - anchorY;
  zoom = next; zoomImage.style.width = (zoom * 100) + '%';
  pan.scrollLeft = left; pan.scrollTop = top; $('#zoom-level').textContent = Math.round(zoom * 100) + '%';
}
$$('[data-open-plan]').forEach(button => button.addEventListener('click', () => { openDialog($('#plan-modal')); setZoom(1); pan.scrollTo(0, 0); }));
$$('[data-zoom]').forEach(button => button.addEventListener('click', () => setZoom(button.dataset.zoom === 'reset' ? 1 : zoom + (button.dataset.zoom === 'in' ? .5 : -.5))));
pan.addEventListener('keydown', event => {
  if (['+','=','-','0'].includes(event.key)) { event.preventDefault(); setZoom(event.key === '0' ? 1 : zoom + (event.key === '-' ? -.5 : .5)); }
});
const pointers = new Map(); let previousDistance = 0;
pan.addEventListener('pointerdown', e => { pointers.set(e.pointerId, {x: e.clientX, y: e.clientY}); pan.setPointerCapture(e.pointerId); pan.classList.add('dragging'); previousDistance = 0; });
pan.addEventListener('pointermove', e => {
  if (!pointers.has(e.pointerId)) return;
  const previous = pointers.get(e.pointerId); pointers.set(e.pointerId, {x: e.clientX, y: e.clientY});
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()]; const distance = Math.hypot(a.x - b.x, a.y - b.y);
    if (previousDistance) { const r = pan.getBoundingClientRect(); setZoom(zoom * distance / previousDistance, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top); }
    previousDistance = distance;
  } else { pan.scrollLeft -= e.clientX - previous.x; pan.scrollTop -= e.clientY - previous.y; }
});
['pointerup','pointercancel','lostpointercapture'].forEach(type => pan.addEventListener(type, e => { pointers.delete(e.pointerId); previousDistance = 0; if (!pointers.size) pan.classList.remove('dragging'); }));

/* Gallery viewer (opened from the "A closer look" strip). */
const gallery = $('#gallery-modal'); let galleryItems = []; let galleryIndex = 0;
function showGallery(index) {
  galleryIndex = (index + galleryItems.length) % galleryItems.length;
  const source = $('img', galleryItems[galleryIndex]);
  $('#gallery-image').src = source.currentSrc || source.getAttribute('src'); $('#gallery-image').alt = source.alt;
  $('#gallery-caption').textContent = galleryItems[galleryIndex].dataset.caption || source.alt;
  $('#gallery-count').textContent = (galleryIndex + 1) + ' / ' + galleryItems.length;
}
const openGallery = (items, index) => { galleryItems = items; showGallery(index); openDialog(gallery); };
$('[data-gallery-prev]').addEventListener('click', () => showGallery(galleryIndex - 1));
$('[data-gallery-next]').addEventListener('click', () => showGallery(galleryIndex + 1));
gallery.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); showGallery(galleryIndex + (e.key === 'ArrowLeft' ? -1 : 1)); }
});
let startX = 0, startY = 0;
$('.gallery-viewer').addEventListener('touchstart', e => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; }, {passive: true});
$('.gallery-viewer').addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - startX, dy = e.changedTouches[0].clientY - startY;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) showGallery(galleryIndex + (dx < 0 ? 1 : -1));
}, {passive: true});

/* Page state: past the hero, at the footer, overall progress and the current chapter. */
const hero = $('#top');
const footerEl = $('#contact');
const chapters = $$('[data-chapter]');
const hudNum = $('.hud-num b'), hudName = $('.hud-name');
const fills = $$('.hud-line i, .progress-top i');
const heroFill = $('.hero-prog i');
let pageTicking = false;
function updatePage() {
  pageTicking = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  fills.forEach(i => { i.style.transform = (i.parentElement.classList.contains('hud-line') ? 'scaleY(' : 'scaleX(') + p.toFixed(4) + ')'; });
  if (heroFill) heroFill.style.transform = 'scaleX(' + Math.min(1, scrollY / (hero.offsetHeight * .8)).toFixed(3) + ')';
  html.classList.toggle('is-past-hero', hero.getBoundingClientRect().bottom < innerHeight * .35);
  html.classList.toggle('is-at-footer', footerEl.getBoundingClientRect().top < innerHeight * .9);
  const mid = innerHeight * .5;
  const current = chapters.filter(el => el.getBoundingClientRect().top <= mid).pop() || chapters[0];
  if (current && hudNum.textContent !== current.dataset.chapter.padStart(2, '0')) {
    hudNum.textContent = current.dataset.chapter.padStart(2, '0'); hudName.textContent = current.dataset.name;
  }
}
const requestPage = () => { if (!pageTicking) { pageTicking = true; requestAnimationFrame(updatePage); } };
addEventListener('scroll', requestPage, {passive: true}); addEventListener('resize', requestPage); updatePage();

/* Hero film: loads only after the first interaction or when the browser is idle; never plays sound unasked. */
const heroFilm = $('.hero-film');
if (heroFilm && !reduceMotion.matches) {
  const load = () => { if (heroFilm.src) return; heroFilm.src = heroFilm.dataset.src; heroFilm.play().then(() => heroFilm.classList.add('is-playing')).catch(() => {}); };
  ['pointerdown','keydown','scroll'].forEach(t => addEventListener(t, load, {once: true, passive: true}));
  ('requestIdleCallback' in window) ? requestIdleCallback(load, {timeout: 4000}) : setTimeout(load, 3000);
  $('[data-sound]')?.addEventListener('click', e => { load(); heroFilm.muted = !heroFilm.muted; e.currentTarget.setAttribute('aria-pressed', String(!heroFilm.muted)); });
}
const film = $('#film-modal');
if (film) {
  const video = $('video', film);
  $('[data-open-film]')?.addEventListener('click', () => { openDialog(film); if (!video.getAttribute('src')) video.src = video.dataset.src; video.play().catch(() => {}); track('video_play', {video: 'film'}); });
  film.addEventListener('close', () => { video.pause(); });
}

/* 05-motion.js */
/* Motion layer: GSAP + ScrollTrigger + Lenis. One ease everywhere; scrubbed tweens use ease "none".
   Chapters register with motion() (any width) or motionDesktop() (≥1024px only: pinning, horizontal scroll).
   Everything runs inside gsap.matchMedia so prefers-reduced-motion leaves the page static and fully visible. */
const EASE = 'expo.out';
const motionFns = [], desktopFns = [];
const motion = fn => motionFns.push(fn);
const motionDesktop = fn => desktopFns.push(fn);
const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const finishIntro = () => { html.classList.remove('intro', 'pre'); try { sessionStorage.setItem('vt-intro', '1'); } catch {} };
let lenis = null;
if (!hasGsap) finishIntro();
else gsap.registerPlugin(ScrollTrigger);

/* Lenis smooth scroll, only when motion is welcome. */
function startLenis() {
  if (typeof window.Lenis === 'undefined') return;
  lenis = new Lenis({duration: 1.15, easing: t => 1 - Math.pow(2, -10 * t), smoothWheel: true});
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  hooks.scrollTo = target => lenis.scrollTo(target, {duration: 1.4});
  hooks.dialogOpen.push(() => lenis.stop());
  hooks.dialogClose.push(() => lenis.start());
  $$('dialog').forEach(d => d.setAttribute('data-lenis-prevent', ''));
  return () => { lenis.destroy(); lenis = null; hooks.scrollTo = null; };
}

/* Count a number up once when it scrolls into view. */
function countUp(el) {
  const end = parseFloat(el.dataset.count); const comma = el.dataset.format === 'comma';
  const fmt = v => comma ? Math.round(v).toLocaleString('en-IN') : String(Math.round(v));
  const state = {v: 0}; el.textContent = fmt(0);
  gsap.to(state, {v: end, duration: 1.4, ease: EASE, scrollTrigger: {trigger: el, start: 'top 90%', once: true}, onUpdate: () => { el.textContent = fmt(state.v); }});
}

/* Shared chapter treatments: masked titles, labels, sub-lines, generic reveals, letterboxed openers. */
motion(() => {
  html.classList.add('motion');
  $$('.ch-title').forEach(title => {
    const head = title.parentElement;
    const parts = [$('.ch-label', head), $('.deva', head)].filter(Boolean);
    const tl = gsap.timeline({scrollTrigger: {trigger: title, start: 'top 85%', once: true}});
    if (parts.length) tl.from(parts, {opacity: 0, y: 12, duration: 1, ease: EASE});
    tl.from($$('.mask-in', title), {yPercent: 110, duration: 1.2, stagger: .12, ease: EASE}, parts.length ? '-=.8' : 0);
    const sub = title.nextElementSibling;
    if (sub?.classList.contains('ch-sub')) tl.from(sub, {opacity: 0, duration: 1.2, ease: EASE}, '-=.9');
  });
  $$('.rv').forEach(el => gsap.to(el, {opacity: 1, y: 0, duration: 1.1, ease: EASE, scrollTrigger: {trigger: el, start: 'top 88%', once: true}}));
  $$('.opener').forEach(op => {
    gsap.from($$('.lb', op), {scaleY: 0, duration: 1.2, ease: EASE, scrollTrigger: {trigger: op, start: 'top 75%', toggleActions: 'play none none reverse'}});
    const img = $('.opener-media img', op);
    if (img) gsap.fromTo(img, {scale: 1.1}, {scale: 1, ease: 'none', scrollTrigger: {trigger: op, start: 'top bottom', end: 'bottom top', scrub: true}});
  });
  $$('[data-count]').forEach(countUp);
  return () => html.classList.remove('motion');
});

/* 10-hero.js */
/* Chapter I: one-time intro (≤1.2s, skippable), title rise, slow Ken Burns. */
motion(() => {
  const heroImg = $('.hero-img');
  const masks = $$('.hero-title .mask-in');
  const fadeUps = [$('.hero-sub'), $('.hero-actions')];
  gsap.set(masks, {yPercent: 110, y: 0});  // y:0 drops the CSS pre-state, which GSAP would otherwise read as pixels
  html.classList.remove('pre');
  gsap.fromTo(heroImg, {scale: 1.188}, {scale: 1.1, duration: 8, ease: 'power1.out'});
  const tl = gsap.timeline({defaults: {ease: EASE}, onComplete: finishIntro});
  if (html.classList.contains('intro')) {
    const paths = $$('.intro-mark path');
    paths.forEach(p => { const l = p.getTotalLength(); gsap.set(p, {strokeDasharray: l, strokeDashoffset: l}); });
    tl.to(paths, {strokeDashoffset: 0, duration: .5, ease: 'power2.inOut', stagger: .06})
      .fromTo('.header', {yPercent: -100, y: 0}, {yPercent: 0, duration: .5}, .25)
      .fromTo('.hero-bar', {yPercent: 100, y: 0}, {yPercent: 0, duration: .5}, .25)
      .to('.intro-mark', {opacity: 0, duration: .3}, .55)
      .add(() => html.classList.remove('intro'), .55)
      .fromTo(['.hero-copy', '.hero-actions'], {opacity: 0}, {opacity: 1, duration: .4}, .6)
      .to(masks, {yPercent: 0, duration: .6, stagger: .12}, .6)
      .from(fadeUps, {y: 16, duration: .5, stagger: .08}, .7);
    const skip = () => { tl.progress(1); off(); };
    const off = () => ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(t => removeEventListener(t, skip));
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(t => addEventListener(t, skip, {passive: true}));
    tl.eventCallback('onComplete', () => { off(); finishIntro(); });
  } else {
    tl.to(masks, {yPercent: 0, duration: 1.2, stagger: .12}).from(fadeUps, {opacity: 0, y: 16, duration: 1, stagger: .1}, .3);
  }
  return () => { tl.progress(1); gsap.set(masks, {clearProps: 'all'}); };
});

/* 20-mahakal.js */
/* Chapter II: the shikhara draws itself (scrubbed), the sky moves to dawn, timeline dots light in order. */
motion(() => {
  const section = $('#mahakal'); if (!section) return;
  const paths = $$('.shikhara-svg .dr', section);
  paths.forEach(p => { const l = Math.ceil(p.getTotalLength()); p.style.strokeDasharray = l; p.style.strokeDashoffset = l; });
  gsap.to(paths, {strokeDashoffset: 0, ease: 'none', stagger: .02, scrollTrigger: {trigger: '.shikhara', start: 'top 80%', end: 'bottom 45%', scrub: true}});
  gsap.to($('.sky-dawn', section), {opacity: 1, ease: 'none', scrollTrigger: {trigger: section, start: 'top 60%', end: 'bottom bottom', scrub: true}});
  const triggers = $$('.timeline li', section).map(li => ScrollTrigger.create({trigger: li, start: 'top 78%', onEnter: () => li.classList.add('is-lit')}));
  return () => { paths.forEach(p => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; }); triggers.forEach(t => t.kill()); };
});

/* 30-road.js */
/* Chapter III: route draws Indore → Valencia → Ujjain (scrubbed); pins scale in; minute counters use the shared countUp. */
motion(() => {
  const route = $('.route'); if (!route) return;
  const paths = $$('.route-line path', route);
  paths.forEach(p => { const l = Math.ceil(p.getTotalLength()); gsap.set(p, {strokeDasharray: l, strokeDashoffset: l}); });
  gsap.to(paths, {strokeDashoffset: 0, ease: 'none', scrollTrigger: {trigger: route, start: 'top 75%', end: 'bottom 55%', scrub: true}});
  gsap.from($$('.stop-pin', route), {scale: 0, duration: 1, ease: EASE, stagger: .15, scrollTrigger: {trigger: route, start: 'top 70%', once: true}});
  gsap.from($$('.stop', route), {opacity: 0, y: 16, duration: 1.1, ease: EASE, stagger: .12, scrollTrigger: {trigger: route, start: 'top 75%', once: true}});
});

/* 40-growth.js */
/* Chapter IV: the line between the two pins draws, then the distance label settles in. */
motion(() => {
  const fig = $('.distance'); if (!fig) return;
  gsap.fromTo($('.distance-line path', fig), {attr: {d: 'M8 8 H8'}}, {attr: {d: 'M8 8 H592'}, ease: 'none', scrollTrigger: {trigger: fig, start: 'top 80%', end: 'top 40%', scrub: true}});
  gsap.from($$('.d-dot', fig), {scale: 0, duration: 1, ease: EASE, stagger: .2, scrollTrigger: {trigger: fig, start: 'top 80%', once: true}});
  gsap.from($('.km', fig), {opacity: 0, y: 10, duration: 1.1, ease: EASE, scrollTrigger: {trigger: fig, start: 'top 55%', once: true}});
});

/* 50-tomorrow.js */
/* Chapter V: the rule fills as you read. On desktop the row pins and moves sideways, but only when it truly overflows. */
motion(() => {
  const section = $('#tomorrow'); if (!section) return;
  gsap.from($$('.milestone', section), {opacity: 0, y: 20, duration: 1.1, ease: EASE, stagger: .12, scrollTrigger: {trigger: $('.tl-list', section), start: 'top 80%', once: true}});
  if (isDesktop.matches) return;
  const fill = $('.tl-rule i', section);
  const t = gsap.fromTo(fill, {scaleY: 0}, {scaleY: 1, ease: 'none', scrollTrigger: {trigger: $('.tl-list', section), start: 'top 75%', end: 'bottom 60%', scrub: true}});
  return () => { t.scrollTrigger?.kill(); gsap.set(fill, {clearProps: 'transform'}); };
});
motionDesktop(() => {
  const section = $('#tomorrow'); if (!section) return;
  const viewport = $('.tl-viewport', section), track = $('.tl-track', section), fill = $('.tl-rule i', section);
  section.classList.add('is-horizontal');
  const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
  if (distance() < 160) {
    section.classList.remove('is-horizontal');
    const t = gsap.fromTo(fill, {scaleX: 0}, {scaleX: 1, ease: 'none', scrollTrigger: {trigger: $('.tl-list', section), start: 'top 75%', end: 'top 30%', scrub: true}});
    return () => { t.scrollTrigger?.kill(); gsap.set(fill, {clearProps: 'transform'}); };
  }
  const tl = gsap.timeline({scrollTrigger: {trigger: $('.tomorrow-pin', section), start: 'top top', end: () => '+=' + distance(), pin: true, scrub: true, invalidateOnRefresh: true}});
  tl.to(track, {x: () => -distance(), ease: 'none'}, 0).fromTo(fill, {scaleX: 0}, {scaleX: 1, ease: 'none'}, 0);
  return () => { section.classList.remove('is-horizontal'); tl.scrollTrigger?.kill(); gsap.set([track, fill], {clearProps: 'transform'}); };
});

/* 99-run.js */
/* Start the motion layer after every chapter has registered. */
if (hasGsap) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const stopLenis = startLenis();
    const cleanups = motionFns.map(fn => fn()).filter(f => typeof f === 'function');
    return () => { cleanups.forEach(f => f()); stopLenis?.(); };
  });
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => {
    const cleanups = desktopFns.map(fn => fn()).filter(f => typeof f === 'function');
    return () => cleanups.forEach(f => f());
  });
  mm.add('(prefers-reduced-motion: reduce)', () => { finishIntro(); });
  addEventListener('load', () => ScrollTrigger.refresh());
}

})();
