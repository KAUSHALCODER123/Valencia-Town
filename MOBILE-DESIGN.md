# Design decisions

## Direction

Immersive and cinematic. The visitor looks before reading: every chapter is a full-screen render behind large serif type. Night forest (`#0B1511`) is the page, temple gold (`#D9A961`) is the only accent, ember (`#E07A3A`) is reserved for the diya flames in the temple drawing. Cormorant carries the display type; DM Sans carries everything that is read. Nothing on the page is set below 14px and body copy is 17–20px.

Sentence case throughout. No tracked capital labels, no numbered markers, no icons glued to buttons. Structure comes from the images and the type, not from chrome.

## The one memorable moment

The gold line drawing of the Mahakaleshwar shikhara above the Kshipra ghats (`assets/img/mahakal-line.svg`). It draws itself once when the chapter scrolls into view, and its four diya flames breathe. The hero image drifts slowly once on load. There is no other non-user-triggered motion; reduced motion turns both off.

## Shared behaviour

- Fixed header: 68px on phones, 76px on tablets, 80px on desktop. Transparent over the hero; dark glass once the page scrolls.
- Phones and tablets have a fixed 60px contact bar (call, WhatsApp, private visit). Desktop has the header's private-visit button and a floating WhatsApp pill. Chapter copy keeps clear of both.
- Every `.frame` chapter is `min-height: 100svh`; the copy sits at the bottom with a gradient scrim. On desktop the "artist's impression" note sits under the copy; on phones it sits under the header.
- Horizontal page overflow is forbidden. Only the gallery strip and the zoomed masterplan scroll sideways.
- Dialogs are native `<dialog>`s: enquiry (bottom sheet on phones, two-panel card from 768px), masterplan zoom, gallery viewer, privacy, terms and the phone menu. Escape, the close button and a click outside all close them.
- Inputs are 17px to avoid focus zoom. Success is shown only after the lead endpoint acknowledges with `ok: true`; a failed send keeps the visitor's entries.

## Chapters

| Chapter | Phone | Desktop |
|---|---|---|
| Hero | Portrait signage render; headline 40–76px; three facts (acres, plots, minutes to Ujjain) in a row | Landscape render, 72–124px headline, facts row, one gold button and one quiet link |
| The calling | Drawing above the copy; four rituals as a list; enquiry button | Drawing left, copy right; rituals in two columns; fits one screen at 1440×860 |
| The road | Four drive times in a 2×2 grid; directions button; optional inline map | Drive times in one row; the map loads below only when asked |
| The plan | Aerial film behind the headline; full-plan viewer and layout request | Same, brighter scrim so the plan reads |
| Walk the plan | Full-screen render of the selected place; counter, title, description; previous/next | Same with larger title |
| Life | Three full-screen frames, one line each | Same |
| A closer look | 86vw cards in a snap strip, 58svh tall; tap opens the viewer | 56vw cards, 66svh tall |
| Your plot | Size range as display type; two actions | Same, larger |
| Come and see | Visit and brochure actions | Same |
| Questions | Stacked; 18px questions, 17px answers | Two columns, intro sticky |
| Footer | Stacked | Four columns |

Short desktop screens (under 760px tall) step the display type down so each chapter still reads as one screen.

## Verification

`python scripts/qa.py` captures 360, 375, 390, 430, 768, 1024 and 1440px, checks for page and text overflow, broken images, the masterplan viewer, the gallery, the menu, and mocked form success and failure. Chrome emulation does not replace testing on real phones before a public campaign.
