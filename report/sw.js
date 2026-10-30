const CACHE='report-v3';
const ASSETS=['./','./index.html','./manifest.json','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('report-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(ch=>ch.put(req,c)).catch(()=>{});return r;}).catch(()=>caches.match(req)));
  }else if(['cdnjs.cloudflare.com','fonts.googleapis.com','fonts.gstatic.com'].includes(u.hostname)){   // jsPDF、Material Symbols 字型：先用快取，離線也能用
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(ch=>ch.put(req,c)).catch(()=>{});return r;})));
  }
});
