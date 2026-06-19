const http=require('http'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'public');
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};
http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]); if(p==='/' ) p='/index.html'; const f=path.join(root,p); if(!f.startsWith(root)) {res.writeHead(403);return res.end('Forbidden')} fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);return res.end('Not found')} res.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});res.end(d)})}).listen(process.env.PORT||3000,()=>console.log('Tech Territory Map running'));
