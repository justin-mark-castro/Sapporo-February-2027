# Sapporo 2027 · Hokkaido Trip Planner

Static site (no build step) for GitHub Pages: itinerary, expenses, and a JPY / PHP / SGD calculator.

## Deploy
1. Replace the contents of your Pages repo with these files (keep `.nojekyll`).
2. Commit and push. In GitHub: Settings → Pages → Deploy from branch → `main` / root.

## Update data
All trip data lives in `data.js` (copied from the private Google Sheet, snapshot 2026-11-23).
- `expenses`: item, php, sgd, original, status ("Paid" marks it paid), note
- `paid`: running paid totals
- `flights`: PR 406 and PR 405 (times from PAL's published schedule, confirm against the booking)
- `itinerary`: one entry per day with `title`, `area`, `why` and a list of `stops` (`time`, `activity`, `location`, `notes`). `kind` is `arrival`, `day`, `flex` or `departure`

## Map, rail maps, hotel, budget
- `data.js` holds `hotel`, `places` (map pins, approximate coordinates), `budget` and `airlineLogo`.
- The Map tab uses Leaflet with OpenStreetMap tiles (loaded from unpkg). If it cannot load, the place list still works.
- The rail diagrams are hand-drawn SVG in `app.js` (`buildRail`).
- Add `assets/pal-logo.jpg` to show the Philippine Airlines logo.
