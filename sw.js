const CACHE = "smartassist-v1";
const ASSETS = [
  "index.html","katalog.html","news.html","partner.html","kontakt.html",
  "robots.txt","sitemap.xml","feed.xml",
  "assets/style.css","assets/app.js","assets/news.js"
];
self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener("fetch", e=>{
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request).catch(()=>caches.match("index.html")))
  );
});
