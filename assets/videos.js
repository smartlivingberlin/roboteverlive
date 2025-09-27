async function loadVideos(){
  const grid = document.getElementById('vidGrid');
  const res = await fetch('data/videos.json',{cache:'no-store'});
  const vids = await res.json();
  grid.innerHTML = vids.map(v=>{
    const thumb = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
    const url = `https://www.youtube.com/watch?v=${v.id}`;
    return `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="position-relative" style="cursor:pointer" onclick="window.open('${url}','_blank','noopener')">
            <img src="${thumb}" class="card-img-top" alt="${v.title}" style="height:200px;object-fit:cover">
            <div class="position-absolute top-50 start-50 translate-middle bg-dark bg-opacity-50 rounded-circle p-3">
              ▶
            </div>
          </div>
          <div class="card-body">
            <div class="fw-bold">${v.title}</div>
            <div class="mt-2">${(v.tags||[]).map(t=>`<span class="badge text-bg-light me-1">${t}</span>`).join('')}</div>
            <a class="btn btn-sm btn-outline-primary mt-2" href="${url}" target="_blank" rel="noopener">Auf YouTube öffnen</a>
          </div>
        </div>
      </div>`;
  }).join('');
}
document.addEventListener('DOMContentLoaded', loadVideos);
