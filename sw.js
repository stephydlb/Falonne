self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('falonne-cache-v1').then(cache => {
      return cache.match(event.request).then(resp => {
        const fetchPromise = fetch(event.request).then(networkResp => {
          if(event.request.method === 'GET' && networkResp && networkResp.ok){
            cache.put(event.request, networkResp.clone());
          }
          return networkResp;
        }).catch(()=>resp);
        return resp || fetchPromise;
      });
    })
  );
});
