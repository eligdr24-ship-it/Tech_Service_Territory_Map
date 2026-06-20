const http=require('http'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'public');
const dataDir=process.env.DATA_DIR||path.join(__dirname,'data');
const pendingFile=path.join(dataDir,'pending_requests.json');
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};
function ensure(){if(!fs.existsSync(dataDir))fs.mkdirSync(dataDir,{recursive:true}); if(!fs.existsSync(pendingFile))fs.writeFileSync(pendingFile,'[]')}
function readPending(){ensure(); try{return JSON.parse(fs.readFileSync(pendingFile,'utf8'))}catch(e){return []}}
function writePending(list){ensure(); fs.writeFileSync(pendingFile,JSON.stringify(list,null,2))}
function send(res,code,obj){res.writeHead(code,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'});res.end(JSON.stringify(obj))}
function body(req){return new Promise(resolve=>{let b='';req.on('data',c=>{b+=c;if(b.length>1e6)req.destroy()});req.on('end',()=>{try{resolve(JSON.parse(b||'{}'))}catch(e){resolve({})}})})}
http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://local');
 if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'GET,POST,DELETE'});return res.end()}
 if(url.pathname==='/api/pending'&&req.method==='GET'){return send(res,200,readPending())}
 if(url.pathname==='/api/pending'&&req.method==='POST'){
  const r=await body(req); if(!r.groupName||!r.areaName||!Array.isArray(r.points)||r.points.length<3)return send(res,400,{error:'Missing group, area name, or drawn area'});
  const list=readPending(); const item={id:Math.random().toString(36).slice(2,10),status:'pending',createdAt:new Date().toISOString(),...r}; list.unshift(item); writePending(list); return send(res,200,{ok:true,id:item.id});
 }
 if(url.pathname.startsWith('/api/pending/')&&req.method==='POST'){
  const [, , , id, action]=url.pathname.split('/'); const list=readPending(); const item=list.find(x=>x.id===id); if(!item)return send(res,404,{error:'Not found'}); item.status=action==='reject'?'rejected':'approved'; item.reviewedAt=new Date().toISOString(); writePending(list); return send(res,200,{ok:true,item});
 }
 if(url.pathname.startsWith('/api/pending/')&&req.method==='DELETE'){
  const id=url.pathname.split('/').pop(); writePending(readPending().filter(x=>x.id!==id)); return send(res,200,{ok:true});
 }
 let p=decodeURIComponent(url.pathname); if(p==='/' ) p='/index.html'; if(p==='/submit-area') p='/submit.html';
 const f=path.join(root,p); if(!f.startsWith(root)) {res.writeHead(403);return res.end('Forbidden')}
 fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);return res.end('Not found')} res.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});res.end(d)})
}).listen(process.env.PORT||3000,()=>console.log('Tech Territory Map v10 running'));
