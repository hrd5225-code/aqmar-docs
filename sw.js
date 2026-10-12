const V='docs-v3';
const A=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(V);await c.addAll(A);
  try{const l=await (await fetch('vendor/files.json',{cache:'no-store'})).json();await c.addAll(l)}catch(x){}
  self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const nav=e.request.mode==='navigate';
  e.respondWith((nav?fetch(e.request).catch(()=>caches.match('./index.html')):caches.match(e.request).then(r=>r||fetch(e.request))).then(res=>{
    if(res&&res.ok&&!nav){const cp=res.clone();caches.open(V).then(c=>c.put(e.request,cp))}
    return res}).catch(()=>caches.match(e.request)));
});
