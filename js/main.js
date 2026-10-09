/* Valencia Town: small, progressively enhanced interactions. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const project = JSON.parse($('#project-data').textContent);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  window.dataLayer = window.dataLayer || [];
  const track = (event, extra = {}) => window.dataLayer.push({event, ...extra});
  const phoneValid = value => /^91[6-9]\d{9}$/.test(value) && !/^(\d)\1{9}$/.test(value.slice(2));
  const cleanPhone = value => String(value || '').replace(/\D/g, '');
  const salesPhone = cleanPhone(project.SALES_PHONE);
  const whatsapp = cleanPhone(project.WHATSAPP_NUMBER);
  const addContact = (label, href) => {
    const a = document.createElement('a'); a.textContent = label; a.href = href;
    $('#contact-details').append(a);
  };
  if (phoneValid(salesPhone)) addContact('+' + salesPhone, 'tel:+' + salesPhone); else $$('.call-link').forEach(a => a.hidden = true);
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(project.SALES_EMAIL || '') && !/example\./i.test(project.SALES_EMAIL)) addContact(project.SALES_EMAIL, 'mailto:' + project.SALES_EMAIL);
  if (phoneValid(whatsapp)) $$('.whatsapp').forEach(a => {
    a.href = 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent('Hello, I would like to learn more about Valencia Town.'); a.hidden = false;
  });
  if (/^P-[A-Z]{2,5}-\d{2}-\d{3,}$/i.test(project.RERA_NUMBER || '')) {
    $('#rera-line').textContent = 'MP RERA No. ' + project.RERA_NUMBER; $('#rera-line').hidden = false;
  }
  $('#year').textContent = new Date().getFullYear();
  const header = $('#header');
  const updateHeader = () => header.classList.toggle('is-solid', scrollY > 40);
  updateHeader(); addEventListener('scroll', updateHeader, {passive: true});
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); observer.unobserve(entry.target); }
    }), {threshold: 0.08});
    $$('.reveal').forEach(el => observer.observe(el));
  }
  // Native <dialog> supplies keyboard focus trapping, Escape and inert background.
  const openDialog = dialog => {
    if (dialog.open) return;
    dialog._opener = document.activeElement;
    dialog.showModal(); document.body.classList.add('modal-open');
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
      document.body.classList.toggle('modal-open', !!$('dialog[open]'));
      if (dialog._opener?.isConnected) dialog._opener.focus({preventScroll: true});
    });
  });
  // Escape always closes the open dialog, even when focus has drifted or the browser's close watcher declines.
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = $('dialog[open]'); if (open) { event.preventDefault(); closeDialog(open); }
  });
  const menu = $('#mobile-menu');
  $('.menu-toggle').addEventListener('click', () => openDialog(menu));
  $$('a[href^="#"]', menu).forEach(a => a.addEventListener('click', () => closeDialog(menu)));
  matchMedia('(min-width:1024px)').addEventListener('change', e => { if (e.matches && menu.open) menu.close(); });
  const enquiry = $('#enquiry-modal');
  const form = $('#enquiry-form');
  const status = $('#form-status');
  let submitting = false;
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-enquiry]');
    if (trigger) {
      if (trigger.hasAttribute('data-call') && matchMedia('(max-width: 767px)').matches && phoneValid(salesPhone)) { track('cta_click', {cta: 'call'}); location.href = 'tel:+' + salesPhone; return; }
      if (menu.open) menu.close();
      if (!submitting) {
        form.hidden = false; $('#enquiry-success').hidden = true; status.textContent = '';
        form.elements.interest.value = trigger.dataset.enquiry;
      }
      openDialog(enquiry);
      track('cta_click', {cta: trigger.dataset.enquiry});
    }
    if (event.target.closest('[data-privacy]')) openDialog($('#privacy-modal'));
    if (event.target.closest('[data-terms]')) openDialog($('#terms-modal'));
    const mapButton = event.target.closest('[data-load-map]');
    if (mapButton) {
      const frame = document.createElement('iframe');
      frame.src = 'https://www.google.com/maps?q=' + project.latitude + ',' + project.longitude + '&z=11&output=embed';
      frame.title = 'Map of Valencia Town at Shahna on the Indore–Ujjain Road'; frame.loading = 'lazy'; frame.referrerPolicy = 'no-referrer-when-downgrade'; frame.allowFullscreen = true;
      mapButton.replaceWith(frame); track('map_load');
    }
  });
  // Keep attribution tab-local and exclude personal field values from analytics.
  const keys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'];
  let attribution = {};
  try { attribution = JSON.parse(sessionStorage.getItem('valencia-attribution') || '{}'); } catch {}
  const params = new URLSearchParams(location.search);
  keys.forEach(key => { if (params.has(key)) attribution[key] = params.get(key).slice(0, 200); });
  try { sessionStorage.setItem('valencia-attribution', JSON.stringify(attribution)); } catch {}
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
    const submit = $('button[type="submit"]', form);
    submitting = true; submit.disabled = true; submit.textContent = 'Sending your request…'; status.textContent = '';
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const payload = {name, phone: '+91'+number, email, preferred_time: form.elements.preferredTime.value, interest: form.elements.interest.value, source:'private-visit-modal', page:location.origin+location.pathname, submitted_at:new Date().toISOString(), website:'', ...attribution};
      const response = await fetch(project.formEndpoint, {method:'POST', headers:{'Content-Type':'text/plain;charset=UTF-8'}, body:JSON.stringify(payload), signal:controller.signal});
      if (!response.ok) throw new Error('HTTP failure');
      const result = await response.json();
      if (result.ok !== true) throw new Error('Request not acknowledged');
      const interest = form.elements.interest.value;
      const download = $('#success-download'); const docUrl = interest === 'Brochure' ? project.brochureUrl : interest === 'Layout' ? project.layoutUrl : '';
      download.hidden = !docUrl; if (docUrl) { download.href = docUrl; download.innerHTML = (interest === 'Brochure' ? 'Download the brochure' : 'Download the layout') + ' <span aria-hidden="true">↓</span>'; }
      const next = $('#success-whatsapp'); next.hidden = !phoneValid(whatsapp);
      if (!next.hidden) next.href = 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent('Hello, I am ' + name + '. I just sent a request about ' + interest.toLowerCase() + ' at Valencia Town.');
      form.hidden = true; $('#enquiry-success').hidden = false;
      $('#enquiry-success').setAttribute('tabindex', '-1'); $('#enquiry-success').focus();
      track('generate_lead', {form: 'private-visit-modal'}); form.reset();
    } catch {
      status.textContent = 'We could not confirm receipt. Your details are still here. Please try again in a moment.';
    } finally {
      clearTimeout(timeout); submitting = false; submit.disabled = false; submit.innerHTML = 'Send request <span aria-hidden="true">↗</span>';
    }
  });
  // One place at a time. Coordinates are percentages, populated only after verification.
  let planIndex = 0;
  const planItems = project.masterplan;
  // Inline aerial walkthrough: loads only when the masterplan is near the viewport, plays muted in place, pauses off screen.
  const planVideo = $('.plan-video');
  if (planVideo) {
    const source = $('source', planVideo);
    const start = () => { if (!source.src) { source.src = source.dataset.src; planVideo.load(); } if (!reduceMotion.matches) planVideo.play().catch(() => {}); };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) start(); else if (!planVideo.paused) planVideo.pause(); }), {rootMargin: '200px 0px'}).observe(planVideo);
    } else start();
  }
  function showPlan(index) {
    planIndex = (index + planItems.length) % planItems.length;
    const item = planItems[planIndex];
    $('#plan-detail .eyebrow').textContent = String(planIndex+1).padStart(2,'0')+' / '+String(planItems.length).padStart(2,'0');
    $('#plan-detail h3').textContent = item.title;
    $('#plan-detail p:not(.eyebrow)').textContent = item.description;
    const figure = $('#plan-image');
    if (figure && item.image && !figure.src.includes('/' + item.image + '-')) {
      figure.classList.add('is-switching');
      const swap = () => {
        figure.src = 'assets/img/' + item.image + '-640.webp';
        figure.srcset = 'assets/img/' + item.image + '-640.webp 640w, assets/img/' + item.image + '-1280.webp 1280w';
        figure.alt = item.title + ' \u2014 artist\u2019s impression';
        figure.decode().catch(() => {}).finally(() => figure.classList.remove('is-switching'));
      };
      reduceMotion.matches ? swap() : setTimeout(swap, 180);
    }
  }
  $('[data-plan-prev]').addEventListener('click', () => showPlan(planIndex-1));
  $('[data-plan-next]').addEventListener('click', () => showPlan(planIndex+1)); showPlan(0);
  const pan = $('.plan-pan'), zoomImage = $('#zoom-image');
  let zoom = 1;
  function setZoom(value, anchorX = pan.clientWidth/2, anchorY = pan.clientHeight/2) {
    const next = Math.max(1, Math.min(2, value)); /* TODO: raise to 4 when a 3000px+ plan is supplied */ const ratio = next / zoom;
    const left = (pan.scrollLeft + anchorX)*ratio-anchorX;
    const top = (pan.scrollTop + anchorY)*ratio-anchorY;
    zoom = next; zoomImage.style.width = (zoom*100)+'%'; zoomImage.style.minHeight = (zoom*100)+'%';
    pan.scrollLeft = left; pan.scrollTop = top; $('#zoom-level').textContent = Math.round(zoom*100)+'%';
  }
  $$('[data-open-plan]').forEach(button => button.addEventListener('click', () => { openDialog($('#plan-modal')); setZoom(1); pan.scrollTo(0,0); }));
  $$('[data-zoom]').forEach(button => button.addEventListener('click', () => setZoom(button.dataset.zoom === 'reset' ? 1 : zoom + (button.dataset.zoom === 'in' ? .5 : -.5))));
  pan.addEventListener('keydown', event => {
    if (['+','=','-','0'].includes(event.key)) { event.preventDefault(); setZoom(event.key === '0' ? 1 : zoom + (event.key === '-' ? -.5 : .5)); }
  });
  const pointers = new Map(); let previousDistance = 0;
  pan.addEventListener('pointerdown', e => { pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}); pan.setPointerCapture(e.pointerId); pan.classList.add('dragging'); previousDistance = 0; });
  pan.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId)) return;
    const previous = pointers.get(e.pointerId); pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if (pointers.size === 2) {
      const [a,b] = [...pointers.values()]; const distance = Math.hypot(a.x-b.x,a.y-b.y);
      if (previousDistance) { const r = pan.getBoundingClientRect(); setZoom(zoom*distance/previousDistance,(a.x+b.x)/2-r.left,(a.y+b.y)/2-r.top); }
      previousDistance = distance;
    } else { pan.scrollLeft -= e.clientX-previous.x; pan.scrollTop -= e.clientY-previous.y; }
  });
  ['pointerup','pointercancel','lostpointercapture'].forEach(type => pan.addEventListener(type, e => { pointers.delete(e.pointerId); previousDistance=0; if (!pointers.size) pan.classList.remove('dragging'); }));
  // Location never advances automatically: tap/keyboard controls give visitors time to read.
  // Film section removed until a 1080p textured walkthrough exists (see data/project.json _TODO.film).
  const film = $('#film-modal');
  if (film) {
    const video = $('video', film);
    $('[data-open-film]')?.addEventListener('click', () => { openDialog(film); if (!video.getAttribute('src')) video.src='assets/video/walkthrough.mp4'; video.play().catch(() => {}); track('video_play', {video:'3d_walkthrough'}); });
    film.addEventListener('close', () => { video.pause(); video.currentTime = 0; });
  }
  const gallery = $('#gallery-modal'); const galleryItems = $$('[data-gallery]'); let galleryIndex = 0;
  function showGallery(index) {
    galleryIndex = (index+galleryItems.length)%galleryItems.length;
    const source = $('img',galleryItems[galleryIndex]);
    $('#gallery-image').src = source.getAttribute('src'); $('#gallery-image').alt = source.alt;
    $('#gallery-caption').textContent = source.alt;
    $('#gallery-count').textContent = String(galleryIndex+1).padStart(2,'0')+' / '+String(galleryItems.length).padStart(2,'0');
  }
  galleryItems.forEach((button,index) => button.addEventListener('click', () => { showGallery(index); openDialog(gallery); }));
  $('[data-gallery-prev]').addEventListener('click', () => showGallery(galleryIndex-1));
  $('[data-gallery-next]').addEventListener('click', () => showGallery(galleryIndex+1));
  gallery.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); showGallery(galleryIndex+(e.key==='ArrowLeft'?-1:1)); }
  });
  let startX=0,startY=0;
  $('.gallery-viewer').addEventListener('touchstart', e => {startX=e.touches[0].clientX;startY=e.touches[0].clientY;}, {passive:true});
  $('.gallery-viewer').addEventListener('touchend', e => {
    const dx=e.changedTouches[0].clientX-startX, dy=e.changedTouches[0].clientY-startY;
    if (Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)) showGallery(galleryIndex+(dx<0?1:-1));
  }, {passive:true});
  /* Story rail: marks the chapter under the middle of the viewport and matches its tone. */
  const rail = $('.story-rail'); const chapters = $$('[data-chapter]');
  if (rail && chapters.length) {
    let ticking = false;
    const update = () => {
      ticking = false; const mid = innerHeight / 2;
      const current = chapters.find(el => { const r = el.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; });
      rail.classList.toggle('is-visible', !!current);
      if (!current) return;
      rail.dataset.tone = current.dataset.tone;
      $$('a', rail).forEach(a => a.classList.toggle('is-active', a.dataset.rail === current.dataset.chapter));
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, {passive:true});
    addEventListener('resize', update); update();
  }
})();
