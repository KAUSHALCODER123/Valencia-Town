/* Motion layer: GSAP + ScrollTrigger + Lenis. One ease everywhere; scrubbed tweens use ease "none".
   Chapters register with motion() (any width) or motionDesktop() (≥1024px only: pinning, horizontal scroll).
   Everything runs inside gsap.matchMedia so prefers-reduced-motion leaves the page static and fully visible. */
const EASE = 'expo.out';
const motionFns = [], desktopFns = [];
const motion = fn => motionFns.push(fn);
const motionDesktop = fn => desktopFns.push(fn);
/* Intro classes are only removed after the CSS entrance has finished (its end state is the natural state). */
const finishIntro = () => { html.classList.remove('intro'); try { sessionStorage.setItem('vt-intro', '1'); } catch {} };
setTimeout(() => html.classList.remove('pre', 'intro-skip'), 8200);
let lenis = null;
/* GSAP, ScrollTrigger and Lenis load after the page, so they never compete with the hero render. */
const loadScript = src => new Promise((ok, fail) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = fail; document.head.append(s); });
const loadMotion = () => project.vendor.reduce((p, src) => p.then(() => loadScript(src)), Promise.resolve());

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
