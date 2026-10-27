"""Chapter VI: The Plan. Aerial masterplan with zone markers (estimated positions from data/project.json)."""
from vt import C, P, CFG, heading, secondary, ai_label

def render():
    L = C['plan']; zones = P['masterplan']
    markers = ''.join(f'<li class="zone" style="left:{z["x"]}%;top:{z["y"]}%"><span class="z-dot"><span>{i + 1}</span></span><span class="z-label">{z["title"]}</span></li>' for i, z in enumerate(zones))
    legend = ''.join(f'<li><span class="lg-num">{i + 1:02d}</span><span class="lg-name">{z["title"]}</span><span class="lg-text">{z["description"]}</span></li>' for i, z in enumerate(zones))
    # Nearby Godrej development: numbered after the zones, styled apart, never lit by the zone scroll
    nb = P.get('neighbour')
    if nb:
        n = len(zones) + 1
        name = CFG.get('GODREJ_PROJECT') or nb['label']
        acres = f'Godrej Properties’ plotted development of about {CFG["GODREJ_ACRES"]} acres on the same Indore–Ujjain Road. ' if CFG.get('GODREJ_ACRES') else ''
        markers += f'<li class="zone-ext" style="left:{nb["x"]}%;top:{nb["y"]}%"><span class="z-dot"><span>{n}</span></span><span class="z-label">{name}</span></li>'
        legend += f'<li class="lg-ext"><span class="lg-num">{n:02d}</span><span class="lg-name"><a href="#growth">{name}</a></span><span class="lg-text">{acres}{nb["description"]}</span></li>'
    return f'''<section class="chapter plan" id="plan" data-chapter="6" data-name="The Plan" aria-labelledby="plan-title"><div class="wrap"><div class="chapter-head">{heading(L, "plan-title")}<p class="lede rv">{L["lede"]}</p></div><figure class="plan-stage"><div class="plan-zoom"><img class="plan-img" src="assets/img/master-layout-832.webp" width="832" height="474" alt="{L["alt"]}" loading="lazy" decoding="async"><ol class="zones" aria-hidden="true">{markers}</ol></div>{ai_label()}</figure><p class="plan-note">{L["note"]}</p><ol class="zone-legend">{legend}</ol><div class="actions plan-actions"><button class="btn" type="button" data-open-plan>{L["explore"]}</button>{secondary()}</div></div></section>'''
