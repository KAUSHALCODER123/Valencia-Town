/* Chapter VII (desktop motion only): the chapter pins; each scene wipes in from the top while captions crossfade. */
motionDesktop(() => {
  const section = $('#life'); if (!section) return;
  const scenes = $$('.scene', section);
  section.classList.add('life-pinned');
  const caps = scenes.map(s => $('.scene-cap', s));
  gsap.set(scenes.slice(1), {clipPath: 'inset(0% 0% 100% 0%)'});
  gsap.set(caps.slice(1), {opacity: 0, y: 20});
  const tl = gsap.timeline({scrollTrigger: {trigger: section, start: 'top top', end: () => '+=' + innerHeight * (scenes.length - .4), pin: true, scrub: true, invalidateOnRefresh: true}});
  tl.to($('.life-head', section), {opacity: 0, y: -24, ease: 'none', duration: .5}, .3);
  scenes.slice(1).forEach((scene, k) => {
    const at = k + .6;
    tl.to(scene, {clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1}, at)
      .to(caps[k], {opacity: 0, y: -20, ease: 'none', duration: .4}, at)
      .to(caps[k + 1], {opacity: 1, y: 0, ease: 'none', duration: .4}, at + .6);
  });
  tl.to({}, {duration: .3});
  return () => { section.classList.remove('life-pinned'); tl.scrollTrigger?.kill(); gsap.set([...scenes, ...caps, $('.life-head', section)], {clearProps: 'all'}); };
});
