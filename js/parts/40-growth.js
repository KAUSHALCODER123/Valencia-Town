/* Chapter IV: the line between the two pins draws, then the distance label settles in. */
motion(() => {
  const fig = $('.distance'); if (!fig) return;
  gsap.fromTo($('.distance-line path', fig), {attr: {d: 'M8 8 H8'}}, {attr: {d: 'M8 8 H592'}, ease: 'none', scrollTrigger: {trigger: fig, start: 'top 80%', end: 'top 40%', scrub: true}});
  gsap.from($$('.d-dot', fig), {scale: 0, duration: 1, ease: EASE, stagger: .2, scrollTrigger: {trigger: fig, start: 'top 80%', once: true}});
  gsap.from($('.km', fig), {opacity: 0, y: 10, duration: 1.1, ease: EASE, scrollTrigger: {trigger: fig, start: 'top 55%', once: true}});
});
