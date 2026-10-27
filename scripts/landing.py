"""Search landing pages: one per place people search for (content/landing.json), each with its own URL, title,
description, H1, FAQ and links back into the homepage. Run by build.py after the English homepage."""
import json
import vt
from vt import ROOT, P, e, fmt, image, primary, secondary, refs
from layout import document

L = json.loads((ROOT/'content/landing.json').read_text(encoding='utf-8-sig'))
D = P['distances']
fill = lambda s: fmt(s, acres=P['acres'], ujjain=D['Ujjain'], vijay=D['Vijay Nagar'], saims=D['SAIMS'])

def pages(): return L['pages']
def path(pg): return f'/{pg["slug"]}/'

def body(pg):
    F = L['facts']
    facts = [(F['acres'], P['acres']), (F['sizes'], P['plotSizes']), (F['ujjain'], D['Ujjain']), (F['airport'], D['Indore Airport'])]
    dl = ''.join(f'<div><dt>{k}</dt><dd>{v}</dd></div>' for k, v in facts)
    sections = ''.join(f'<section class="lp-section"><h2>{h}</h2>' + ''.join(f'<p>{refs(fill(t))}</p>' for t in paras) + '</section>' for h, paras in pg['sections'])
    qa = ''.join(f'''<div class="qa"><h3><button class="qa-btn" type="button" aria-expanded="true" aria-controls="lpq-{i}" id="lpq-b-{i}">{e(q)}<span class="qa-icon" aria-hidden="true"></span></button></h3><div class="qa-panel" id="lpq-{i}" role="region" aria-labelledby="lpq-b-{i}"><p>{fill(a)}</p></div></div>''' for i, (q, a) in enumerate(pg['faq']))
    others = [(path(o), o['link']) for o in pages() if o is not pg]
    related = ''.join(f'<li><a href="{h}">{t}</a></li>' for h, t in pg['links'] + others)
    name, alt = pg['image']
    return (f'<section class="lp-hero" id="top"><div class="lp-hero-media">{image(name, alt, "lp-hero-img", eager=True)}<p class="ai-label">{vt.C["ui"]["artist"]}</p></div>'
            f'<div class="wrap lp-hero-copy"><nav class="lp-crumbs" aria-label="Breadcrumb"><ol><li><a href="/">{L["crumb_home"]}</a></li><li aria-current="page">{pg["crumb"]}</li></ol></nav>'
            f'<h1 class="lp-title">{pg["h1"]}</h1><p class="lede">{refs(fill(pg["intro"]))}</p><div class="actions">{primary()}{secondary()}</div></div></section>'
            f'<section class="stats" aria-label="Valencia Town at a glance"><dl class="wrap stats-row">{dl}</dl></section>'
            f'<article class="wrap lp-body">{sections}</article>'
            f'<section class="lp-faq wrap" aria-labelledby="lp-faq-title"><h2 id="lp-faq-title">{L["faq_title"]}</h2><div class="qa-list">{qa}</div></section>'
            f'<nav class="wrap lp-related" aria-labelledby="lp-related-title"><h2 id="lp-related-title">{L["related_title"]}</h2><ul>{related}</ul></nav>')

def build():
    """Write <slug>/index.html for every page; returns their paths for the sitemap."""
    out = []
    for pg in pages():
        vt.PAGE = {'path': path(pg), 'home': False}
        vt.REFS_USED.clear()
        html = document(body(pg), [(q, fill(a)) for q, a in pg['faq']], meta=pg['meta'], crumbs=[(pg['crumb'], path(pg))])
        (ROOT/pg['slug']).mkdir(exist_ok=True)
        (ROOT/pg['slug']/'index.html').write_text(html, encoding='utf-8')
        out.append(path(pg))
    vt.PAGE = {'path': vt.HOME, 'home': True}
    return out
