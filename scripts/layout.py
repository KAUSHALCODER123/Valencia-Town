"""Page frame shared by every chapter: head, header, menu, progress HUD, contact bars, footer and dialogs."""
import json, re
from vt import C, CFG, P, DEV, SITE_URL, ASSET_VERSION, e, ph, has, phone_ok, tel, wa, mark, primary, WA_ICON, fmt

FONT_CSS = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Jost:wght@300;400;500&family=Tiro+Devanagari+Hindi&display=swap'
DISPLAY_WOFF2 = 'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_s06KnTOig.woff2'
MAPS = f'https://www.google.com/maps/dir/?api=1&amp;destination={P["latitude"]},{P["longitude"]}'
U = C['ui']

def nav_links(): return ''.join(f'<a href="{h}">{label}</a>' for h, label in C['nav'])

def lang_toggle():
    if not CFG.get('ENABLE_HINDI'): return ''
    en, hi = ('aria-current="page" ', '') if C['lang'] == 'en' else ('', 'aria-current="page" ')
    return f'<div class="lang-toggle"><a {en}href="/" lang="en">{U["lang_en"]}</a><span aria-hidden="true">|</span><a {hi}href="/hi/" lang="hi">{U["lang_hi"]}</a></div>'

def phone_link(cls='', label=None):
    if phone_ok('PHONE'): return f'<a class="{cls}" href="{tel()}">{label or e(CFG["PHONE"])}</a>'
    p = ph('PHONE'); return f'<a class="{cls}" href="#" aria-disabled="true">{p}</a>' if p and DEV else ''

def email_link(cls=''):
    v = ph('EMAIL')
    if not v: return ''
    return f'<a class="{cls}" href="mailto:{e(CFG["EMAIL"])}">{v}</a>' if has('EMAIL') else f'<a class="{cls}" href="#" aria-disabled="true">{v}</a>'

def wa_link(cls, inner):
    if phone_ok('WHATSAPP_NUMBER'): return f'<a class="{cls}" href="{wa()}" target="_blank" rel="noopener">{inner}</a>'
    p = ph('WHATSAPP_NUMBER'); return f'<a class="{cls}" href="#" aria-disabled="true">{inner}{p}</a>' if p and DEV else ''

def header():
    return f'''<a class="skip-link" href="#main">{U["skip"]}</a><header class="header" id="header"><a class="wordmark" href="#top">{mark()}<span>Valencia Town</span></a><p class="header-label" aria-hidden="true">{C["hero"]["label"]}</p><div class="header-end">{lang_toggle()}{phone_link("header-phone")}<button class="header-cta" type="button" data-enquiry="Site Visit">{U["primary"]}</button><button class="menu-toggle" type="button" aria-haspopup="dialog" aria-controls="menu"><span class="menu-lines" aria-hidden="true"><i></i><i></i></span><span>{U["menu"]}</span></button></div></header>
<dialog id="menu" class="menu-dialog" aria-label="Menu"><div class="menu-top">{mark("menu-mark")}<button class="close" type="button" data-close aria-label="{U["close_menu"]}">×</button></div><nav class="menu-nav" aria-label="Main navigation">{nav_links()}</nav><div class="menu-foot">{primary()}{phone_link("menu-phone")}<p>{C["footer"]["address"]}</p>{lang_toggle()}</div></dialog>'''

def progress():
    return '<div class="progress-top" aria-hidden="true"><i></i></div>'

def bars():
    call = phone_link('bar-call', U['bar_call']) if phone_ok('PHONE') else (f'<a class="bar-call" href="#" aria-disabled="true">{ph("PHONE")}</a>' if DEV else '')
    whats = wa_link('bar-wa', WA_ICON + U['bar_whatsapp'] + ' ') if (phone_ok('WHATSAPP_NUMBER') or DEV) else ''
    return f'''<div class="mobile-bar">{call}{whats}<button class="bar-visit" type="button" data-enquiry="Site Visit">{U["bar_visit"]}</button></div>{wa_link("float-wa", WA_ICON + "<span>" + U["whatsapp"] + "</span>").replace('class="float-wa"', 'class="float-wa" aria-label="' + U["whatsapp"] + '"')}'''

def footer():
    F = C['footer']
    rera = ph('MP_RERA_NUMBER'); dev = ph('DEVELOPER_NAME'); legal = ph('LEGAL_ENTITY')
    facts = ''.join(x for x in [
        f'<p><span class="fk">{F["rera"]}</span> {rera}</p>' if rera else '',
        f'<p><span class="fk">{C["trust"]["developer"]}</span> {dev}</p>' if dev else '',
        f'<p><span class="fk">{C["trust"]["legal"]}</span> {legal}</p>' if legal else ''])
    contact = ''.join([phone_link('footer-link'), email_link('footer-link'), wa_link('footer-link whatsapp', WA_ICON + U['whatsapp'])])
    return f'''<footer class="footer" id="contact"><div class="wrap footer-grid"><div class="footer-brand">{mark("footer-mark")}<p class="footer-wordmark">Valencia Town</p><p class="footer-tagline">{P["tagline"]}</p><address>{F["address"]}</address><a class="link" href="{MAPS}" target="_blank" rel="noopener">{F["directions"]}</a></div><div class="footer-contact"><p>{F["hours"]}</p><div class="footer-links">{contact}</div>{primary()}</div><div class="footer-facts">{facts}</div></div><div class="wrap footer-bottom"><nav class="footer-nav" aria-label="Footer">{nav_links()}</nav><p class="footer-disclaimer">{F["disclaimer"]}</p><p class="footer-copy">© <span id="year">2026</span> Valencia Town.{(" " + legal + ".") if legal else ""} <button class="text-btn" type="button" data-privacy>{F["privacy"]}</button> <button class="text-btn" type="button" data-terms>{F["terms"]}</button></p></div></footer>'''

INTERESTS = [('Site Visit', 'A site visit'), ('Price List', 'The price list'), ('Layout', 'The layout'), ('Brochure', 'The brochure'), ('Plot Availability', 'Plot availability')]

def modals():
    side_contact = phone_link() + email_link()
    checks = ''.join(f'<label class="check"><input type="checkbox" name="interest" value="{v}"><span>{label}</span></label>' for v, label in INTERESTS)
    email_txt = f'write to {email_link()} or tell' if has('EMAIL') else 'tell'
    by = ph('LEGAL_ENTITY') or 'the developer'
    film = ''
    if has('FILM_URL'):
        film = f'<dialog id="film-modal" class="viewer-dialog film-dialog" aria-label="Valencia Town film"><button class="close" type="button" data-close aria-label="Close film">×</button><video controls playsinline preload="none" poster="assets/img/hero-signage-1280.webp" data-src="{e(CFG["FILM_URL"])}"></video></dialog>'
    return f'''<dialog id="enquiry-modal" class="enquiry-dialog" aria-labelledby="enquiry-title"><button class="close" type="button" data-close aria-label="Close enquiry">×</button><aside class="enquiry-side">{mark("enquiry-mark")}<div><h2 id="enquiry-title" class="enquiry-title">Let’s put down roots.</h2><p>Tell us a little about you. The team will call back to plan your visit.</p></div><div class="enquiry-side-foot">{('<p>Or reach us directly</p>' + side_contact) if side_contact else ''}<p class="fine">Visits by appointment, 10 am – 7 pm.</p></div></aside><div class="enquiry-main"><form id="enquiry-form" method="post" action="#" novalidate><label for="full-name">Full name</label><input id="full-name" name="name" autocomplete="name" minlength="2" maxlength="80" required placeholder="Your full name"><label for="mobile-number">Mobile number</label><div class="phone-field"><span>+91</span><input id="mobile-number" name="phone" type="tel" autocomplete="tel-national" inputmode="tel" maxlength="16" required pattern="(?:\\+91[ -]?)?[6-9][0-9 -]{{9,13}}" placeholder="10-digit mobile number" aria-describedby="phone-help"></div><small id="phone-help">Indian mobile number, with or without +91.</small><label for="email">Email <span class="optional">(optional)</span></label><input id="email" name="email" type="email" autocomplete="email" maxlength="120" placeholder="you@example.com"><label for="preferred-time">Preferred time to call <span class="optional">(optional)</span></label><select id="preferred-time" name="preferredTime"><option value="">Any time</option><option>Morning (10 am – 1 pm)</option><option>Afternoon (1 pm – 4 pm)</option><option>Evening (4 pm – 7 pm)</option></select><fieldset class="interests"><legend>I’d like</legend>{checks}</fieldset><div class="honeypot" aria-hidden="true"><label>Leave empty<input name="website" tabindex="-1" autocomplete="off"></label></div><p class="form-consent">By sending this request you agree to be contacted about Valencia Town. <button type="button" class="text-btn" data-privacy>How your details are used</button></p><button class="btn" type="submit">Send request</button><p id="form-status" role="status" aria-live="polite"></p></form><div id="enquiry-success" hidden><span class="success-mark" aria-hidden="true">✓</span><h3>Request received.</h3><p>The Valencia team will call you to plan your visit and answer your questions.</p><div class="next-steps"><a id="success-brochure" class="btn" hidden download>Download the brochure</a><a id="success-layout" class="btn" hidden download>Download the layout</a><a id="success-whatsapp" class="link whatsapp" hidden target="_blank" rel="noopener">{WA_ICON}Continue on WhatsApp</a></div><button class="link" type="button" data-close>Back to Valencia</button></div></div></dialog>
<dialog id="plan-modal" class="viewer-dialog" aria-labelledby="plan-modal-title"><div class="viewer-bar"><h2 id="plan-modal-title">The masterplan</h2><button class="close" type="button" data-close aria-label="Close masterplan">×</button></div><div class="zoom-controls"><button type="button" data-zoom="out" aria-label="Zoom out">−</button><output id="zoom-level">100%</output><button type="button" data-zoom="in" aria-label="Zoom in">+</button><button type="button" data-zoom="reset">Reset</button></div><div class="plan-pan" tabindex="0" aria-label="Zoomable masterplan. Use plus and minus to zoom, scroll or drag to pan."><img id="zoom-image" src="assets/img/master-layout-832.webp" alt="Full Valencia Town masterplan, artist’s impression" width="832" height="474"></div><p class="viewer-note">Use + to zoom, drag or scroll to explore, pinch on touch screens. Indicative layout; request the current layout for plot-level details.</p></dialog>
<dialog id="gallery-modal" class="viewer-dialog gallery-dialog" aria-labelledby="gallery-caption"><button class="close" type="button" data-close aria-label="Close gallery">×</button><div class="gallery-viewer"><button type="button" data-gallery-prev aria-label="Previous image">←</button><img id="gallery-image" alt=""><button type="button" data-gallery-next aria-label="Next image">→</button></div><div class="gallery-viewer-caption"><p id="gallery-caption" aria-live="polite"></p><span>{U["artist"]}</span><span id="gallery-count"></span></div></dialog>
<dialog id="privacy-modal" class="privacy-dialog" aria-labelledby="privacy-title"><button class="close" type="button" data-close aria-label="Close privacy details">×</button><h2 id="privacy-title" class="dialog-title">How your details are used.</h2><p><strong>Purpose.</strong> When you send a request, your name, mobile number, optional email, preferred time and selected interest are used by the Valencia Town sales team only to respond to that request. The page you were on and campaign referral details may be recorded with it.</p><p><strong>Retention.</strong> Enquiry details are kept for up to 24 months, or until you ask us to remove them, whichever is sooner. They are not sold or shared with third parties for their own marketing.</p><p><strong>Your choices.</strong> To correct or delete your details, {email_txt} the team member who contacts you. Please do not include sensitive personal information in your request.</p><p class="fine">Images are artist’s impressions for representation purposes. Specifications, amenities and layouts are indicative and subject to change. <button type="button" class="text-btn" data-terms>Terms of use</button></p></dialog>
<dialog id="terms-modal" class="privacy-dialog" aria-labelledby="terms-title"><button class="close" type="button" data-close aria-label="Close terms">×</button><h2 id="terms-title" class="dialog-title">The small print.</h2><p>This website is for information only and does not constitute an offer, invitation or legal commitment. All images are artist’s impressions. Dimensions, areas, amenities, specifications, layouts and drive times are indicative and subject to change without notice.</p><p>Prices, availability and payment plans are confirmed only in writing by {by}. Please verify the current project documentation and applicable approvals before making any decision.</p><p>References to other developments, including Godrej Greenview Estate, describe nearby activity from public sources only. Valencia Town is not affiliated with those developers.</p></dialog>{film}'''

def strip_tags(s): return re.sub(r'<[^>]+>', '', s)

def document(body, faq_pairs):
    M = C['meta']; url = SITE_URL
    schema = {'@context': 'https://schema.org', '@graph': [
        {'@type': 'Place', 'name': P['name'], 'url': url + '/', 'description': M['description'],
         'address': {'@type': 'PostalAddress', 'streetAddress': 'Indore–Ujjain Road', 'addressLocality': 'Shahna', 'addressRegion': 'Madhya Pradesh', 'addressCountry': 'IN'},
         'geo': {'@type': 'GeoCoordinates', 'latitude': P['latitude'], 'longitude': P['longitude']}},
        {'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': strip_tags(a)}} for q, a in faq_pairs]}]}
    data = {'formEndpoint': P['formEndpoint'], 'brochureUrl': CFG.get('BROCHURE_URL', ''), 'layoutUrl': CFG.get('LAYOUT_URL', ''),
            'whatsapp': wa() if phone_ok('WHATSAPP_NUMBER') else '', 'mapsQuery': f'{P["latitude"]},{P["longitude"]}', 'mapTitle': C['road']['map_title']}
    intro = "(function(h){h.classList.add('js');try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){h.classList.add('pre');if(!sessionStorage.getItem('vt-intro'))h.classList.add('intro')}}catch(e){}})(document.documentElement)"
    v = ASSET_VERSION
    head = f'''<!doctype html><html lang="{C["lang"]}"{' class="dev"' if DEV else ''}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>{M["title"]}</title><meta name="description" content="{M["description"]}"><meta name="theme-color" content="#070707"><meta name="robots" content="{"noindex" if DEV else "index, follow, max-image-preview:large"}"><link rel="canonical" href="{url}/"><meta property="og:type" content="website"><meta property="og:locale" content="en_IN"><meta property="og:site_name" content="Valencia Town"><meta property="og:title" content="{M["og_title"]}"><meta property="og:description" content="{M["description"]}"><meta property="og:url" content="{url}/"><meta property="og:image" content="{url}/assets/img/og-image.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{M["og_title"]}"><meta name="twitter:description" content="{M["description"]}"><meta name="twitter:image" content="{url}/assets/img/og-image.jpg"><link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml"><link rel="icon" href="assets/img/favicon.ico" sizes="32x32"><link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png"><script>{intro}</script><link rel="preload" as="image" href="assets/img/hero-signage-1280.webp" imagesrcset="assets/img/hero-signage-640.webp 640w, assets/img/hero-signage-1280.webp 1280w" imagesizes="100vw" media="(min-width: 768px)" fetchpriority="high"><link rel="preload" as="image" href="assets/img/hero-signage-portrait-580.webp" imagesrcset="assets/img/hero-signage-portrait-480.webp 480w, assets/img/hero-signage-portrait-580.webp 580w" imagesizes="100vw" media="(max-width: 767px)" fetchpriority="high"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preload" as="font" type="font/woff2" href="{DISPLAY_WOFF2}" crossorigin><link rel="stylesheet" href="{FONT_CSS}"><link rel="stylesheet" href="css/style.css?v={v}"><script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script></head>'''
    scripts = f'<script id="project-data" type="application/json">{json.dumps(data, ensure_ascii=False).replace("<", "&lt;")}</script><script src="assets/vendor/gsap.min.js" defer></script><script src="assets/vendor/ScrollTrigger.min.js" defer></script><script src="assets/vendor/lenis.min.js" defer></script><script src="js/main.js?v={v}" defer></script>'
    return head + '<body>' + header() + progress() + '<main id="main">' + body + '</main>' + footer() + bars() + modals() + scripts + '</body></html>'
