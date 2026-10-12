/* Chapter VI: the masterplan zooms in slightly while the zones light one at a time (both scrubbed). */
motion(() => {
  const stage = $('.plan-stage'); if (!stage) return;
  const zones = $$('.zone', stage), legend = $$('.zone-legend li');
  const setActive = i => [zones, legend].forEach(list => list.forEach((el, k) => el.classList.toggle('is-active', k === i)));
  const tl = gsap.timeline({scrollTrigger: {trigger: stage, start: 'top 75%', end: 'bottom 20%', scrub: true,
    onUpdate: self => setActive(Math.min(zones.length - 1, Math.floor(self.progress * zones.length))),
    onLeaveBack: () => setActive(-1)}});
  tl.fromTo($('.plan-zoom', stage), {scale: 1}, {scale: 1.06, ease: 'none'});
  return () => { setActive(-1); tl.scrollTrigger?.kill(); gsap.set($('.plan-zoom', stage), {clearProps: 'transform'}); };
});
