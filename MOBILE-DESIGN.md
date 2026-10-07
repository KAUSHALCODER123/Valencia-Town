# Mobile design decisions

The current restraint brief supersedes the earlier statistics-row and permanent sticky-CTA direction. Each chapter carries one idea. Breakpoints are intentionally defined for 360, 375, 390 and 430px; 768 and 1024px have distinct tablet compositions. No content requires hover.

## Shared behavior

- Mobile gutters: 24px, increasing to 28px at 430px. Most chapters use 100px top/bottom spacing; full-image chapters use 85–90px inset text. Long functional content uses natural height rather than forced viewport height.
- Fixed 76px header; no permanent bottom CTA or floating mobile promotions. Anchor targets account for the header. Menu is a full-screen native dialog, with Escape, close button, focus containment and background scroll lock.
- Primary text and form inputs remain readable. Inputs are 16px to avoid mobile focus zoom. Labels/captions are deliberately secondary.
- Horizontal page overflow is forbidden. Only gallery and zoomed masterplan can scroll horizontally.
- Text/image reveals run once and never pin or hijack scrolling. Reduced motion disables animation. Controls remain available without hover.
- Zoomable plan: +/−/reset, drag, two-pointer pinch and keyboard controls. Gallery: swipe, previous/next buttons and arrow keys. Video loads only after the visitor presses play; closing pauses playback.

| Chapter | Mobile type / spacing | Crop and content sequence | CTA / touch / scrolling / motion / sticky behavior |
|---|---|---|---|
| Hero | 48–60px serif; 13–14px support; 95svh, small-height minimum 580px | Entrance render, 53% focal point; logo above, title and one short line below; single discovery link | Anchor tap; no carousel, form, statistics or sticky CTA. Slow image scale, disabled for reduced motion |
| Idea | 46–51px serif; 100px section padding | Heading → two-line philosophy → small garden image aligned right at 65% width, 1.35 crop | No CTA; vertical reading; one-time reveal; no sticky element |
| Scale | 210–240px numeral; 37px supporting serif; 90px top | One large number, then acres, then one short thought; plot count appears lower after a deliberate gap | No CTA/scroll capture; reveal once; no horizontal scrolling or sticky elements |
| Masterplan | 40–52px heading; 30px place name; 100px padding | Heading → contained whole plan → selected place → utility links. No eight-label list | Tap next/previous reveals one place; full-plan dialog offers zoom/pan/pinch. 44px controls. No auto advance or section pinning |
| Landscape | 57px display; 14px short support; 92svh | Full-height actual garden render, 52% crop; copy at lower edge above a readability overlay | No CTA or horizontal scroll; gentle copy reveal; no sticky UI |
| Community | 46px heading; 14px copy; 100px padding / 37px gap | Clubhouse image first, then label/headline/two-line copy. 1.15 image crop at 44% x / 55% y keeps the clubhouse focal | No CTA or hover dependency; no horizontal scrolling or sticky UI |
| Generations | 47px serif; 14px support; 85px text inset | Actual playground render, focal position 58%; three short headline lines at lower edge | No CTA, auto slideshow or horizontal scroll; reveal once; no sticky UI |
| Product | 49px heading and size; 100px section spacing, 50px content gap | Heading → small line drawing → size range → availability note → one CTA | Tap opens enquiry with Plot Availability selected. No inventory cards or horizontal scrolling; no sticky UI |
| Location | 46px heading; 66px active time; 100px padding | Heading → short connection thought → directions → schematic route → one travel time | Next/previous changes destination manually, with live announcement. No four-number grid, autoplay or sticky map |
| Film | 47px heading; 100px section padding | Title → 4:3 cinematic entrance crop at 55% focal point | 66px play target opens dialog. Video is never loaded/autoplayed on page arrival. Native controls and close; no sticky element |
| Gallery | 40–52px heading; 100px padding | One 88%-width image, next frame hinted; 330px image height (380px at 430px), caption underneath | Horizontal touch carousel with scroll snap; tap opens full-image contain viewer; swipe/arrows move images. No auto advance/sticky controls |
| Visit | 55px heading; 100px padding; minimum 75svh | Headline → two-line support → main visit button → quieter brochure text link | One primary action opens modal; no inline form, horizontal scrolling or fixed CTA |
| FAQ / SEO | 48px heading; 14px accordion text; 100px section spacing | Heading first, then thin-divider questions. SEO copy stays collapsed below | Native keyboard/tap details. Vertical flow, no hover dependency or sticky UI; reduced-motion safe reveal |
| Footer | 57px wordmark; 13px description | Wordmark → description → wrap-safe links → approved contacts if configured → legal | No placeholder phone/RERA. No horizontal overflow, animation or sticky element |
| Enquiry modal | 49px heading; 16px inputs; 25px side padding | Heading → name → phone → interest → consent → submit/status | Native dialog focus containment. Internal vertical scroll within dynamic viewport. Preserves values on error; success only after server acknowledgement |

## Tablet compositions

At 768px, navigation stays compact; the idea image sits beside the text, community becomes two columns, product and location become balanced two-column layouts, and gallery becomes an asymmetric photo story. Image chapters remain full-width. At 1024px, navigation becomes inline, gutters increase to 55px, and section spacing increases to 135px. No permanent mobile or tablet CTA covers content.

## Validation evidence

`scripts/qa.py` captures and checks each chapter at every requested width, plus 1440px desktop. Generated screenshots and machine-readable `qa/results.json` are local verification artifacts. Browser tests use mocked lead responses, never real submissions. Chrome emulation does not substitute for testing physical iOS/Android keyboards and assistive technologies before a public campaign.
