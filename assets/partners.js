async function loadPartners(){
  const box = document.getElementById('partnersBox');
  const fSel = document.getElementById('pFilter');
  try{
    const res = await fetch('data/partners.json',{cache:'no-store'});
    const items = await res.json();
    function render(){
      const q = (document.getElementById('pQuery').value||'').toLowerCase();
      const f = fSel.value;
      const arr = items.filter(x=>{
        const passQ = !q || JSON.stringify(x).toLowerCase().includes(q);
        const passF = !f || x.type===f;
        return passQ && passF;
      });
      box.innerHTML = arr.map(x=>`
        <div class="col-md-6 col-lg-4">
          <div class="card h-100">
            <div class="card-body d-flex align-items-center gap-3">
              <img src="${x.logo}" alt="" style="width:48px;height:48px;object-fit:contain">
              <div>
                <div class="fw-bold">${x.name}</div>
                <div class="small text-muted">${x.type} • ${x.region}</div>
                <div class="mt-2">${(x.tags||[]).map(t=>`<span class="badge text-bg-light me-1">${t}</span>`).join('')}</div>
              </div>
            </div>
            <div class="card-footer"><a class="btn btn-sm btn-outline-primary" href="${x.link}" target="_blank" rel="noopener">Zur Seite</a></div>
          </div>
        </div>`).join('');
    }
    document.getElementById('pQuery').addEventListener('input', render);
    fSel.addEventListener('change', render);
    render();
  }catch(e){ box.innerHTML = '<div class="alert alert-danger">Partner konnten nicht geladen werden.</div>'; }
}
document.addEventListener('DOMContentLoaded', loadPartners);
