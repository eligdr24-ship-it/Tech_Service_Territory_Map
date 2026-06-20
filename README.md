# Tech Territory Map Leaflet v10 - Public Area Request Page

## New in v10
- Added one-page public submission page: `/submit-area`
- Tech contact can fill group/contact info and draw one new coverage area
- After submit, the form resets for a new setup
- Tech cannot view or edit old submissions from this page
- Admin dashboard has **Pending Requests** menu
- Admin can preview, approve/add to map, reject, or delete requests
- Uses Leaflet/OpenStreetMap, no Google Maps API key required

## Run locally
```bash
npm install
npm start
```

Open:
- Admin dashboard: `http://localhost:3000`
- Public request page: `http://localhost:3000/submit-area`

## Render
Build command: `npm install`
Start command: `npm start`

Optional persistent disk:
- Mount path: `/data`
- Environment variable: `DATA_DIR=/data`
