"""Chapter VII: Life. Five former sections in one chapter: pinned clip-path wipes on desktop, a stack on mobile.
Followed by one drag gallery, "A closer look"."""
from vt import C, image, heading, letterbox, ai_label

def render():
    L = C['life']; n = len(L['scenes'])
    scenes = ''.join(f'''<figure class="scene" data-i="{i}">{image(img, alt, "scene-img grade", sizes="100vw")}<div class="vignette" aria-hidden="true"></div><figcaption class="scene-cap"><p class="scene-num">{i + 1:02d} / {n:02d}</p><h3 class="scene-title">{title}</h3><p class="scene-text">{text}</p></figcaption>{ai_label()}</figure>''' for i, (img, title, text, alt) in enumerate(L['scenes']))
    items = ''.join(f'''<li class="strip-item"><button class="strip-btn" type="button" data-strip-item data-caption="{cap}" aria-label="{L["enlarge"]}: {cap.lower()}">{image(img, cap + ", artist’s impression", "strip-img", sizes="(max-width: 767px) 84vw, 56vw")}</button><p class="strip-cap">{cap}</p></li>''' for img, cap in L['gallery'])
    total = len(L['gallery'])
    gallery = f'''<section class="gallery" id="gallery" aria-labelledby="gallery-title"><div class="wrap gallery-head"><div><h2 id="gallery-title" class="ch-title ch-title-s">A closer <em>look</em></h2><p class="lede">{L["gallery_lede"]}</p></div><div class="gallery-nav"><p class="gallery-pos" aria-live="polite"><b>1</b> / {total}</p><button type="button" data-strip-step="-1" aria-label="{L["prev"]}">←</button><button type="button" data-strip-step="1" aria-label="{L["next"]}">→</button></div></div><div class="strip" tabindex="0" role="region" aria-label="{L["gallery_title"]}. Use the arrow keys to move."><ul class="strip-track">{items}</ul><div class="drag-cursor" aria-hidden="true">{L["drag"]}</div></div></section>'''
    return f'''<section class="life" id="life" data-chapter="7" data-name="Life" aria-labelledby="life-title"><div class="life-head chapter-head wrap">{heading(L, "life-title")}</div><div class="life-stage">{letterbox()}<div class="scenes">{scenes}</div></div></section>{gallery}'''
