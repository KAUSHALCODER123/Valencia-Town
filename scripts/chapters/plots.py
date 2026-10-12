"""Chapter VIII: Plots. Second bone section: size range, price anchor, payment summary and a plot-size comparison."""
from vt import C, P, ph, fmt, heading, primary, secondary

def render():
    L = C['plots']; price = ph('PRICE_FROM'); pay = ph('PAYMENT_PLAN_SUMMARY')
    lo, hi = [int(x.replace(',', '')) for x in P['plotSizes'].replace('–', '-').split('-')]
    price_html = f'<p class="plot-price">{fmt(L["price"], price=price)}</p>' if price else ''
    pay_html = f'<p class="plot-pay">{pay}</p>' if pay else ''
    # Plot drawn at the largest size (2:3 proportion, 6 px per foot) and scaled down; the reference house stays fixed.
    W, D, s = (hi * 2 / 3) ** .5, (hi * 3 / 2) ** .5, 6
    pw, pd = W * s, D * s; x0, y0 = 20, 20 + 360 - pd
    hx, hy = x0 + 24, y0 + pd - 24 - 30 * s
    viz = f'''<svg class="plot-viz" viewBox="0 0 400 400" aria-hidden="true"><g class="plot-shape" style="transform-origin:{x0}px {y0 + pd}px"><rect class="plot-rect" x="{x0}" y="{y0:.1f}" width="{pw:.1f}" height="{pd:.1f}"/></g><rect class="house-rect" x="{hx:.1f}" y="{hy:.1f}" width="{20 * s}" height="{30 * s}"/><text class="house-text" x="{hx + 10 * s:.1f}" y="{hy + 15 * s + 5:.1f}" text-anchor="middle">600 sq ft</text></svg>'''
    return f'''<section class="chapter bone plots" id="plots" data-chapter="8" data-name="Plots" aria-labelledby="plots-title"><div class="wrap"><div class="chapter-head">{heading(L, "plots-title")}</div><div class="plots-grid"><div class="plots-copy rv"><p class="plot-size">{P["plotSizes"]}<small>{L["unit"]}</small></p>{price_html}<p class="lede">{L["lede"]}</p>{pay_html}<div class="actions">{primary()}{secondary()}</div></div><figure class="plot-compare rv" data-min="{lo}" data-max="{hi}"><div class="viz-wrap">{viz}<p class="viz-area"><b data-plot-out>{1500:,}</b> {L["unit"]}</p></div><label class="slider-label" for="plot-slider">{L["slider_label"]}</label><input id="plot-slider" class="plot-slider" type="range" min="{lo}" max="{hi}" step="100" value="1500" aria-valuetext="1,500 square feet"><div class="slider-ends" aria-hidden="true"><span>{lo:,}</span><span>{hi:,}</span></div><figcaption><span class="key key-plot"></span>{L["plot_caption"]} <span class="key key-house"></span>{L["house_caption"]}</figcaption><p class="fine">{L["note"]}</p></figure></div></div></section>'''
