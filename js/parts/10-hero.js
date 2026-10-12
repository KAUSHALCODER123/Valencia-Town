/* Chapter I: one-time intro (≤1.2s, skippable), title rise, slow Ken Burns. */
motion(() => {
  const heroImg = $('.hero-img');
  const masks = $$('.hero-title .mask-in');
  const fadeUps = [$('.hero-sub'), $('.hero-actions')];
  gsap.set(masks, {yPercent: 110, y: 0});  // y:0 drops the CSS pre-state, which GSAP would otherwise read as pixels
  html.classList.remove('pre');
  gsap.fromTo(heroImg, {scale: 1.188}, {scale: 1.1, duration: 8, ease: 'power1.out'});
  const tl = gsap.timeline({defaults: {ease: EASE}, onComplete: finishIntro});
  if (html.classList.contains('intro')) {
    const paths = $$('.intro-mark path');
    paths.forEach(p => { const l = p.getTotalLength(); gsap.set(p, {strokeDasharray: l, strokeDashoffset: l}); });
    tl.to(paths, {strokeDashoffset: 0, duration: .5, ease: 'power2.inOut', stagger: .06})
      .fromTo('.header', {yPercent: -100, y: 0}, {yPercent: 0, duration: .5}, .25)
      .fromTo('.hero-bar', {yPercent: 100, y: 0}, {yPercent: 0, duration: .5}, .25)
      .to('.intro-mark', {opacity: 0, duration: .3}, .55)
      .add(() => html.classList.remove('intro'), .55)
      .fromTo(['.hero-copy', '.hero-actions'], {opacity: 0}, {opacity: 1, duration: .4}, .6)
      .to(masks, {yPercent: 0, duration: .6, stagger: .12}, .6)
      .from(fadeUps, {y: 16, duration: .5, stagger: .08}, .7);
    const skip = () => { tl.progress(1); off(); };
    const off = () => ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(t => removeEventListener(t, skip));
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(t => addEventListener(t, skip, {passive: true}));
    tl.eventCallback('onComplete', () => { off(); finishIntro(); });
  } else {
    tl.to(masks, {yPercent: 0, duration: 1.2, stagger: .12}).from(fadeUps, {opacity: 0, y: 16, duration: 1, stagger: .1}, .3);
  }
  return () => { tl.progress(1); gsap.set(masks, {clearProps: 'all'}); };
});
