const colors=['#1268e6','#22a447','#f97316','#ef4444','#8b5cf6','#06b6d4','#f59e0b'];
let state=JSON.parse(localStorage.getItem('techTerritoryMap')||'null')||{selectedTech:0,techs:[{name:'Mike Johnson',color:colors[0]},{name:'David Smith',color:colors[1]},{name:'Alex Williams',color:colors[2]},{name:'Sam Brown',color:colors[3]}],territories:[]};
let map,drawnItems,drawControl,selectedLayer=null,layerById={};
const $=id=>document.getElementById(id);
function save(){localStorage.setItem('techTerritoryMap',JSON.stringify(state));render();}
function init(){
 map=L.map('map',{zoomControl:false}).setView([39.3,-96.5],4);
 L.control.zoom({position:'bottomright'}).addTo(map);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(map);
 drawnItems=new L.FeatureGroup().addTo(map);
 drawControl=new L.Control.Draw({position:'topright',draw:{polyline:false,rectangle:false,circle:false,marker:false,circlemarker:false,polygon:{allowIntersection:$('toggleOverlap').checked,shapeOptions:{color:getTech().color,fillColor:getTech().color,fillOpacity:.26,weight:3}}},edit:{featureGroup:drawnItems,remove:false}});
 map.addControl(drawControl);
 map.on(L.Draw.Event.CREATED,e=>{const id='t_'+Date.now();const tech=getTech();e.layer.options.territoryId=id;styleLayer(e.layer,tech.color);drawnItems.addLayer(e.layer);state.territories.push({id,name:$('territoryName').value||`${tech.name} Territory`,notes:$('territoryNotes').value||'',techIndex:state.selectedTech,geojson:e.layer.toGeoJSON()});selectLayer(e.layer);save();});
 map.on('draw:edited',e=>{e.layers.eachLayer(l=>{const t=state.territories.find(x=>x.id===l.options.territoryId);if(t)t.geojson=l.toGeoJSON();});save();});
 bind();render();
 if(!state.territories.length) seedDemo();
}
function getTech(){return state.techs[state.selectedTech]||state.techs[0];}
function bind(){
 $('addTech').onclick=()=>{const name=prompt('Technician name?');if(!name)return;state.techs.push({name,color:colors[state.techs.length%colors.length]});state.selectedTech=state.techs.length-1;save();};
 $('saveBtn').onclick=()=>{save();alert('Saved in this browser.');};
 $('exportBtn').onclick=exportCsv;
 $('applyInfo').onclick=()=>{if(!selectedLayer)return alert('Select a territory first.');const t=state.territories.find(x=>x.id===selectedLayer.options.territoryId);if(t){t.name=$('territoryName').value;t.notes=$('territoryNotes').value;t.techIndex=+$('techSelect').value;styleLayer(selectedLayer,state.techs[t.techIndex].color);save();}};
 $('deleteSelected').onclick=()=>{if(!selectedLayer)return;const id=selectedLayer.options.territoryId;drawnItems.removeLayer(selectedLayer);state.territories=state.territories.filter(t=>t.id!==id);selectedLayer=null;save();};
 $('techSelect').onchange=e=>{state.selectedTech=+e.target.value;refreshDraw();save();};
 $('toggleLabels').onchange=renderLayers;
 $('toggleOverlap').onchange=refreshDraw;
 $('searchBtn').onclick=searchPlace; $('searchBox').onkeydown=e=>{if(e.key==='Enter')searchPlace();};
 document.querySelectorAll('.quick').forEach(b=>b.onclick=()=>{$('searchBox').value=b.dataset.city;searchPlace();});
}
function refreshDraw(){map.removeControl(drawControl);drawControl=new L.Control.Draw({position:'topright',draw:{polyline:false,rectangle:false,circle:false,marker:false,circlemarker:false,polygon:{allowIntersection:$('toggleOverlap').checked,shapeOptions:{color:getTech().color,fillColor:getTech().color,fillOpacity:.26,weight:3}}},edit:{featureGroup:drawnItems,remove:false}});map.addControl(drawControl);}
function styleLayer(layer,color){layer.setStyle({color,fillColor:color,fillOpacity:.25,weight:3});layer.on('click',()=>selectLayer(layer));}
function selectLayer(layer){selectedLayer=layer;const t=state.territories.find(x=>x.id===layer.options.territoryId);if(!t)return;$('territoryName').value=t.name;$('territoryNotes').value=t.notes;$('techSelect').value=t.techIndex;state.selectedTech=t.techIndex;Object.values(layerById).forEach(l=>l.setStyle({weight:3}));layer.setStyle({weight:5});renderTechs();refreshDraw();}
function render(){renderTechs();renderSelect();renderLayers();renderTable();}
function renderTechs(){const list=$('techList');list.innerHTML='';state.techs.forEach((tech,i)=>{const count=state.territories.filter(t=>t.techIndex===i).length;const d=document.createElement('div');d.className='tech '+(i===state.selectedTech?'active':'');d.innerHTML=`<span class="dot" style="background:${tech.color}"></span><div><b>${tech.name}</b><small>${count} Territories</small></div><span>⋮</span>`;d.onclick=()=>{state.selectedTech=i;refreshDraw();save();};list.appendChild(d);});}
function renderSelect(){const sel=$('techSelect');sel.innerHTML=state.techs.map((t,i)=>`<option value="${i}">${t.name}</option>`).join('');sel.value=state.selectedTech;}
function renderLayers(){drawnItems.clearLayers();layerById={};state.territories.forEach(t=>{const layer=L.geoJSON(t.geojson).getLayers()[0];if(!layer)return;layer.options.territoryId=t.id;styleLayer(layer,state.techs[t.techIndex]?.color||colors[0]);drawnItems.addLayer(layer);layerById[t.id]=layer;if($('toggleLabels').checked){layer.bindTooltip(`${state.techs[t.techIndex]?.name||'Tech'} • ${t.name}`,{permanent:false,direction:'center',className:'label-tooltip'});}});}
function renderTable(){ $('territoryCount').textContent=state.territories.length; $('territoryTable').innerHTML=state.territories.map(t=>`<tr><td>${esc(t.name)}</td><td>${esc(state.techs[t.techIndex]?.name||'')}</td><td>Drawn Area</td><td>${esc(t.notes||'')}</td><td><button onclick="focusTerritory('${t.id}')">View</button> <button onclick="deleteTerritory('${t.id}')">Delete</button></td></tr>`).join('');}
window.focusTerritory=id=>{const l=layerById[id];if(l){map.fitBounds(l.getBounds(),{padding:[40,40]});selectLayer(l);}};window.deleteTerritory=id=>{state.territories=state.territories.filter(t=>t.id!==id);save();};
function exportCsv(){const rows=[['Territory Name','Technician','Notes']].concat(state.territories.map(t=>[t.name,state.techs[t.techIndex]?.name||'',t.notes||'']));const csv=rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='tech-territories.csv';a.click();}
async function searchPlace(){const q=$('searchBox').value.trim();if(!q)return;try{const res=await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q+', USA')}`);const data=await res.json();if(data[0])map.setView([+data[0].lat,+data[0].lon],9);else alert('Location not found');}catch(e){alert('Search needs internet connection.');}}
function seedDemo(){const demo=[{name:'Mike - West Coast',techIndex:0,notes:'Demo territory',pts:[[49,-124],[49,-114],[32,-114],[32,-124]]},{name:'David - Texas Area',techIndex:1,notes:'Demo territory',pts:[[37,-109],[37,-93],[26,-93],[26,-109]]},{name:'Alex - Midwest',techIndex:2,notes:'Demo territory',pts:[[49,-97],[49,-82],[36,-82],[36,-97]]},{name:'Sam - Southeast',techIndex:3,notes:'Demo territory',pts:[[36,-92],[36,-75],[25,-75],[25,-92]]}];demo.forEach(d=>{const coords=d.pts.map(p=>[p[0],p[1]]);const layer=L.polygon(coords);const id='t_'+Date.now()+Math.random();state.territories.push({id,name:d.name,notes:d.notes,techIndex:d.techIndex,geojson:layer.toGeoJSON()});});save();}
function esc(s){return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
window.addEventListener('load',init);
