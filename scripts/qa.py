"""Regression checks for the cinematic build. All lead requests are mocked; no real leads are created.

Start a local server first (python -m http.server 4173 --bind 127.0.0.1), then: python scripts/qa.py
Screenshots and results go to the ignored qa/ folder.
"""
import asyncio, json
from pathlib import Path
from playwright.async_api import async_playwright

URL = 'http://127.0.0.1:4173/'
OUT = Path('qa'); OUT.mkdir(exist_ok=True)
WIDTHS = {360: 780, 390: 844, 768: 1024, 1024: 768, 1440: 900}
CHAPTERS = ['top', 'mahakal', 'location', 'growth', 'tomorrow', 'plan', 'life', 'gallery', 'plots', 'trust', 'visit', 'faq']
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

PAGE_CHECKS = """(() => {
  const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !el.closest('dialog,[hidden],.honeypot'); };
  const small = [...document.querySelectorAll('body *')].filter(el => vis(el) && !el.closest('.ph,svg') && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(el).fontSize) < 12).map(el => el.className || el.tagName);
  const targets = [...document.querySelectorAll('a[href],button,input,select')].filter(el => vis(el)).filter(el => { const r = el.getBoundingClientRect(); return (r.height < 44 && r.width < 44) || r.height < 24; }).map(el => el.className || el.tagName);
  const unnamed = [...document.querySelectorAll('button,a[href]')].filter(el => vis(el) && !(el.getAttribute('aria-label') || el.textContent.trim())).map(el => el.className);
  const noAlt = [...document.images].filter(i => !i.hasAttribute('alt')).map(i => i.src);
  const labels = [...document.querySelectorAll('.menu-nav a')].map(a => a.textContent).join('|') === [...document.querySelectorAll('.footer-nav a')].map(a => a.textContent).join('|');
  return {overflow: document.documentElement.scrollWidth > innerWidth, small, targets, unnamed, noAlt, navLabelsMatch: labels,
          missingChapters: %s.filter(id => !document.getElementById(id))};
})()""" % json.dumps(CHAPTERS)

async def run():
    results = {}
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path=CHROME if Path(CHROME).exists() else None)
        for width, height in WIDTHS.items():
            for mode in ('reduce', 'no-preference'):
                ctx = await browser.new_context(viewport={'width': width, 'height': height}, is_mobile=width < 768, has_touch=width < 1024, reduced_motion=mode)
                page = await ctx.new_page(); errors = []
                page.on('pageerror', lambda e: errors.append(str(e)))
                page.on('console', lambda m: errors.append(m.text) if m.type in ('error', 'warning') else None)
                await page.route('https://script.google.com/**', lambda r: r.fulfill(status=200, content_type='application/json', body='{"ok":true}'))
                await page.goto(URL, wait_until='networkidle'); await page.wait_for_timeout(2500)
                key = f'{width}-{mode}'
                results[key] = await page.evaluate(PAGE_CHECKS)
                if mode == 'reduce':
                    for cid in CHAPTERS:
                        await page.evaluate(f"document.getElementById('{cid}').scrollIntoView()"); await page.wait_for_timeout(150)
                        await page.screenshot(path=str(OUT/f'{cid}-{width}.png'))
                    # Lead form: secondary CTA pre-ticks Price List + Layout and the mocked endpoint confirms.
                    await page.evaluate("document.querySelector('[data-enquiry=\"Price List,Layout\"]').click()")
                    ticked = await page.evaluate("[...document.querySelectorAll('input[name=interest]:checked')].map(i => i.value)")
                    await page.fill('#full-name', 'QA Test'); await page.fill('#mobile-number', '9876543210')
                    await page.click('#enquiry-form button[type=submit]'); await page.wait_for_timeout(600)
                    ok = await page.evaluate("!document.querySelector('#enquiry-success').hidden")
                    await page.keyboard.press('Escape')
                    closed = not await page.evaluate("document.querySelector('#enquiry-modal').open")
                    results[key]['form'] = {'ticked': ticked, 'success': ok, 'escCloses': closed}
                results[key]['errors'] = errors[:5]
                await ctx.close()
        await browser.close()
    (OUT/'results.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
    failed = {k: v for k, v in results.items() if v['overflow'] or v['small'] or v['targets'] or v['unnamed'] or v['noAlt'] or not v['navLabelsMatch'] or v['missingChapters'] or v['errors']
              or ('form' in v and not (v['form']['success'] and v['form']['escCloses'] and v['form']['ticked'] == ['Price List', 'Layout']))}
    print(json.dumps(failed, indent=2) if failed else f'All checks passed at {len(results)} width/motion combinations.')
    raise SystemExit(1 if failed else 0)

asyncio.run(run())
