# Tech Territory Map Pro v4.0

Google-style search start page + Apple-style technician territory management dashboard.

## Deploy on Render
1. Upload this folder to a GitHub repo.
2. Create a Render Web Service.
3. Build command: `npm install`
4. Start command: `npm start`

## Main Features
- Google-style search start page for ZIP, city, county, state, address, or area name
- Apple-style side menu with:
  1. Map Overview
  2. Tech Groups
  3. Tech Areas
- Full add/edit/delete/duplicate for techs, groups, states, and territories
- Draw new map areas by hand
- Edit territory points/borders using map edit mode
- Smooth/modern territory shapes
- Multiple techs on the same area with priority order
- Tech names and priority numbers shown directly on the map
- Search result shows covered techs and priority order
- Auto-zoom to active working areas, not all USA
- Working states focused on NY, NJ, DE, PA, GA
- Export/import backup JSON and export CSV
- Responsive desktop/mobile layout

Data is saved in browser localStorage for simple deployment.
