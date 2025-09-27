async function loadStories(){
  const grid = document.getElementById('storyGrid');
  let items=[];
  try{
    const res = await fetch('data/stories.json?cachebust='+Date.now());
    items = await res.json();
  }catch(e){ console.error(e); items=[]; }

  const card = (x)=>`
    <div class="col-md-6 col-lg-4" data-story="${x.slug}">
      <article class="card h-100 shadow-sm">
        <img src="${x.image||'img/placeholder.jpg'}" class="card-img-top" alt="${x.title||''}" onerror="this.src='img/placeholder.jpg'">
        <div class="card-body">
          <h5 class="card-title">${x.title||'Story'}</h5>
          <div class="small text-muted">${x.author||'SmartAssist'} • ${x.date||''}</div>
          <p class="mt-2">${x.excerpt||''}</p>
          ${(x.tags||[]).map(t=>`<span class="badge text-bg-light me-1">${t}</span>`).join('')}
        </div>
        <div class="card-footer">
          <a class="btn btn-sm btn-outline-primary" href="stories.html?slug=${x.slug}">Lesen</a>
        </div>
      </article>
    </div>`;

  grid.innerHTML = items.map(card).join('');

  // Detail?
  const slug = new URLSearchParams(location.search).get('slug');
  if(!slug) return;
  const s = items.find(i=>i.slug===slug);
  if(!s) return;
  const body = `
    <img src="${s.image||'img/placeholder.jpg'}" class="img-fluid w-100" alt="">
    <div class="p-3 p-md-4">
      <h2 class="h4 mb-1">${s.title}</h2>
      <div class="small text-muted mb-3">${s.author||'SmartAssist'} • ${s.date||''}</div>
      ${(s.body||[]).map(p=>`<p>${p}</p>`).join('')}
      <div class="mt-3">${(s.links||[]).map(l=>`<a class="btn btn-sm btn-outline-secondary me-2" target="_blank" rel="noopener" href="${l.url}">${l.label}</a>`).join('')}</div>
    </div>`;
  const el = document.getElementById('storyBody');
  if(el){ el.innerHTML = body; }

  // Modal oder Fallback
  const modalEl = document.getElementById('storyModal');
  if (window.bootstrap?.Modal && modalEl) {
    new bootstrap.Modal(modalEl).show();
  } else if (el) {
    modalEl?.classList.remove('modal','fade');
  }
}
document.addEventListener('DOMContentLoaded', loadStories);
