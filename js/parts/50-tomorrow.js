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
