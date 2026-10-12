/* Chapter VIII: the plot outline scales with the slider (area ∝ side²); the reference house stays fixed. */
{
  const fig = $('.plot-compare');
  if (fig) {
    const slider = $('.plot-slider', fig), shape = $('.plot-shape', fig), out = $('[data-plot-out]', fig);
    const max = Number(fig.dataset.max);
    const update = () => {
      const v = Number(slider.value); const label = v.toLocaleString('en-IN');
      shape.style.transform = 'scale(' + Math.sqrt(v / max).toFixed(4) + ')';
      out.textContent = label; slider.setAttribute('aria-valuetext', label + ' square feet');
    };
    slider.addEventListener('input', update); update();
  }
}
