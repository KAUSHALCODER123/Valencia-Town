/* Questions: real buttons with aria-expanded; answers stay open if the script never runs. */
$$('.qa-btn').forEach(btn => {
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  const set = open => { btn.setAttribute('aria-expanded', String(open)); panel.hidden = !open; };
  set(false);
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
});
