"""Chapter X: Visit. Letterboxed gate render; the primary action opens the existing lead form."""
from vt import C, image, heading, ai_label, primary, secondary

def render():
    V = C['visit']
    return f'''<section class="opener visit" id="visit" data-chapter="10" data-name="Visit" aria-labelledby="visit-title"><div class="opener-media">{image("gate-sunset", V["alt"], "grade")}<div class="vignette" aria-hidden="true"></div></div><div class="opener-copy">{heading(V, "visit-title")}<p class="lede rv">{V["lede"]}</p><div class="actions">{primary()}{secondary()}</div></div>{ai_label()}</section>'''
