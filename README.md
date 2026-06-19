# Tech Territory Map Leaflet v8

Google Maps has been removed. This version uses **Leaflet + OpenStreetMap**, so no Google API key or billing is needed.

## Main Features
- Free OpenStreetMap/Leaflet map source
- Google-style start search for ZIP, city, state, or area name
- Search archive + New Search button
- Apple-style dashboard
- Side menu:
  1. Map Overview
  2. Tech Groups
  3. Tech Areas
  4. States: NY, NJ, DE, PA, GA
- Colored smooth/modern territory areas
- Click territory = auto zoom + side info panel
- Add/Edit/Delete tech groups
- Add/Edit/Delete/Duplicate territories
- Edit territory points by dragging map points
- Add/remove points from territory
- Area info panel with group name, priority list, color, notes
- Responsive desktop/mobile layout
- Data saves automatically in browser localStorage

## Run Locally
```bash
npm install
npm start
```
Then open `http://localhost:3000`.

## Render Deploy
- Build command: `npm install`
- Start command: `npm start`

## Notes
This is a simple version focused on colored areas and tech group names. It does not require Google Maps API.
