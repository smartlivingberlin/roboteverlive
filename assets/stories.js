async function loadStories(){
  const grid = document.getElementById('storyGrid');
  const res = await fetch('data/stories.json',{cache:'no-store'});
  const items = await res.json();

  // Cards
  grid.innerHTML = items.map(x=>`
    <div class="col-md-6 col-lg-4">
      <article class="card h-100">
        <img src="${x.image}" class="card-img-top" alt="">
        <div class="card-body">
          <h5 class="card-title">${x.title}</h5>
          <div class="small text-muted">${x.author} • ${x.date}</div>
          <p class="mt-2">${x.excerpt}</p>
          ${(x.tags||[]).map(t=>`<span class="badge text-bg-light me-1">${t}</span>`).join('')}
        </div>
        <div class="card-footer">
          <a class="btn btn-sm btn-outline-primary" href="stories.html?slug=${x.slug}">Lesen</a>
        </div>
      </article>
    </div>`).join('');

  // Detail bei ?slug=
  const sp = new URLSearchParams(location.search);
  const slug = sp.get('slug');
  if(!slug) return;
  const s = items.find(i=>i.slug===slug);
  if(!s) return;

  // Modal-Inhalt bauen
  const body = document.createElement('div');
  body.innerHTML = `
    <img src="${s.image}" class="img-fluid w-100" alt="">
    <div class="p-3 p-md-4">
      <h2 class="h4 mb-1">${s.title}</h2>
      <div class="small text-muted mb-3">${s.author} • ${s.date}</div>
      ${s.body.map(p=>`<p>${p}</p>`).join('')}
      <div class="mt-3">${(s.links||[]).map(l=>`<a class="btn btn-sm btn-outline-secondary me-2" target="_blank" rel="noopener" href="${l.url}">${l.label}</a>`).join('')}</div>
    </div>`;

  // Modal anzeigen
  const el = document.getElementById('storyBody');
  el.replaceChildren(body);
  // Bootstrap Modal starten (falls verfügbar)
  if (window.bootstrap?.Modal) {
    new bootstrap.Modal(document.getElementById('storyModal')).show();
  } else {
    // Fallback: direkte Seite ohne Modal
    el.parentElement.classList.remove('modal','fade');
  }
}
document.addEventListener('DOMContentLoaded', loadStories);
