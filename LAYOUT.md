# Layout

The page is a vertical film. Every chapter is one full-screen render (or the aerial walkthrough) with a dark scrim and the words set bottom-left on a shared baseline: a display headline, one supporting sentence, one action.

Order: Hero (Valencia, The Address of Tomorrow) → The calling (Mahakal is calling you home: temple drawing, rituals, enquiry) → The road (route and drive times, optional map) → The plan (aerial film, full-plan viewer, layout request) → Walk the plan (place by place, previous/next) → Life (three frames: gardens, club, play) → A closer look (gallery strip) → Your plot (sizes, enquiry) → Come and see (visit, brochure) → Questions → The developer (rendered only when real facts exist) → Footer.

Components are rendered by `scripts/components.py` from `data/project.json`; run `python scripts/build.py` after editing either. The responsive rules are in `MOBILE-DESIGN.md`.
