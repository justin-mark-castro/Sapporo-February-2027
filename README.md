# Sapporo February 2027

Mobile-friendly trip tracker (overview, itinerary, expenses) that reads live from the
"Sapporo 2027" tab of the trip Google Sheet.

- Hosted on GitHub Pages (single `index.html`, no build step).
- The sheet must be shared as **Anyone with the link – Viewer** for the page to load it.
- Edit the sheet; the page refreshes every 5 minutes (and on reload). Last data is cached for offline use.
- Layout assumptions: expense log has an `Item` header in column A; itinerary has a `Day` header in column H.
