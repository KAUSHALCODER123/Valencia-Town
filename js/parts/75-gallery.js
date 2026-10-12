/* A closer look: native swipe on touch; mouse drag with inertia and a "Drag" cursor on desktop; arrow keys; 1 / 4 counter. */
{
  const strip = $('.strip');
  if (strip) {
    const items = $$('.strip-item', strip), buttons = $$('[data-strip-item]', strip);
    const pos = $('.gallery-pos b'), cursor = $('.drag-cursor', strip);
    const step = () => items[1] ? items[1].offsetLeft - items[0].offsetLeft : strip.clientWidth;
    const index = () => Math.max(0, Math.min(items.length - 1, Math.round(strip.scrollLeft / step())));
    const go = i => strip.scrollTo({left: Math.max(0, Math.min(items.length - 1, i)) * step(), behavior: reduceMotion.matches ? 'auto' : 'smooth'});
    strip.addEventListener('scroll', () => { pos.textContent = index() + 1; }, {passive: true});
    $$('[data-strip-step]').forEach(b => b.addEventListener('click', () => go(index() + Number(b.dataset.stripStep))));
    strip.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); go(index() + (e.key === 'ArrowLeft' ? -1 : 1)); } });
    let down = false, moved = 0, lastX = 0, velocity = 0, raf = 0;
    strip.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = 0; lastX = e.clientX; velocity = 0; cancelAnimationFrame(raf);
      strip.classList.add('is-dragging');
    });
    addEventListener('pointermove', e => {
      if (cursor && e.pointerType === 'mouse') { const r = strip.getBoundingClientRect(); cursor.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`; }
      if (!down) return;
      const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); velocity = dx;
      strip.scrollLeft -= dx;
    });
    addEventListener('pointerup', () => {
      if (!down) return; down = false;
      const glide = () => {   // inertia, then settle on the nearest image
        if (Math.abs(velocity) > .5 && !reduceMotion.matches) { strip.scrollLeft -= velocity; velocity *= .92; raf = requestAnimationFrame(glide); }
        else { strip.classList.remove('is-dragging'); go(index()); }
      };
      glide();
    });
    buttons.forEach((b, i) => b.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); moved = 0; return; } openGallery(buttons, i); }));
  }
}
