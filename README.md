# Valencia-Town

Landing page for **Valencia Town**, a 48-acre gated township at Shahna, Indore–Ujjain Road, Madhya Pradesh.

Static site: HTML, CSS and vanilla JavaScript. Open `index.html` or serve the folder with any static host.

## Before going live
Edit the `CONFIG` block at the top of `js/main.js` (phone, WhatsApp, RERA, form endpoint) and search `index.html` for `TODO` (price, domain).

After any change to `css/style.css` or `js/main.js`, bump the `?v=` value on both links in `index.html` so phones load the new files.

Leads go to Google Sheets — see [`apps-script/README.md`](apps-script/README.md).

---

## Render brief (for the visualiser / architect)

### Technical specs (every image)
- **Resolution:** at least **2560 px wide**, ideally 3840 px (4K).
- **Format:** high-quality JPG or PNG (the site converts and compresses them).
- **Clean files:** no watermark, no scene labels (e.g. "Aerial Day"), no white borders.
- **Consistent look:** same time of day and colour grade across the set — golden hour suits the black and copper brand.
- **Two crops where noted:** landscape **16:9** (desktop) and portrait **4:5** (mobile / Instagram).

### Shot list

| # | Shot | Used for | Crop |
|---|---|---|---|
| 1 | **Hero: entrance gate from the Indore–Ujjain Road** — golden hour, cars and people for scale, empty sky/road on the left for the headline | First screen | 16:9 + 4:5 |
| 2 | **Coloured master plan (2D, top-down)** — plots, roads, clubhouse, temple, gardens, forest zone, entry, road frontage; legend and north arrow | Master plan section | Landscape + a clean version without labels |
| 3 | **Aerial 3D bird's-eye** of the full 48 acres with the main road visible | Walkthrough cover, gallery | 16:9 |
| 4 | **Clubhouse exterior**, evening, lit | Amenities (large tile) | 16:9 |
| 5 | **Clubhouse interior** (lounge / hall) | Amenities, gallery | 16:9 |
| 6 | **Temple** with landscaping | Amenities | 4:3 |
| 7 | **Children's playground** with families | Amenities | 4:3 |
| 8 | **Senior citizens' library** (interior or garden reading area) | Amenities | 4:3 |
| 9 | **Women's activity zone** | Amenities | 4:3 |
| 10 | **Meeting zone / community lawn** | Amenities | 4:3 |
| 11 | **Forest zone** — dense trees, walking trail | Amenities, gallery | 4:3 |
| 12 | **Internal road** — tree-lined, street lights, plots on both sides | Gallery, location | 16:9 |
| 13 | **Plot-level view** — an empty plot ready to build, markers and road access | "What you buy" | 16:9 |
| 14 | **Sample house on a plot** (optional, labelled as illustration) | Shows the end result | 16:9 |
| 15 | **Night shot of the gate or signage wall** | CTA band background | 16:9, darker, empty centre |

### Real photos (as important as renders)
- Actual site today: land, road frontage, boundary, any work in progress
- Drone photo of the site with the Indore–Ujjain Road visible
- Site office or hoarding on the road
- Team with visitors at the site (with consent)

On the page, real photos are labelled "Actual site photo" and renders "Artist's impression".

### Optional
- New **walkthrough video**: 60–90 s, finished quality, 1080p or 4K, no watermark
- **Vertical clips** (9:16, 15–30 s) for Instagram and Meta ads

### Priority if only a few are possible
1. #2 Master plan
2. #1 Hero
3. #6 Temple
4. #4 Clubhouse
5. #13 Plot view
6. Real site photos

---

## Details still needed
- Phone and WhatsApp number
- MP RERA registration number
- Price / starting price
- Developer name, years in business, projects delivered, bank tie-ups
- Real testimonials (with permission)
- Brochure PDF
- Google Analytics / Tag Manager and Meta Pixel IDs

---

## Local SEO – to do later

### Before launch
- **Set the real domain.** The canonical URL, Open Graph tags, sitemap and robots file still point to `https://www.valenciatown.in/`. Replace it with the domain the site goes live on (e.g. `valenciatown.vercel.app` or a custom domain).

### Off-site (bigger impact than on-page)
1. **Google Business Profile** for "Valencia Town" — exact map pin (22.902185, 75.864609), photos, phone, website link. Needed to appear on Google Maps for "plots near me" / "plots on Ujjain Road".
2. **Property portals** after RERA approval — 99acres, MagicBricks, Housing.com, each linking back to the site.
3. **Local backlinks** — local news, Indore real-estate blogs, Justdial and Sulekha listings.
4. **Google reviews** from site visitors.
5. **Hindi section or page** — many local searches are in Hindi (e.g. "इंदौर उज्जैन रोड पर प्लॉट").

### Already done on the page
- Title: "Plots on Indore–Ujjain Road, Shahna | Valencia Town"
- Landmarks in hero, location heading, nearby paragraph and footer: Sri Aurobindo Hospital (SAIMS) 10 min, Vijay Nagar 25 min, Devi Ahilyabai Holkar Airport 25 min, Ujjain 40 min
- Local FAQs with FAQ structured data
- Location-based image alt text
- Geo tags and structured address with coordinates
