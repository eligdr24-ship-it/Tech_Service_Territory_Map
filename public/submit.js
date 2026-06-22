let map;
let points = [];
let poly = null;
let markers = [];
let drawing = false;
let editing = false;
let addPointActive = false;
let done = false;

const markerIcon = L.divIcon({
  className: 'editPointMarker',
  html: '<span></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

function initSubmit(){
  map = L.map('submitMap', { zoomControl:false }).setView([40.25,-75], 7);
  L.control.zoom({ position:'bottomright' }).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OpenStreetMap' }).addTo(map);
  map.on('click', onMapClick);
  requestForm.onsubmit = submitRequest;
  startArea.onclick = startNewArea;
  undoPoint.onclick = undoPointFn;
  resetArea.onclick = clearAll;
  doneArea.onclick = finishArea;
  editPoints.onclick = toggleEditPoints;
  addPointMode.onclick = toggleAddPointMode;
  submitBtn.disabled = true;
  if (location.search.includes('submitted=1')) {
    submitMsg.innerHTML = '<b>Request saved.</b> You can start a new coverage request now.';
  }
}

function onMapClick(e){
  if (addPointActive && points.length >= 3) {
    insertPointAtBestSegment(e.latlng);
    addPointActive = false;
    addPointMode.classList.remove('activeTool');
    submitMsg.textContent = 'New point added. Drag it to fine-tune the coverage area.';
    return;
  }
  if (drawing && !done && !editing) addPoint(e.latlng);
}

function startNewArea(){
  clearAll();
  drawing = true;
  done = false;
  editing = false;
  addPointActive = false;
  submitBtn.disabled = true;
  submitMsg.textContent = 'Drawing mode is active. Click the map to add points.';
}

function addPoint(ll, index = points.length){
  points.splice(index, 0, [ll.lat, ll.lng]);
  redrawMarkers();
  draw();
}

function makeMarker(ll, idx){
  const m = L.marker(ll, { draggable: editing, icon: markerIcon }).addTo(map);
  m.on('drag', ev => {
    const pos = ev.target.getLatLng();
    points[idx] = [pos.lat, pos.lng];
    draw(false);
  });
  m.on('click', () => {
    if (!editing || points.length <= 3) return;
    if (confirm('Remove this point from the coverage area?')) {
      points.splice(idx, 1);
      redrawMarkers();
      draw();
      submitMsg.textContent = 'Point removed. Click Done when the area looks correct.';
    }
  });
  return m;
}

function redrawMarkers(){
  markers.forEach(m => map.removeLayer(m));
  markers = points.map((p, idx) => makeMarker(L.latLng(p[0], p[1]), idx));
}

function draw(rebuildMarkers = false){
  if (poly) map.removeLayer(poly);
  if (points.length > 1) {
    poly = L.polygon(points, {
      color: color.value,
      fillColor: color.value,
      fillOpacity: done ? .34 : .25,
      weight: done ? 5 : 4,
      lineJoin:'round',
      lineCap:'round',
      className:'modernTerritory'
    }).addTo(map);
  }
  if (rebuildMarkers) redrawMarkers();
}

function undoPointFn(){
  if (editing) {
    submitMsg.textContent = 'Undo Point is disabled while editing. Click Done or Reset.';
    return;
  }
  if (done || !points.length) return;
  points.pop();
  redrawMarkers();
  draw();
}

function clearAll(){
  points = [];
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  if (poly) map.removeLayer(poly);
  poly = null;
  drawing = false;
  editing = false;
  addPointActive = false;
  done = false;
  submitBtn.disabled = true;
  editPoints.classList.remove('activeTool');
  addPointMode.classList.remove('activeTool');
  submitMsg.textContent = 'Area reset. Click Start to draw a new area.';
}

function finishArea(){
  if (points.length < 3) {
    alert('Please add at least 3 points before clicking Done.');
    return;
  }
  drawing = false;
  editing = false;
  addPointActive = false;
  done = true;
  submitBtn.disabled = false;
  editPoints.classList.remove('activeTool');
  addPointMode.classList.remove('activeTool');
  redrawMarkers();
  draw();
  if (poly) map.fitBounds(poly.getBounds(), { padding:[24,24], maxZoom:12 });
  submitMsg.innerHTML = '<b>Area completed.</b> You can submit the request now, or click Edit Points to adjust the shape.';
}

function toggleEditPoints(){
  if (points.length < 3) {
    alert('Draw at least 3 points before editing.');
    return;
  }
  editing = !editing;
  drawing = false;
  done = !editing;
  submitBtn.disabled = editing;
  addPointActive = false;
  addPointMode.classList.remove('activeTool');
  editPoints.classList.toggle('activeTool', editing);
  redrawMarkers();
  draw();
  submitMsg.innerHTML = editing
    ? '<b>Edit mode active.</b> Drag points to adjust. Click Add Point, then click the map to insert a new point. Click a point to remove it. Click Done when finished.'
    : '<b>Edit mode off.</b> Click Done to lock the area before submitting.';
}

function toggleAddPointMode(){
  if (!editing) {
    alert('Click Edit Points first, then use Add Point.');
    return;
  }
  addPointActive = !addPointActive;
  addPointMode.classList.toggle('activeTool', addPointActive);
  submitMsg.textContent = addPointActive
    ? 'Add Point mode is active. Click on the map near the border where you want to add a new point.'
    : 'Add Point mode is off.';
}

function insertPointAtBestSegment(latlng){
  if (points.length < 3) return;
  const p = map.latLngToLayerPoint(latlng);
  let bestIdx = points.length;
  let bestDist = Infinity;
  for (let i = 0; i < points.length; i++) {
    const a = map.latLngToLayerPoint(L.latLng(points[i][0], points[i][1]));
    const b = map.latLngToLayerPoint(L.latLng(points[(i+1)%points.length][0], points[(i+1)%points.length][1]));
    const d = distanceToSegment(p, a, b);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i + 1;
    }
  }
  addPoint(latlng, bestIdx);
}

function distanceToSegment(p, a, b){
  const x = p.x, y = p.y, x1 = a.x, y1 = a.y, x2 = b.x, y2 = b.y;
  const A = x - x1, B = y - y1, C = x2 - x1, D = y2 - y1;
  const dot = A*C + B*D;
  const lenSq = C*C + D*D;
  let t = lenSq ? dot / lenSq : 0;
  t = Math.max(0, Math.min(1, t));
  const px = x1 + t*C, py = y1 + t*D;
  return Math.hypot(x - px, y - py);
}

async function submitRequest(e){
  e.preventDefault();
  if (!done || points.length < 3) {
    alert('Please draw the coverage area and click Done first.');
    return;
  }
  const payload = {
    groupName: groupName.value.trim(),
    contact: contact.value.trim(),
    phone: phone.value.trim(),
    email: email.value.trim(),
    whatsapp: whatsapp.value.trim(),
    techCount: techCount.value.trim(),
    workingHours: workingHours.value.trim(),
    areaName: areaName.value.trim(),
    coverageArea: areaName.value.trim(),
    website: website.value.trim(),
    color: color.value,
    notes: notes.value.trim(),
    points
  };
  submitMsg.textContent = 'Saving request...';
  const res = await fetch('/api/pending', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
  if (!res.ok) {
    submitMsg.textContent = 'Could not save. Please check required fields.';
    return;
  }
  history.replaceState(null, '', '/submit-area?submitted=1');
  requestForm.reset();
  color.value = '#155eef';
  clearAll();
  submitMsg.innerHTML = '<b>Request submitted for admin approval.</b> This page is reset for a new area.';
  window.scrollTo({ top:0, behavior:'smooth' });
}

color?.addEventListener('input', () => draw());
window.onload = initSubmit;
