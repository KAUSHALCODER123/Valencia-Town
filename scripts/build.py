"""Build the static site.

  python scripts/build.py          production build (what Vercel serves): missing config values are left out
  python scripts/build.py --dev    development build: missing values show as [KEY NAME] on the page

Writes index.html, css/style.css (from css/parts), js/main.js (from js/parts), robots.txt and sitemap.xml.
"""
import importlib, subprocess, sys
sys.path.insert(0, __import__('os').path.dirname(__file__))
from vt import ROOT, P, C, CFG, DEV, LANG, MISSING
from layout import document

ORDER = ['hero', 'mahakal', 'road', 'growth', 'tomorrow', 'plan', 'life', 'plots', 'trust', 'visit', 'faq']
mods = [importlib.import_module('chapters.' + n) for n in ORDER if (ROOT/'scripts/chapters'/f'{n}.py').exists()]
body = ''.join(m.render() for m in mods)
faq = next((m.pairs() for m in mods if hasattr(m, 'pairs')), [])
html = document(body, faq)

out = ROOT/'index.html' if LANG == 'en' else ROOT/LANG/'index.html'
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding='utf-8')

css = '\n'.join(f'/* {p.name} */\n' + p.read_text(encoding='utf-8') for p in sorted((ROOT/'css/parts').glob('*.css')))
(ROOT/'css/style.css').write_text(css, encoding='utf-8')
js = '\n'.join(f'/* {p.name} */\n' + p.read_text(encoding='utf-8') for p in sorted((ROOT/'js/parts').glob('*.js')))
(ROOT/'js/main.js').write_text("/* Valencia Town. Generated from js/parts by scripts/build.py; edit the parts. */\n(() => {\n'use strict';\n" + js + "\n})();\n", encoding='utf-8')

if LANG == 'en':
    (ROOT/'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: ' + P['siteUrl'] + '/sitemap.xml\n', encoding='utf-8')
    (ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' + P['siteUrl'] + '/</loc><lastmod>' + __import__('datetime').date.today().isoformat() + '</lastmod></url></urlset>\n', encoding='utf-8')
    if CFG.get('ENABLE_HINDI') and (ROOT/'content/hi.json').exists():
        subprocess.run([sys.executable, __file__, '--lang=hi'] + (['--dev'] if DEV else []), check=True)

print(f'Built {out.relative_to(ROOT)} ({"development" if DEV else "production"}), css/style.css, js/main.js')
if MISSING:
    print('Still missing in site.config.json (' + ('shown as [KEY NAME]' if DEV else 'left off the page') + '):')
    for k in sorted(MISSING): print('  -', k)
