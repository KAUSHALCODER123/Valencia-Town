"""Render scripts/brochure/brochure.html to assets/docs/valencia-town-brochure.pdf (needs playwright and Chrome)."""
import re
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'scripts/brochure/brochure.html'
OUT = ROOT / 'assets/docs/valencia-town-brochure.pdf'

IMG = ROOT / 'scripts/brochure/_img'
IMG.mkdir(exist_ok=True)
for name in sorted(set(re.findall(r'_img/([\w-]+)\.jpg', SRC.read_text(encoding='utf-8')))):
    Image.open(ROOT / 'assets/img' / f'{name}.webp').convert('RGB').save(IMG / f'{name}.jpg', quality=80, optimize=True)

with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome')
    page = browser.new_page()
    page.goto(SRC.as_uri(), wait_until='networkidle')
    page.evaluate('document.fonts.ready')
    page.pdf(path=str(OUT), width='210mm', height='297mm', print_background=True, prefer_css_page_size=True)
    browser.close()
print('Wrote', OUT)
