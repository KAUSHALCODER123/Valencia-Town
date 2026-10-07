# Valencia Town

An editorial, mobile-first static website for Valencia Town at Shahna on the Indore–Ujjain corridor. Built with semantic HTML, local fonts, project WebP images and lightweight JavaScript. No framework or production dependencies.

## Preview

Run `python -m http.server 4173 --bind 127.0.0.1` from this directory, then open `http://127.0.0.1:4173`.

## Content and components

- `data/project.json`: single source for project facts, distances, contacts, lead endpoint and masterplan configuration.
- `scripts/components.py`: reusable server-rendered chapter functions, shared image/CTA helpers and metadata.
- `scripts/build.py`: generates `index.html`, `robots.txt` and `sitemap.xml`. Run `python scripts/build.py` after changing content. Build requires Python and Pillow (`python -m pip install -r scripts/requirements.txt`). Generated HTML is committed and deployable without Python.
- `css/style.css`: mobile-first styles, explicit 360–430px adjustments, tablet compositions and desktop layouts.
- `js/main.js`: enquiry dialog, verified submission states, masterplan discovery/zoom/pan, location selector, film and gallery.
- `MOBILE-DESIGN.md`: section-by-section mobile specification.

After stylesheet or script changes, bump the asset version in `scripts/components.py` and rebuild.

## Configuration before launch

Use real, client-approved values in `data/project.json` and rebuild:

- `SALES_PHONE` and `WHATSAPP_NUMBER`: international digits, e.g. country code 91 followed by the real mobile number. Empty or placeholder values stay hidden.
- `SALES_EMAIL`: actual sales address; empty stays hidden.
- `RERA_NUMBER`: current MP registration (expected `P-XXX-YY-NNN...`); omitted until a matching value is supplied. Verify against official project documents. Do not use this formatting check as legal validation.
- `siteUrl`: currently the existing `https://valenciatown.vercel.app` address. Canonical, social tags, robots and sitemap are generated consistently.
- `formEndpoint`: the existing Google Apps Script endpoint is retained. Submission shows success only after a readable JSON response with `ok: true`. Failure retains the visitor's entries. Never use opaque/no-CORS requests to simulate success.

Each masterplan item accepts percentage-based `x` and `y` coordinates (0–100). They remain `null` because verified amenity coordinates have not been supplied. When configured, only the currently selected hotspot is shown. Current exploration uses accessible previous/next controls with one description at a time. The supplied masterplan is 832px wide: zoom is available, but a higher-resolution approved plan is needed for reliable plot-level reading.

Existing project renders and local film are reused. No stock photography, invented amenities, testimonials, prices or approvals have been added. The site does not claim a pool despite its appearance in one unused supplied asset. Please have the client/legal team approve the disclaimer and privacy wording. A brochure request sends an enquiry; no brochure file was supplied.

## Lead handling

See `apps-script/README.md`. Existing attribution fields and source values remain compatible. Personal form fields are not sent to the analytics data layer. Live lead delivery must be verified in the client’s Sheet; automated tests mock the endpoint and do not create real leads.

## Verification

`python -m pip install -r scripts/requirements-qa.txt`

Start the local server, then run `python scripts/qa.py`. The runner uses installed Chrome on Windows and tests 360, 375, 390, 430, 768, 1024 and 1440px widths, all sections, overflow, images, dialogs, masterplan zoom, gallery, menus, mocked form success/failure, and on-demand video. Screenshots and results are saved to ignored `qa/`.

Performance: self-hosted fonts, responsive WebP images, explicit dimensions, eager hero only, lazy below-fold images, and no video request until play. Lighthouse targets are goals, not certified scores.
