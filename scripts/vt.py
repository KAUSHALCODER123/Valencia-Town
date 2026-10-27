"""Shared state and helpers for the server-rendered chapters.

Three sources, one job each:
  site.config.json   values that still need client confirmation (placeholders)
  data/project.json  confirmed project facts (acres, distances, masterplan zones)
  content/<lang>.json all visible copy, so a Hindi file can be added later
"""
import json, sys
from html import escape as e
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CFG = json.loads((ROOT/'site.config.json').read_text(encoding='utf-8-sig'))
P = json.loads((ROOT/'data/project.json').read_text(encoding='utf-8-sig'))
DEV = '--dev' in sys.argv
LANG = next((a.split('=',1)[1] for a in sys.argv if a.startswith('--lang=')), 'en')
C = json.loads((ROOT/f'content/{LANG}.json').read_text(encoding='utf-8-sig'))
SITE_URL = P['siteUrl'].rstrip('/')
ASSET_VERSION = '20261027b'  # bump after stylesheet or script changes
MISSING = set()

def has(key):
    v = CFG.get(key)
    return bool(v) and not (isinstance(v, str) and v.strip().upper().startswith('TODO'))

def ph(key):
    """Config value as safe HTML. Missing: a visible [KEY NAME] marker in dev, None in production."""
    if has(key): return e(str(CFG[key]))
    MISSING.add(key)
    return f'<span class="ph">[{key.replace("_", " ")}]</span>' if DEV else None

def digits(key): return ''.join(ch for ch in str(CFG.get(key, '')) if ch.isdigit())
def phone_ok(key):
    d = digits(key)
    if len(d) == 10: d = '91' + d
    return len(d) == 12 and d.startswith('91') and d[2] in '6789' and len(set(d[2:])) > 1
def tel(key='PHONE'):
    d = digits(key); return 'tel:+' + (d if len(d) == 12 else '91' + d)
def wa(key='WHATSAPP_NUMBER'):
    from urllib.parse import quote
    d = digits(key); d = d if len(d) == 12 else '91' + d
    return f'https://wa.me/{d}?text={quote(C["ui"]["wa_message"])}'
REFS_USED = set()
def refs(text):
    """Link the first mention on the page of each landmark in data/project.json "references" to its official site."""
    for phrase, url in P.get('references', []):
        if url in REFS_USED: continue
        # first whole-word mention that is not part of the road name (Indore–Ujjain) and not already inside a link
        ok = lambda i: not (text[i - 1:i].isalnum() or text[i - 1:i] == '–' or text[i + len(phrase):i + len(phrase) + 1].isalnum() or text[i + len(phrase):i + len(phrase) + 1] == '–' or text.rfind('<a ', 0, i) > text.rfind('</a>', 0, i))
        i = next((m for m in range(len(text)) if text.startswith(phrase, m) and ok(m)), -1)
        if i < 0: continue
        text = text[:i] + f'<a class="ref" href="{url}" target="_blank" rel="noopener">{phrase}</a>' + text[i + len(phrase):]
        REFS_USED.add(url)
    return text

def fmt(text, **kw):
    for k, v in kw.items(): text = text.replace('{'+k+'}', str(v))
    return text

def image(name, alt, cls='', eager=False, sizes='100vw'):
    path = f'assets/img/{name}-1280.webp'
    w, h = Image.open(ROOT/path).size
    srcset = f'assets/img/{name}-640.webp 640w, {path} {w}w'
    if (ROOT/f'assets/img/{name}-1600.webp').exists(): srcset += f', assets/img/{name}-1600.webp 1600w'
    pri = ' fetchpriority="high"' if eager else ''
    return f'<img class="{cls}" src="{path}" srcset="{srcset}" sizes="{sizes}" width="{w}" height="{h}" alt="{e(alt)}" loading="{"eager" if eager else "lazy"}" decoding="{"sync" if eager else "async"}"{pri}>'

def primary(label=None, cls='btn'):
    return f'<button class="{cls}" type="button" data-enquiry="Site Visit">{label or C["ui"]["primary"]}</button>'
def secondary():
    return f'<button class="link-2" type="button" data-enquiry="Price List,Layout">{C["ui"]["secondary"]}</button>'
def ai_label(): return f'<p class="ai-label">{C["ui"]["artist"]}</p>'
def letterbox(): return '<div class="lb lb-top" aria-hidden="true"></div><div class="lb lb-bottom" aria-hidden="true"></div>'

def heading(ch, hid, sub=True, deva=None):
    """Chapter label, uppercase title built from masked lines (one <em> accent per title), italic sub-line."""
    lines = ''.join(f'<span class="mask"><span class="mask-in">{line}</span></span>' for line in ch['title'])
    d = f'<p class="deva" lang="hi">{deva}</p>' if deva else ''
    s = f'<p class="ch-sub">{ch["sub"]}</p>' if sub and ch.get('sub') else ''
    return f'{d}<h2 id="{hid}" class="ch-title">{lines}</h2>{s}'

MARK_SVG = (ROOT/'assets/img/logo-mark.svg').read_text(encoding='utf-8').replace('role="img" aria-label="Valencia Town"', 'aria-hidden="true" focusable="false"')
def mark(cls='brand-mark'): return f'<span class="{cls}">{MARK_SVG}</span>'
WA_ICON = '<svg class="wa-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35M12.05 21.78h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.94L0 24l6.3-1.65a11.9 11.9 0 0 0 5.74 1.46h.01c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41"/></svg>'
