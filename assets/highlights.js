async function renderHighlights(){
  try{
    const r = await fetch('data/highlights.json?cb='+Date.now());
    const h = await r.json();

    const hero = document.querySelector('#sa-hero');
    if(hero){
      hero.innerHTML = `
        <div class="hero-cover" style="background-image:url('${h.hero||'img/placeholder.jpg'}')">
          <div class="hero-overlay"></div>
          <div class="hero-inner">
            <h1 class="h3 fw-bold mb-2">Robotics & KI – Highlights</h1>
            <p class="mb-3">Entdecke Assistenz, Logistik und Smart Living – kuratiert & aktuell.</p>
            <a class="btn btn-light btn-sm link-stretch" href="katalog.html">Zum Katalog</a>
          </div>
        </div>`;
    }

    const wrap = document.querySelector('#sa-high-cards');
    if(wrap && Array.isArray(h.cards)){
      wrap.innerHTML = h.cards.map(c=>`
        <div class="col-md-4">
          <div class="card card-zoom h-100 shadow-sm">
            <img class="card-img-top object-cover h-220" src="${c.img}" alt="${c.title}" onerror="this.src='img/placeholder.jpg'">
            <div class="card-body">
              <h5 class="card-title">${c.title}</h5>
              <p class="text-muted">${c.text||''}</p>
              <a class="btn btn-outline-primary btn-sm" href="${c.link||'#'}">Mehr</a>
            </div>
          </div>
        </div>
      `).join('');
    }
  }catch(e){ console.warn('highlights error', e); }
}
document.addEventListener('DOMContentLoaded', renderHighlights);
