"""Responsive and interaction regression checks. All lead requests are mocked."""
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
OUT=Path('qa');OUT.mkdir(exist_ok=True)
WIDTHS=[360,375,390,430,768,1024,1440]
async def run():
 async with async_playwright() as pw:
  browser=await pw.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
  results=[]
  for width in WIDTHS:
   context=await browser.new_context(viewport={'width':width,'height':900 if width>=768 else 844},device_scale_factor=1,is_mobile=width<768,has_touch=width<1024,reduced_motion='reduce')
   page=await context.new_page();errors=[];page.on('pageerror',lambda error: errors.append(str(error)))
   await page.goto('http://127.0.0.1:4173/',wait_until='networkidle')
   await page.screenshot(path=str(OUT/f'hero-{width}.png'))
   sections=page.locator('main>section')
   section_results=[]
   for i in range(await sections.count()):
    section=sections.nth(i);await section.scroll_into_view_if_needed();await page.wait_for_timeout(60)
    section_results.append(await section.evaluate('''el=>({section:el.id||el.className, width:el.getBoundingClientRect().width, height:el.getBoundingClientRect().height, overflow:document.documentElement.scrollWidth>innerWidth, textOverflow:[...el.querySelectorAll('h1,h2,h3,p')].filter(n=>n.scrollWidth>n.clientWidth+1).map(n=>n.textContent)})'''))
    if width in [360,390,768,1024,1440]: await section.screenshot(path=str(OUT/f'section-{width}-{i:02}.png'))
   assert not any(s['overflow'] for s in section_results),f'Page overflow at {width}'
   assert not any(s['textOverflow'] for s in section_results),f'Text overflow at {width}: {section_results}'
   await page.locator('img[loading=lazy]').evaluate_all('(images)=>images.forEach(img=>img.loading="eager")')
   await page.wait_for_function('Array.from(document.images).every(img=>!img.getAttribute("src") || img.complete)')
   assert await page.locator('img').evaluate_all('(images)=>images.every(img=>!img.getAttribute("src") || (img.complete&&img.naturalWidth>0))'),'Broken image'
   assert not await page.locator('#rera-line').is_visible()
   assert await page.locator('a[href*="99999"]').count()==0
   assert await page.locator('video').get_attribute('src') is None,'Video preloaded'
   await page.locator('[data-plan-next]').click();assert await page.locator('#plan-detail h3').inner_text()=='Clubhouse'
   await page.locator('[data-plan-prev]').click();assert await page.locator('#plan-detail h3').inner_text()=='Grand entrance'
   await page.locator('[data-route-next]').click();assert await page.locator('#route-name').inner_text()=='Vijay Nagar'
   await page.locator('[data-open-plan]').first.click();await page.locator('[data-zoom="in"]').click();assert await page.locator('#zoom-level').inner_text()=='150%'
   assert await page.locator('#zoom-image').evaluate('el=>el.clientWidth>el.parentElement.clientWidth')
   await page.keyboard.press('Escape');assert not await page.locator('#plan-modal').is_visible()
   await page.locator('[data-gallery="0"]').click();await page.locator('[data-gallery-next]').click();assert '02 / 04' in await page.locator('#gallery-count').inner_text()
   await page.keyboard.press('ArrowRight');assert '03 / 04' in await page.locator('#gallery-count').inner_text();await page.keyboard.press('Escape')
   if width<1024:
    await page.locator('.menu-toggle').click();assert await page.locator('#mobile-menu').is_visible();await page.keyboard.press('Escape')
   await page.locator('#visit [data-enquiry="Site Visit"]').click()
   await page.locator('#full-name').fill('QA Local Test');await page.locator('#mobile-number').fill('9876543210')
   await page.route('https://script.google.com/**',lambda route: route.fulfill(status=200,content_type='application/json',body='{"ok":true}'))
   await page.locator('#enquiry-form button[type="submit"]').click();await page.locator('#enquiry-success').wait_for(state='visible')
   await page.keyboard.press('Escape');assert not await page.locator('#enquiry-modal').is_visible()
   await page.locator('#visit [data-enquiry="Brochure"]').click();assert await page.locator('#interest').input_value()=='Brochure'
   await page.locator('#full-name').fill('QA Failure Test');await page.locator('#mobile-number').fill('+91 9876543210')
   await page.unroute('https://script.google.com/**');await page.route('https://script.google.com/**',lambda route: route.fulfill(status=200,content_type='application/json',body='{"ok":false}'))
   await page.locator('#enquiry-form button[type="submit"]').click();await page.wait_for_function('document.querySelector("#form-status").textContent.includes("could not confirm")')
   assert await page.locator('#full-name').input_value()=='QA Failure Test'
   await page.screenshot(path=str(OUT/f'form-{width}.png'));await page.keyboard.press('Escape')
   await page.locator('[data-open-film]').click();await page.wait_for_timeout(300);assert await page.locator('video').get_attribute('src')=='assets/video/walkthrough.mp4'
   await page.keyboard.press('Escape');assert await page.locator('video').evaluate('v=>v.paused')
   assert errors==[],errors
   results.append({'width':width,'passed':True,'sections':section_results,'errors':errors})
   print(f'{width}px: sections, no overflow, assets, masterplan, gallery, menus, mocked form success/failure and film passed',flush=True)
   await context.close()
  (OUT/'results.json').write_text(json.dumps(results,indent=2),encoding='utf-8');await browser.close()
asyncio.run(run())
