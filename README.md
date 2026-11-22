# Sapporo 2027 · Hokkaido Trip Planner

Static site (no build step) for GitHub Pages: itinerary, expenses, and a JPY / PHP / SGD calculator.

## Deploy
1. Replace the contents of your Pages repo with these files (keep `.nojekyll`).
2. Commit and push. In GitHub: Settings → Pages → Deploy from branch → `main` / root.

## Update data
All trip data lives in `data.js` (copied from the private Google Sheet, snapshot 2026-11-22).
- `expenses`: item, php, sgd, original, status ("Paid" marks it paid), note
- `paid`: running paid totals
- `itinerary`: fill `time`, `activity`, `location`, `notes` per day
