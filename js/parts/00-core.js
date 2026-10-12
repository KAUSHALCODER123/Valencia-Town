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
