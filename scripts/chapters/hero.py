"""Chapter I: Arrival. Letterboxed hero; the headline sits above the render's signage and the actions below it."""
from vt import C, CFG, P, e, has, ph, image, primary

def render():
    H = C['hero']
    img = image('hero-signage', H['alt'], 'hero-img grade', eager=True)
    pic = f'<picture><source media="(max-width: 767px)" srcset="assets/img/hero-signage-portrait-480.webp 480w, assets/img/hero-signage-portrait-580.webp 580w" sizes="100vw">{img}</picture>'
    film = has('FILM_URL')
    video = f'<video class="hero-film" muted playsinline loop preload="none" poster="assets/img/hero-signage-1280.webp" data-src="{e(CFG["FILM_URL"])}" aria-hidden="true"></video>' if film else ''
    second = f'<button class="link-2" type="button" data-open-film>{H["film"]}</button>' if film else f'<a class="link-2" href="#mahakal">{H["begin"]}</a>'
    sound = f'<button class="sound-toggle" type="button" aria-pressed="false" data-sound>{H["sound"]}<span aria-hidden="true"></span></button>' if film else ''
    # keyword line inside the H1, small above the brand line, so the heading says what the page is about
    kw = f'<span class="hero-kw">{H["kw"]}</span>' if H.get('kw') else ''
    lines = ''.join(f'<span class="mask"><span class="mask-in">{l}</span></span>' for l in H['title'])
    S = H['stats']; rera = ph('MP_RERA_NUMBER')
    stats = [
        (S['acres'], f'<span data-count="{P["acres"]}">{P["acres"]}</span>'),
        (S['plots'], '<span data-count="1000" data-format="comma">1,000</span>+'),
        (S['minutes'], f'<span data-count="{P["distances"]["Ujjain"]}">{P["distances"]["Ujjain"]}</span>'),
    ] + ([(S['rera'], f'<span class="stat-rera">{rera}</span>')] if rera else [])
    dl = ''.join(f'<div><dt>{k}</dt><dd>{v}</dd></div>' for k, v in stats)
    return f'''<section class="hero" id="top" data-chapter="1" data-name="Arrival" aria-labelledby="hero-title"><div class="hero-media">{pic}{video}<div class="vignette" aria-hidden="true"></div><p class="ai-label">{C["ui"]["artist"]}</p></div><div class="hero-copy"><h1 id="hero-title" class="hero-title">{kw}{lines}</h1><p class="hero-sub">{H["sub"]}</p></div><div class="hero-actions">{primary()}{second}</div><div class="hero-bar"><span class="hero-bar-start"></span><span class="hero-bar-mid">{H["bar"]}</span><span class="hero-bar-end">{sound}</span></div><div class="intro-mark" aria-hidden="true"><svg viewBox="0 0 113.79 94.26"><path pathLength="1" d="M59.11 39.50L113.79 0.00C95.99 26.77 77.71 53.32 59.11 79.71L59.11 39.50Z"/><path pathLength="1" d="M54.68 57.40L0.00 14.55L54.68 94.26L54.68 57.40Z"/></svg></div></section>
<section class="stats" aria-label="Valencia Town at a glance"><dl class="wrap stats-row">{dl}</dl></section>'''
