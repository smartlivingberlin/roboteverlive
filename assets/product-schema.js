/* erzeugt JSON-LD Product aus data/products.json */
(function(){
  const head = document.head;
  fetch('data/products.json',{cache:'no-store'})
    .then(r=>r.json())
    .then(items=>{
      const ld = {
        "@context":"https://schema.org",
        "@graph": items.map(x=>({
          "@type":"Product",
          "name": x.name,
          "category": x.category,
          "description": x.helps || undefined,
          "brand": x.brand || "Various",
          "image": x.image || undefined,
          "offers": x.price_range ? [{
            "@type":"Offer",
            "priceCurrency":"EUR",
            "price": (x.price_range.match(/€/g)||[]).length*100 + 99,  // grobe Platzhalter-Preisableitung
            "availability":"https://schema.org/PreOrder"
          }] : undefined
        }))
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify(ld);
      head.appendChild(s);
    }).catch(()=>{});
})();
