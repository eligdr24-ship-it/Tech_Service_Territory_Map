# Tech Territory Map Leaflet v9

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


## v9 Updates
- Improved mobile layout to fit phone screens better.
- Removed all names/labels from colored areas on the map.
- Added nicer priority tech group cards when selecting an area.
- Added tech group info fields: phone, contact person, email, and notes.
- Kept search archive and New Search workflow.
- Improved modern rounded territory styling.


## v13 Admin Responsive Fixes
- Improved mobile layout for Admin Dashboard.
- Fixed Pending Area Requests header/card wrapping on web and mobile.
- Added better spacing between + Add Simple Area and Draw on Map buttons.
- Added responsive button grids for pending request actions.
- Improved card, side panel, and toolbar behavior on small screens.


## v15 Pending Requests UI Fix
- Fixed Pending Area Requests title wrapping/broken text in the admin right panel.
- Widened desktop details panel.
- Clean stacked pending card layout for desktop and mobile.
- Smaller mobile menu tabs for better screen fit.


## v16 Admin Mobile Responsiveness Fix
- Admin dashboard mobile layout rebuilt with compact top tabs.
- Search bar and action buttons are smaller on phones.
- Map height is reduced on mobile so panels are visible.
- Tech Groups / Tech Areas / Pending Requests panels now open below the map and scroll into view.
- No desktop functionality or existing data behavior changed.
