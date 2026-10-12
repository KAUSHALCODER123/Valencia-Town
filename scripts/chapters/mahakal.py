"""Chapter II: Mahakal. A generated shikhara line drawing that draws itself as the sky moves from night to dawn."""
from vt import C, primary, secondary, heading

def _curve(points): return 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in points)

def shikhara_svg():
    base, top, cx = 548, 214, 300
    hw = lambda t, w0=140, w1=44: w1 + (w0 - w1) * (1 - t ** 2.2)        # curvilinear Nagara profile
    ys = [base - (base - top) * i / 40 for i in range(41)]
    ts = [(base - y) / (base - top) for y in ys]
    paths = []
    for k in (1, .62, .3):                                                 # outline, then two inner rathas
        paths.append(_curve([(cx - hw(t) * k, y) for t, y in zip(ts, ys)]))
        paths.append(_curve([(cx + hw(t) * k, y) for t, y in zip(ts, ys)]))
    for t in (.12, .24, .36, .48, .6, .72, .84):                           # bhumi bands
        y = base - (base - top) * t; w = hw(t)
        paths.append(f'M{cx - w:.1f} {y:.1f} Q{cx} {y + 7:.1f} {cx + w:.1f} {y:.1f}')
    for s in (-1, 1):                                                      # urushringa half-spires
        x0, x1, xm = cx + s * 140, cx + s * 72, cx + s * 106
        paths += [f'M{x0} 548 C{x0 - s * 2} 470 {xm + s * 18} 422 {xm} 404', f'M{x1} 548 C{x1 + s * 1} 470 {xm - s * 10} 424 {xm} 404',
                  f'M{xm - 14} 401 Q{xm} 391 {xm + 14} 401 Q{xm} 409 {xm - 14} 401']
    paths += [
        'M60 780 H540', 'M90 780 V754 H510 V780', 'M118 754 V730 H482 V754',                       # jagati and plinth
        'M150 730 V560 H450 V730', 'M190 730 V560', 'M410 730 V560',                                # sanctum walls
        'M262 730 V644 Q300 604 338 644 V730', 'M276 730 V652 Q300 626 324 652 V730',               # doorway
        'M138 560 H462', 'M138 560 L150 548 H450 L462 560',                                         # cornice
        'M266 216 H334', 'M244 214 Q300 186 356 214 Q300 236 244 214',                              # griva and amalaka
        'M262 205 V222', 'M281 200 V227', 'M300 199 V229', 'M319 200 V227', 'M338 205 V222',
        'M290 199 C276 191 282 172 296 169 H304 C318 172 324 191 310 199 Z', 'M293 169 V162 H307 V169', 'M300 162 V120',   # kalash and finial
        'M110 800 H230', 'M262 800 H338', 'M370 800 H490', 'M160 814 H260', 'M340 814 H440',       # Kshipra ripples
    ]
    sun = '<circle class="dr sun" cx="300" cy="520" r="230"/>'
    flag = '<path class="dr flag" d="M300 120 V70 M300 72 L352 84 L300 98"/>'
    body = ''.join(f'<path class="dr" d="{d}"/>' for d in paths)
    return f'<svg class="shikhara-svg" viewBox="0 0 600 830" role="img" aria-label="Line drawing of a temple shikhara above the Kshipra at dawn" fill="none" stroke-linecap="round" stroke-linejoin="round">{sun}{body}{flag}</svg>'

def render():
    M = C['mahakal']
    li = lambda items, key=None: ''.join(f'<li{" class=\"is-key\"" if w == key else ""}><span class="t-when">{w}</span><span class="t-what">{t}</span></li>' for w, t in items)
    return f'''<section class="chapter mahakal" id="mahakal" data-chapter="2" data-name="Mahakal" aria-labelledby="mahakal-title"><div class="sky" aria-hidden="true"><div class="sky-dawn"></div></div><div class="wrap"><div class="chapter-head">{heading(M, "mahakal-title", deva=M["deva"])}<p class="lede rv">{M["lede"]}</p></div><div class="mahakal-grid"><figure class="shikhara">{shikhara_svg()}</figure><div class="mahakal-times"><div class="time-block rv"><h3>{M["day_title"]}</h3><ol class="timeline">{li(M["day"])}</ol></div><div class="time-block rv"><h3>{M["life_title"]}</h3><ol class="timeline">{li(M["life"], "2028")}</ol></div><div class="actions">{primary(C["ui"]["primary_mahakal"])}{secondary()}</div><p class="fine">{M["fine"]}</p></div></div></div></section>'''
