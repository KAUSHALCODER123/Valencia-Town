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
