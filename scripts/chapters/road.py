"""Chapter III: The Road. Letterboxed opener (internal-road; entrance-road now appears only in Life) and a drawn route."""
from vt import C, P, image, heading, letterbox, ai_label
from layout import MAPS

def render():
    R = C['road']; d = P['distances']; S = R['stops']
    stops = [('indore', d['Vijay Nagar']), ('saims', d['SAIMS']), ('home', None), ('ujjain', d['Ujjain'])]
    def stop(key, mins):
        name, note = S[key]
        when = f'<span class="stop-min">~<span data-count="{mins}">{mins}</span> {R["min"]}</span>' if mins else '<span class="stop-min stop-here">Shahna</span>'
        pin = '<span class="stop-pin stop-pin-home" aria-hidden="true"><svg viewBox="0 0 113.79 94.26"><path d="M59.11 39.50L113.79 0.00C95.99 26.77 77.71 53.32 59.11 79.71L59.11 39.50Z"/><path d="M54.68 57.40L0.00 14.55L54.68 94.26L54.68 57.40Z"/></svg></span>' if key == 'home' else '<span class="stop-pin" aria-hidden="true"></span>'
        sub = '' if key == 'home' else f'<span class="stop-note">{note}</span>'
        return f'<li class="stop stop-{key}">{pin}<strong>{name}</strong>{sub}{when}</li>'
    h_line = '<svg class="route-line route-h" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true"><path d="M125 20 C 210 14, 290 26, 375 20 S 540 14, 625 20 S 790 26, 875 20"/></svg>'
    v_line = '<svg class="route-line route-v" viewBox="0 0 40 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M20 40 C 8 200, 32 300, 20 500 S 10 800, 20 960"/></svg>'
    return f'''<section class="opener road" id="location" data-chapter="3" data-name="The Road" aria-labelledby="road-title"><div class="opener-media">{image("internal-road", R["alt"], "grade")}<div class="vignette" aria-hidden="true"></div></div>{letterbox()}<div class="opener-copy">{heading(R, "road-title")}<p class="lede rv">{R["lede"]}</p></div>{ai_label()}</section>
<section class="chapter route-chapter" aria-label="{R["map_label"]}"><div class="wrap"><div class="route">{h_line}{v_line}<ol class="route-stops" aria-label="{R["map_label"]}">{"".join(stop(k, m) for k, m in stops)}</ol></div><div class="actions route-actions"><a class="btn" href="{MAPS}" target="_blank" rel="noopener">{R["directions"]}</a><button class="btn-ghost" type="button" data-load-map>{R["map"]}</button></div><div class="map-embed" id="map-embed"></div><p class="fine route-fine">{R["fine"]}</p></div></section>'''
