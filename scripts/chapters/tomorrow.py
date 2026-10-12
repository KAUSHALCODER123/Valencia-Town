"""Chapter V: Tomorrow. Dated milestones from site.config.json; a milestone without a source is never rendered."""
from vt import C, CFG, e, heading

def render():
    T = C['tomorrow']
    items = [{'when': T['today_when'], 'title': T['today_title'], 'line': T['today_line']}]
    items += [m for m in CFG.get('MILESTONES', []) if m.get('source_url') and m.get('enabled', True)]
    def card(i, m):
        src = f'<a class="m-source" href="{e(m["source_url"])}" target="_blank" rel="noopener">{T["source"]}: {e(m.get("source_name", ""))} <span aria-hidden="true">↗</span></a>' if m.get('source_url') else ''
        return f'<li class="milestone{" is-today" if i == 0 else ""}"><span class="m-dot" aria-hidden="true"></span><p class="m-when">{e(m["when"])}</p><h3 class="m-title">{e(m["title"])}</h3><p class="m-line">{e(m["line"])}</p>{src}</li>'
    return f'''<section class="chapter tomorrow" id="tomorrow" data-chapter="5" data-name="Tomorrow" aria-labelledby="tomorrow-title"><div class="tomorrow-pin"><div class="wrap chapter-head">{heading(T, "tomorrow-title")}<p class="lede rv">{T["lede"]}</p></div><div class="tl-viewport"><div class="tl-track"><div class="tl-rule" aria-hidden="true"><i></i></div><ol class="tl-list">{"".join(card(i, m) for i, m in enumerate(items))}</ol></div></div><div class="wrap"><p class="fine tomorrow-fine">{T["fine"]}</p></div></div></section>'''
