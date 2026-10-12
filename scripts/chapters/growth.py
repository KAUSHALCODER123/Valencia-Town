"""Chapter IV: Growth. Bone section. Precise headline, sourced proof card, distance line, independence disclaimer."""
from vt import C, CFG, e, ph, has, fmt, heading, primary

def render():
    G = C['growth']; proj = e(CFG['GODREJ_PROJECT']); acres = e(CFG['GODREJ_ACRES'])
    km = ph('GODREJ_DISTANCE_KM')
    stat = [proj, fmt(G['stat_acres'], acres=acres)] + ([fmt(G['stat_km'], km=km)] if km else [])
    km_label = f'<span class="km"><span{" data-count=\"" + e(CFG["GODREJ_DISTANCE_KM"]) + "\"" if has("GODREJ_DISTANCE_KM") and str(CFG["GODREJ_DISTANCE_KM"]).isdigit() else ""}>{km}</span> km</span>' if km else f'<span class="km km-road">{G["same_road"]}</span>'
    src_name, src_url, src_date = ph('GODREJ_SOURCE_NAME'), ph('GODREJ_SOURCE_URL'), ph('GODREJ_SOURCE_DATE')
    link = f'<a class="link clip-link" href="{e(CFG["GODREJ_SOURCE_URL"])}" target="_blank" rel="noopener">{G["proof_link"]} <span aria-hidden="true">↗</span></a>' if has('GODREJ_SOURCE_URL') else (src_url or '')
    quote = f'<blockquote class="clip-quote"><p>“…{e(CFG["GODREJ_SOURCE_QUOTE"])}…”</p></blockquote>' if has('GODREJ_SOURCE_QUOTE') else ''
    clipping = f'''<article class="clipping rv" aria-labelledby="clip-title"><p class="clip-kicker">{G["proof_kicker"]}</p><h3 id="clip-title" class="clip-title">{src_name or ""}</h3><p class="clip-date">{src_date or ""}</p>{quote}{link}</article>'''
    distance = f'''<figure class="distance rv" aria-label="{G["pin_godrej"]} and {G["pin_home"]} on the Indore–Ujjain Road"><svg class="distance-line" viewBox="0 0 600 16" preserveAspectRatio="none" aria-hidden="true"><path d="M8 8 H592"/></svg><div class="d-pin d-godrej"><span class="d-dot" aria-hidden="true"></span><span>{G["pin_godrej"]}</span></div>{km_label}<div class="d-pin d-home"><span class="d-dot" aria-hidden="true"></span><span>{G["pin_home"]}</span></div></figure>'''
    return f'''<section class="chapter bone growth" id="growth" data-chapter="4" data-name="Growth" aria-labelledby="growth-title"><div class="wrap"><div class="chapter-head">{heading(G, "growth-title")}<p class="growth-stat rv">{" · ".join(stat)}</p><p class="lede rv">{fmt(G["lede"], project=proj, acres=acres)}</p></div><div class="growth-grid">{distance}<div class="proof">{clipping}<p class="growth-fine">{fmt(G["fine"], project=proj)}</p></div></div><div class="actions growth-actions">{primary()}</div></div></section>'''
