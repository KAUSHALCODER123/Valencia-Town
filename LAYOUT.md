# Layout

The chapter architecture and mobile behavior are documented in [MOBILE-DESIGN.md](MOBILE-DESIGN.md).

Order: Hero → Idea → Scale → Masterplan → Landscape → Community → Generations → Product → Location → Film → Gallery → Private visit → FAQ → secondary location text → Footer.

Components are rendered by `scripts/components.py` from `data/project.json`; run `python scripts/build.py` after editing either. No build step is required on the static host because generated HTML is committed.
