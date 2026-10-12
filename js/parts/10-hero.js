/* Chapter I: the entrance runs in CSS (see 10-hero.css). Here: skip on first input, then clear the classes. */
{
  const intro = html.classList.contains('intro');
  const skip = () => { html.classList.add('intro-skip'); finishIntro(); off(); };
  const off = () => ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(t => removeEventListener(t, skip));
  if (intro) ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(t => addEventListener(t, skip, {passive: true}));
  setTimeout(() => { off(); if (html.classList.contains('intro')) finishIntro(); }, 1300);
}
