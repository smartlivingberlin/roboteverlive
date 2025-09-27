const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const state = { items:[], filtered:[], tags:new Set(), query:'', sort:'name-asc' };

function setTheme(t){ document.documentElement.setAttribute('data-theme', t); localStorage.setItem('theme', t); }
function toggleTheme(){ setTheme((localStorage.getItem('theme')||'light')==='light'?'dark':'light'); updateThemeUI(); }
function updateThemeUI(){ const isDark=(localStorage.getItem('theme')||'light')==='dark'; const ico = isDark?'bi-moon-stars':'bi-sun'; $('#themeIcon').className='bi '+ico; }
(function initTheme(){ setTheme(localStorage.getItem('theme')||'light'); })();

async function loadJSON(path){ const r = await fetch(path, {cache:'no-store'}); return r.json(); }

function renderTags(){
  const c = $('#tagbar'); c.innerHTML='';
  const cats = [...new Set(state.items.map(x=>x.category))].sort();
  cats.forEach(cat=>{
    const el = document.createElement('span');
    el.className = 'tag' + (state.tags.has(cat)?' active':'');
    el.textContent = cat;
    el.onclick = ()=>{ state.tags.has(cat) ? state.tags.delete(cat) : state.tags.add(cat); renderTags(); renderGrid(); };
    c.appendChild(el);
  });
}

function applyFilters(){
  const q = state.query.trim().toLowerCase();
  let arr = state.items.filter(x=>{
    const hay = (x.name+' '+x.category+' '+x.helps+' '+(x.region||'')).toLowerCase();
    const passQ = !q || hay.includes(q);
    const passTag = state.tags.size===0 || state.tags.has(x.category);
    return passQ && passTag;
  });
  switch(state.sort){
    case 'name-asc': arr.sort((a,b)=>a.name.localeCompare(b.name)); break;
    case 'name-desc': arr.sort((a,b)=>b.name.localeCompare(a.name)); break;
    case 'price-asc': arr.sort((a,b)=>priceScore(a)-priceScore(b)); break;
    case 'price-desc': arr.sort((a,b)=>priceScore(b)-priceScore(a)); break;
  }
  state.filtered = arr;
}

function priceScore(x){ return (x.price_range||'').replace(/[^€]/g,'').length; }

function cardHTML(x, idx){
  const img = x.image || 'https://picsum.photos/seed/'+encodeURIComponent(x.name)+'/600/400';
  const tags = (x.tags||[]).map(t=>`<span class="badge badge-soft me-1">${t}</span>`).join(' ');
  return `
  <div class="col-12 col-md-6 col-lg-4" data-idx="${idx}">
    <div class="card h-100 tilt shadow-soft" data-aos="fade-up">
      <img src="${img}" alt="${x.name}" class="card-img-top" loading="lazy">
      <div class="card-body">
        <h5 class="card-title">${x.name}</h5>
        <p class="card-text"><b>Kategorie:</b> ${x.category}<br><b>Hilfe:</b> ${x.helps}</p>
        <div class="mb-2 small text-muted"><b>Region:</b> ${x.region||'–'} &nbsp; <b>Preis:</b> ${x.price_range||'–'}</div>
        <div class="mb-2">${tags}</div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-primary" onclick="openDetails(${idx})"><i class="bi bi-info-circle"></i> Details</button>
          ${x.link?`<a class="btn btn-sm btn-gradient text-white" href="${x.link}" target="_blank" rel="noopener"><i class="bi bi-box-arrow-up-right"></i> Quelle</a>`:`<button class="btn btn-sm btn-secondary" disabled>Mehr Infos bald</button>`}
        </div>
      </div>
    </div>
  </div>`;
}

function renderGrid(){
  applyFilters();
  const grid = document.getElementById("cards");
  grid.innerHTML = Array.from({length:6}).map(()=>`<div class=\"mitem\"><div class=\"card skeleton\"></div></div>`).join("");
  setTimeout(()=>{
    grid.innerHTML = state.filtered.map((x,i)=>{
      const idx = state.items.indexOf(x);
      return cardHTML(x, idx).replace("<div class=\"col-12 col-md-6 col-lg-4\"","<div class=\"mitem\"");
    }).join("");
    AOS.refresh();
  }, 150);
  document.getElementById("count").textContent = state.filtered.length;
}
