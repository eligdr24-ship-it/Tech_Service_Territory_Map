let map, points=[], poly=null, markers=[], drawing=false, done=false;
function initSubmit(){
 map=L.map('submitMap',{zoomControl:false}).setView([40.25,-75],7);
 L.control.zoom({position:'bottomright'}).addTo(map);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);
 map.on('click',e=>{ if(drawing && !done) addPoint(e.latlng); });
 requestForm.onsubmit=submitRequest;
 startArea.onclick=startNewArea; undoPoint.onclick=undoPointFn; resetArea.onclick=clearAll; doneArea.onclick=finishArea;
 submitBtn.disabled=true;
 if(location.search.includes('submitted=1')) submitMsg.innerHTML='<b>Request saved.</b> You can start a new coverage request now.';
}
function startNewArea(){ clearAll(); drawing=true; done=false; submitBtn.disabled=true; submitMsg.textContent='Drawing mode is active. Click the map to add points.'; }
function addPoint(ll){points.push([ll.lat,ll.lng]);markers.push(L.circleMarker(ll,{radius:6,color:'#111827',fillColor:'#111827',fillOpacity:1,weight:2}).addTo(map));draw();}
function draw(){if(poly)map.removeLayer(poly);if(points.length>1)poly=L.polygon(points,{color:color.value,fillColor:color.value,fillOpacity:.25,weight:4,lineJoin:'round',lineCap:'round',className:'modernTerritory'}).addTo(map)}
function undoPointFn(){if(done)return; if(!points.length)return;points.pop();let m=markers.pop();if(m)map.removeLayer(m);draw();}
function clearAll(){points=[];markers.forEach(m=>map.removeLayer(m));markers=[];if(poly)map.removeLayer(poly);poly=null;drawing=false;done=false;submitBtn.disabled=true;submitMsg.textContent='Area reset. Click Start to draw a new area.';}
function finishArea(){ if(points.length<3){alert('Please add at least 3 points before clicking Done.');return} drawing=false; done=true; submitBtn.disabled=false; if(poly)poly.setStyle({fillOpacity:.34,weight:5}); submitMsg.innerHTML='<b>Area completed.</b> You can submit the request now.'; }
async function submitRequest(e){e.preventDefault(); if(!done||points.length<3){alert('Please draw the coverage area and click Done first.');return}
 const payload={groupName:groupName.value.trim(),contact:contact.value.trim(),phone:phone.value.trim(),email:email.value.trim(),whatsapp:whatsapp.value.trim(),areaName:areaName.value.trim(),color:color.value,notes:notes.value.trim(),points};
 submitMsg.textContent='Saving request...';
 const res=await fetch('/api/pending',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
 if(!res.ok){submitMsg.textContent='Could not save. Please check required fields.';return}
 history.replaceState(null,'','/submit-area?submitted=1');
 requestForm.reset(); color.value='#155eef'; clearAll(); submitMsg.innerHTML='<b>Request submitted for admin approval.</b> This page is reset for a new area.'; window.scrollTo({top:0,behavior:'smooth'});
}
color?.addEventListener('input',draw); window.onload=initSubmit;
