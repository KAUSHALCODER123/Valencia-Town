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
