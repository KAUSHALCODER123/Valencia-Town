GOAL:    A viewer feels the 40-minute drive from Mahakal's dawn aarti to Valencia Town's gate, then wants to book a site visit.
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps, 37 s = 1110 frames, silent (no music source; website loop is muted anyway).
TIME:    Scenes overlap by 0.7 s (21 frames): the next scene's photo wipes in over the previous one.
         S1 night 0-5.2 | S2 drive 4.5-10.7 | S3 reveal 10-16.2 | S4 proof 15.5-24.2 | S5 tour 23.5-31.7 | S6 end 31-37

LOOK:    Medium = the project's own renders (artist's impressions), full-bleed, with one flat colour treatment each.
         Ground: ink #070707 / night #0F1713 panels; bone #F3EDE3 only for the masterplan page.
         Accent: amber #E2A84B (amber-deep #8A5A12 on bone), used for the time stamp, route line, one word of each title.
         Display: Cormorant Garamond 500, caps, tracking +7%, 180-260 px for titles, 360 px for proof numbers.
         Body: Jost 500, caps, tracking +28%, 32-36 px (never under 28 px except the 24 px legal line).
         Light: night overlay #0a1410 from 0.78 to 0.35 opacity across S1-S2 (dawn arriving); warm amber floor gradient 0 to 0.28 in S2.
         Camera: slow push 1.00 to 1.12-1.18 per shot, sine.inOut, origin on the vanishing point.
         Layout: left-aligned in the lower-left; nothing centred except the end-card lockup.
OBJECTS: Time stamp (4:00 AM, ~5:30 AM) is the film's clock. One amber route line (Ujjain - Valencia Town) is the spine of S2 and S4.
         Real logo mark from assets/img/logo-mark.svg. Real renders only.
MOTION:  Enter: power4.out, 0.7-0.9 s mask-rise per line, stagger 0.12 s. Camera: sine.inOut. Scene wipe: clip-path inset, power3.inOut, 0.7 s.
         Route dot: power2.inOut. No springs.
SHOTS:
  S1 0-5.2    Entrance road at night under the night overlay; "4:00 AM" 260 px amber lands by 0.9 s, "Bhasma Aarti at Shri Mahakaleshwar, Ujjain" by 1.6 s. Overlay lifts. Hands off: wipe.
  S2 4.5-10.7 Internal road push; "~5:30 AM" 200 px; "The drive home along the Indore-Ujjain Road"; route line draws left to right with the dot, ends at "Valencia Town".
  S3 10-16.2  Gate at sunset; logo mark, "VALENCIA / TOWN" 220 px, "At Shahna, on the Indore-Ujjain Road".
  S4 15.5-24.2 Split: night panel (left 44%) with a 360 px number, photo right. 40 min Mahakaleshwar / 25 min Vijay Nagar and Indore Airport / 10 min Sri Aurobindo Hospital, 2.6 s each, with the route line marking each stop.
  S5 23.5-31.7 Arch walk, Clubhouse, Children & families at 1.5 s each, then bone masterplan page: "48 acres", "planned as one", "1,000+ plots, 1,000-2,400 sq ft".
  S6 31-37    "Mahakal is calling you home." 150 px, then wipe to ink end card: mark + VALENCIA TOWN + valenciatown.in + "Book a site visit"; hold 2.8 s.
BANNED:  glow, bloom, particles, gradient meshes, glass cards, three-card rows, KPI grids, centred layouts, corner labels, logo docked in a corner,
         drifting text, everything fading at once, claims not on the website (no price, phone, RERA, developer name).
QA:      frame 0 (photo + text, not black); 2.0 s (time stamp + line fully legible); 12 s (title); 18 s, 21 s, 23 s (each proof number); 28 s (plan page); 36 s (end card).
