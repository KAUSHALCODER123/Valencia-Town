/* Chapter III: route draws Indore → Valencia → Ujjain (scrubbed); pins scale in; minute counters use the shared countUp. */
motion(() => {
  const route = $('.route'); if (!route) return;
  const paths = $$('.route-line path', route);
  paths.forEach(p => { const l = Math.ceil(p.getTotalLength()); gsap.set(p, {strokeDasharray: l, strokeDashoffset: l}); });
  gsap.to(paths, {strokeDashoffset: 0, ease: 'none', scrollTrigger: {trigger: route, start: 'top 75%', end: 'bottom 55%', scrub: true}});
  gsap.from($$('.stop-pin', route), {scale: 0, duration: 1, ease: EASE, stagger: .15, scrollTrigger: {trigger: route, start: 'top 70%', once: true}});
  gsap.from($$('.stop', route), {opacity: 0, y: 16, duration: 1.1, ease: EASE, stagger: .12, scrollTrigger: {trigger: route, start: 'top 75%', once: true}});
});
