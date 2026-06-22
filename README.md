# Tech Territory Map Leaflet v22 — Request Edit Points

Update added to the Tech Coverage Request page:
- New **Edit Points** button so the tech contact can adjust the coverage area before submitting.
- New **Add Point** button inside edit mode.
- Existing points can be dragged to reshape the area.
- In edit mode, clicking a point allows removal when the polygon still has at least 3 points.
- Add Point mode inserts a new point into the closest polygon edge.
- Submission is still locked until the user clicks **Done**.
- After submit, the request goes to Admin Pending Requests and the page resets.

Run:
```bash
npm install
npm start
```
