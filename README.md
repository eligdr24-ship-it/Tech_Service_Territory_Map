# Tech Territory Map Google v7

Google Maps version of the technician territory map.

## Features
- Google Maps source
- Google-style start page search bar
- Search by ZIP, city, address, state, or territory name
- Search archive + New Search button
- Colored smooth/modern territory areas
- Click area to auto-zoom and open side info panel
- Add/edit/delete tech groups
- Add/edit/delete/duplicate tech areas
- Draw new area on the map
- Edit territory points by dragging markers
- Multi-tech group priority per area
- Auto-fit map to active working areas
- Responsive desktop/mobile Apple-style design

## Render setup
1. Upload this project to GitHub.
2. Create a Render Web Service.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add Environment Variable:
   - `GOOGLE_MAPS_API_KEY=your_google_maps_api_key`

## Google Cloud API requirements
Enable these APIs for the key:
- Maps JavaScript API
- Geocoding API
- Places API

For production, restrict the API key by domain in Google Cloud.
