"""Questions. Accordion of real buttons with aria-expanded; answers open by default until the script takes over."""
from vt import C, CFG, P, e, has, ph, fmt, heading, primary

def pairs():
    F = C['faq']; d = P['distances']
    rera = ph('MP_RERA_NUMBER')
    if rera:
        link = f'<a href="{e(CFG["RERA_URL"])}" target="_blank" rel="noopener">rera.mp.gov.in</a>' if has('RERA_URL') else (ph('RERA_URL') or 'the MP RERA portal')
        approvals = fmt(F['approvals_with_rera'], rera=rera, rera_link=link)
    else:
        approvals = F['approvals_without_rera']
    approvals = approvals.replace('Trust chapter', '<a href="#trust">Trust chapter</a>')
    out = []
    for q, a in F['items']:
        a = approvals if a == 'APPROVALS_ANSWER' else fmt(a, ujjain=d['Ujjain'], saims=d['SAIMS'], vijay=d['Vijay Nagar'], godrej=e(CFG['GODREJ_PROJECT']), acres=e(CFG['GODREJ_ACRES']))
        out.append((q, a))
    return out

def render():
    F = C['faq']
    items = ''.join(f'''<div class="qa"><h3><button class="qa-btn" type="button" aria-expanded="true" aria-controls="qa-{i}" id="qa-b-{i}">{e(q)}<span class="qa-icon" aria-hidden="true"></span></button></h3><div class="qa-panel" id="qa-{i}" role="region" aria-labelledby="qa-b-{i}"><p>{a}</p></div></div>''' for i, (q, a) in enumerate(pairs()))
    return f'''<section class="chapter faq" id="faq" aria-labelledby="faq-title"><div class="wrap faq-grid"><div class="faq-intro">{heading(F, "faq-title", sub=False)}<p class="lede">{F["lede"]}</p><div class="actions">{primary()}</div></div><div class="qa-list">{items}</div></div></section>'''
