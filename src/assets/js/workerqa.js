var RUNTIME = 'runtime';

var PRECACHE = 'precache-v1';
	PRECACHE_URLS = [
	  '../img/loading.svg',
	  '../img/logo-01.svg',
	  '../img/logo-02.png',
	  '../img/background/1.jpg',
	  '../img/background/2.jpg',
	  '../img/background/3.jpg',
	  '../img/background/4.jpg',
	  '../img/background/5.jpg',
	  '../img/background/6.jpg',
	  '../img/background/7.jpg',
	  'CryptoJS/aes.js',
	  'CryptoJS/aesUtil.js',
	  'CryptoJS/pbkdf2.js',
	  '../css/bootstrap/bootstrap.min.css',
	  '../css/main.css',
	  '../css/default-custom.css',
	  '../css/boostrap-custom.css',
	  'browserInfo.js',
	  'tinymce/tinymce.js',
	  'tinymce/themes/modern/theme.js',
	  'highlight/highlight.min.js',
	  'highlight/vs2015.min.css'
	];
	
var CURREMT = 'cache-apm-v2.1.8';
	CURREMT_URLS = [
	  '../../qa/inlandnet/index.html'
	];

// the rest below handles the installing and caching
self.addEventListener('install', event => {
  event.waitUntil(
     caches.open(PRECACHE).then(cache => cache.addAll(PRECACHE_URLS)).then(self.skipWaiting())
  );
  event.waitUntil(
     caches.open(CURREMT).then(cache => cache.addAll(CURREMT_URLS)).then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, CURREMT, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});