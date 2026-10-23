const CACHE='waste-inspection-v48';
const ASSETS=['./','./index.html','./manifest.json','./icon-180.png','./icon-512.png','./firebase-config.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(ch=>ch.put(req,c)).catch(()=>{});return r;}).catch(()=>caches.match(req)));
  }else if(u.hostname==='www.gstatic.com'){
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(ch=>ch.put(req,c)).catch(()=>{});return r;})));
  }
});
