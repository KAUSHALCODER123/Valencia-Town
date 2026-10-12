"""Chapter IX: Trust. A scannable grid of cards; every value comes from site.config.json or data/project.json."""
from vt import C, CFG, P, DEV, MISSING, e, ph, has, fmt, heading

def _list(key, fmt_item):
    items = CFG.get(key) or []
    if items: return '<ul class="card-list">' + ''.join(f'<li>{fmt_item(x)}</li>' for x in items) + '</ul>'
    MISSING.add(key)
    return f'<p><span class="ph">[{key.replace("_", " ")}]</span></p>' if DEV else None

def render():
    T = C['trust']
    dev, about, legal, rera = ph('DEVELOPER_NAME'), ph('DEVELOPER_ABOUT'), ph('LEGAL_ENTITY'), ph('MP_RERA_NUMBER')
    rera_link = f'<a class="link" href="{e(CFG["RERA_URL"])}" target="_blank" rel="noopener">{T["rera_link"]} <span aria-hidden="true">↗</span></a>' if has('RERA_URL') else (f'<p>{ph("RERA_URL")}</p>' if DEV else '')
    approvals = _list('APPROVALS', lambda a: f'<strong>{e(a.get("name", ""))}</strong><span>{e(a.get("reference", ""))}</span>')
    track = _list('DEVELOPER_TRACK_RECORD', lambda x: e(str(x)))
    sales = ph('SALES_GALLERY_ADDRESS')
    docs = ''.join(f'<li><a class="doc-link" href="{e(CFG[k])}" download>{label} <span aria-hidden="true">↓</span></a></li>' for k, label in (('BROCHURE_URL', T['brochure']), ('LAYOUT_URL', T['layout'])) if has(k))
    cards = [
        (T['developer'], f'<p class="card-value">{dev}</p>' + (f'<p class="card-text">{about}</p>' if about else '')) if dev else None,
        (T['legal'], f'<p class="card-value">{legal}</p>') if legal else None,
        (T['rera'], f'<p class="card-value card-mono">{rera}</p>{rera_link}') if rera else None,
        (T['approvals'], approvals) if approvals else None,
        (T['scale'], f'<p class="card-value">{fmt(T["scale_value"], investment=P["investment"])}</p>'),
        (T['documents'], f'<ul class="card-list docs">{docs}</ul>') if docs else None,
        (T['track'], track) if track else None,
        (T['sales'], f'<p class="card-value">{sales}</p><p class="card-text">{C["footer"]["hours"]}</p>') if sales else None,
    ]
    grid = ''.join(f'<article class="card rv"><h3 class="card-key">{k}</h3>{v}</article>' for k, v in (c for c in cards if c))
    return f'''<section class="chapter trust" id="trust" data-chapter="9" data-name="Trust" aria-labelledby="trust-title"><div class="wrap"><div class="chapter-head">{heading(T, "trust-title")}</div><div class="cards">{grid}</div></div></section>'''
