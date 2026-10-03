# Valencia Town – Landing page structure

Goal: get a qualified buyer to request the price sheet or book a site visit.
Primary CTA: **Get price & plot sizes** (form). Secondary: **WhatsApp**. Tertiary: **Call**.

---

## 1. First screen (hero)

| Element | Content |
|---|---|
| Location line | Shahna, Indore–Ujjain Road, Madhya Pradesh |
| Headline (H1) | Build your own home in a gated township on the Indore–Ujjain Road |
| Subheadline | Residential plots at Shahna with a clubhouse, a temple and forest gardens inside the gates. **Pre-launch:** early enquiries get first pick of plot locations. |
| Proof numbers | 48 acres · ~1,000 plots · ₹500 crore project (count up on load) |
| Primary CTA | Get price & plot sizes → scrolls to the form |
| Secondary CTA | WhatsApp (prefilled message) |
| Form (beside copy on desktop, below on mobile) | "Get the price sheet": name, mobile (+91), "Looking for" dropdown, button "Send me the price sheet", WhatsApp link, "No obligation" line |
| Visual | Full-bleed render of the entrance on the Indore–Ujjain Road, dark gradient for legibility, slow zoom-out on load |
| Always visible on mobile | Bottom bar: Call · WhatsApp · Book a site visit |

## 2. Body sections (promise → proof → workflow → objections)

| # | Section | Job | Key copy / elements |
|---|---|---|---|
| 1 | Overview | **Promise** | Client tagline as headline: "Not just a plot, but the beginning of a better life." Gated campus for every generation; build the home you want. Link: Get the brochure. |
| 2 | Project details | **Proof** (hard facts) | Land, plots, project size, status, plot sizes, price, possession, MP RERA. Unknowns say "On request" and become a CTA: "Get the price sheet". |
| 3 | How buying a plot works | **Workflow** (reduces friction) | 01 Ask for the price sheet → 02 Visit the site → 03 Choose your plot → 04 Book it. CTA: Start with step one. |
| 4 | Master plan | Proof | 3D layout image, four plain bullets. Link: Ask for the detailed layout. |
| 5 | Inside the gates | Benefits | Numbered amenity list; hovering or tapping a row swaps the picture. |
| 6 | Gallery | Proof (visual) | 8 renders with captions, lightbox. Labelled "Artist's impressions". |
| 7 | 3D walkthrough | Proof (immersive) | 46-sec video; loads only on click. |
| 8 | Location | Proof + objection ("is it too far?") | Distance table (to fill), click-to-load Google Map, directions link. |
| 9 | Why the Indore–Ujjain Road | Objection ("why here, why a township?") + local SEO | Corridor between Indore and Ujjain; planned township vs open plots; RERA check link. |
| 10 | CTA band | **Urgency** (honest) | "The best plots go first." Corner and garden-facing plots are limited; choose before public launch. CTAs: price + WhatsApp. |
| 11 | FAQ | **Objection handling** | Where, how big, amenities, gated?, plots on this road?, suits Indore and Ujjain buyers?, see the plot before booking?, how to visit. Also marked up as FAQ data for Google. |

## 3. Conversion path

| Element | Content |
|---|---|
| Final section | "See the plots before you decide": price sheet and plot sizes sent before the visit, "no surprises on site" |
| Contact rows | Call · WhatsApp · Site address |
| Form | "Book a site visit": name, mobile, "Looking for" (defaults to Site visit), button "Book my visit" |
| After submit | Button shows "Sending…", then "Thanks, {name}. We'll call you shortly." Lead goes to Google Sheets (Apps Script) with UTM/gclid/fbclid; fires `generate_lead` for GA4/GTM and `Lead` for the Meta Pixel |
| Fallbacks | WhatsApp link under every form; floating WhatsApp button (desktop); mobile bottom bar hides while the final form is on screen |

## Micro-interactions
Header hides on scroll down and returns on scroll up · copper scroll-progress line · current section underlined in nav · stat count-up · image wipe-reveal · buttons fill left-to-right with an arrow nudge, press-scale on tap · floating labels with copper underline on focus · invalid fields shake · FAQ animates open/closed · gallery captions slide up on hover · amenity image crossfade · WhatsApp tooltip appears once after 20 s · all motion switched off for users who prefer reduced motion.

## Still needed from the client
Phone/WhatsApp number, MP RERA number, plot sizes, price range, possession date, verified distances, exact site coordinates, live domain, real testimonials and site photos when available.
