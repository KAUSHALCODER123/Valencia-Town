"""Chapter II: Mahakal. A generated Nagara temple elevation that draws itself as the sky moves from night to dawn.

Drawn in a 600 × 820 box, centre line x = 300. Every element is a stroked path so it can draw on scroll."""
from vt import C, primary, secondary, heading

CX = 300
BASE, TOP = 548, 206            # main shikhara: base of the curve and the shoulder under the amalaka
HW0, HW1 = 112, 40              # half-width at base and at the shoulder

def hw(y):
    """Half-width of the main shikhara at height y: a convex Nagara curve, steepening towards the top."""
    t = (BASE - y) / (BASE - TOP)
    return HW1 + (HW0 - HW1) * (1 - t ** 3.4)

def spine(y):
    """Half-width of the central latā (spine) band."""
    t = (BASE - y) / (BASE - TOP)
    return 26 - 12 * t

def poly(pts): return 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts)

def mini_spire(x, b, h, w):
    """A miniature shikhara (kūṭa): curved sides, a small amalaka cap."""
    top = b - h
    return [f'M{x - w:.1f} {b:.1f} C{x - w:.1f} {b - h * .55:.1f} {x - w * .45:.1f} {top + h * .18:.1f} {x:.1f} {top + 2:.1f}',
            f'M{x + w:.1f} {b:.1f} C{x + w:.1f} {b - h * .55:.1f} {x + w * .45:.1f} {top + h * .18:.1f} {x:.1f} {top + 2:.1f}',
            f'M{x - w * .42:.1f} {top + 3:.1f} Q{x:.1f} {top - 3:.1f} {x + w * .42:.1f} {top + 3:.1f}']

def flank_spire(cx, base, top, w0, w1):
    """A smaller attached spire (uruśṛṅga) with its own courses and amalaka."""
    f = lambda y: w1 + (w0 - w1) * (1 - ((base - y) / (base - top)) ** 2)
    ys = [base - (base - top) * i / 24 for i in range(25)]
    out = [poly([(cx - f(y), y) for y in ys]), poly([(cx + f(y), y) for y in ys])]
    for t in (.22, .44, .66, .86):
        y = base - (base - top) * t; w = f(y)
        out.append(f'M{cx - w:.1f} {y:.1f} Q{cx:.1f} {y + 4:.1f} {cx + w:.1f} {y:.1f}')
    out += [f'M{cx - w1 - 8} {top - 1} Q{cx} {top - 13} {cx + w1 + 8} {top - 1} Q{cx} {top + 9} {cx - w1 - 8} {top - 1}',
            f'M{cx - 5} {top - 9} Q{cx} {top - 22} {cx + 5} {top - 9}', f'M{cx} {top - 18} V{top - 26}']
    return out

def shikhara_svg():
    p = []
    ys = [BASE - (BASE - TOP) * i / 48 for i in range(49)]
    # Main spire: outline and the central spine band
    p += [poly([(CX - hw(y), y) for y in ys]), poly([(CX + hw(y), y) for y in ys])]
    p += [poly([(CX - spine(y), y) for y in ys]), poly([(CX + spine(y), y) for y in ys])]
    # Courses (bhūmi) and rows of miniature spires between the spine and the outline
    rows = [548, 486, 430, 380, 336, 296, 262, 232, 206]
    for i in range(len(rows) - 1):
        b, t = rows[i], rows[i + 1]
        for side in (-1, 1):
            inner, outer = spine(b) + 4, hw(b) - 4
            n = 2 if outer - inner > 44 else 1
            w = (outer - inner) / n / 2 - 3
            for k in range(n):
                x = CX + side * (inner + w + 3 + k * (2 * w + 6))
                p += mini_spire(x, b - 3, (b - t) * .82, w)
        y = t; w_out, w_in = hw(y), spine(y)
        p += [f'M{CX - w_out:.1f} {y:.1f} L{CX - w_in:.1f} {y:.1f}', f'M{CX + w_in:.1f} {y:.1f} L{CX + w_out:.1f} {y:.1f}']
        # chaitya rungs on the spine
        m = (b + t) / 2; s = spine(m)
        p.append(f'M{CX - s + 4:.1f} {m + 6:.1f} Q{CX:.1f} {m - 8:.1f} {CX + s - 4:.1f} {m + 6:.1f}')
    # Crown: neck, ribbed amalaka, second amalaka, kalasha, finial
    p += ['M262 206 H338', 'M266 199 V206', 'M334 199 V206',
          'M246 186 Q300 166 354 186 Q300 206 246 186', 'M258 180 V193', 'M272 176 V197', 'M286 174 V198', 'M300 173 V199', 'M314 174 V198', 'M328 176 V197', 'M342 180 V193',
          'M278 167 Q300 157 322 167 Q300 175 278 167',
          'M291 160 C276 152 282 132 296 129 H304 C318 132 324 152 309 160', 'M293 129 V123 H307 V129',
          'M300 123 V84']
    # Trident on the finial
    p += ['M288 98 Q288 84 300 82 Q312 84 312 98', 'M288 98 V92', 'M312 98 V92']
    # Flanking spires, attached at the shoulders of the sanctum
    p += flank_spire(150, 548, 440, 32, 11) + flank_spire(450, 548, 440, 32, 11)
    # Cornice and sanctum wall (mandovara) with projecting central bhadra
    p += ['M120 562 H480', 'M120 562 L132 548 H468 L480 562',
          'M132 700 V574 H150 V562', 'M468 700 V574 H450 V562',
          'M196 700 V574', 'M404 700 V574', 'M240 700 V562', 'M360 700 V562',
          'M132 574 H468', 'M132 688 H468', 'M132 678 H468']
    # Doorway with torana arch
    p += ['M268 700 V630 Q300 596 332 630 V700', 'M280 700 V636 Q300 612 320 636 V700', 'M262 618 Q300 576 338 618']
    # Niches on the side rathas
    for x in (168, 432):
        p += [f'M{x - 14} 670 V622 Q{x} 604 {x + 14} 622 V670 Z']
    # Jagati platform and ghat steps down to the Kshipra
    p += ['M96 700 H504', 'M96 700 V718 H504 V700', 'M80 718 V736 H520 V718',
          'M60 736 H540', 'M52 748 H548', 'M44 760 H556',
          'M100 780 H220', 'M260 780 H340', 'M380 780 H500', 'M150 794 H250', 'M350 794 H450', 'M210 808 H390']
    sun = '<circle class="dr sun" cx="300" cy="470" r="236"/>'
    moon = '<path class="dr moon" d="M120 120 A34 34 0 1 0 156 168 A26 26 0 1 1 120 120"/>'
    flag = '<path class="dr flag" d="M300 84 V44 M300 46 L350 58 L300 72"/>'
    body = ''.join(f'<path class="dr" d="{d}"/>' for d in p)
    return f'<svg class="shikhara-svg" viewBox="0 0 600 820" role="img" aria-label="Line drawing of a Nagara temple with a tall shikhara above the Kshipra ghats at dawn" fill="none" stroke-linecap="round" stroke-linejoin="round">{sun}{moon}{body}{flag}</svg>'

def render():
    M = C['mahakal']
    li = lambda items, key=None: ''.join(f'<li{" class=\"is-key\"" if w == key else ""}><span class="t-when">{w}</span><span class="t-what">{t}</span></li>' for w, t in items)
    return f'''<section class="chapter mahakal" id="mahakal" data-chapter="2" data-name="Mahakal" aria-labelledby="mahakal-title"><div class="sky" aria-hidden="true"><div class="sky-dawn"></div></div><div class="wrap"><div class="chapter-head">{heading(M, "mahakal-title", deva=M["deva"])}<p class="lede rv">{M["lede"]}</p></div><div class="mahakal-grid"><figure class="shikhara">{shikhara_svg()}</figure><div class="mahakal-times"><div class="time-block rv"><h3>{M["day_title"]}</h3><ol class="timeline">{li(M["day"])}</ol></div><div class="time-block rv"><h3>{M["life_title"]}</h3><ol class="timeline">{li(M["life"], "2028")}</ol></div><div class="actions">{primary(C["ui"]["primary_mahakal"])}{secondary()}</div><p class="fine">{M["fine"]}</p></div></div></div></section>'''
