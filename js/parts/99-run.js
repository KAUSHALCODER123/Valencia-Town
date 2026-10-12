/* Start the motion layer after the page has loaded and every chapter has registered. Reduced motion: never loaded. */
function startMotion() {
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
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
  ScrollTrigger.refresh();
}
if (!reduceMotion.matches) {
  const go = () => loadMotion().then(startMotion).catch(() => {});
  const idle = () => ('requestIdleCallback' in window) ? requestIdleCallback(go, {timeout: 1500}) : setTimeout(go, 200);
  document.readyState === 'complete' ? idle() : addEventListener('load', idle, {once: true});
}
