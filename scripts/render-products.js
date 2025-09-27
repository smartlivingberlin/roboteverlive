async function renderProducts() {
  const res = await fetch("data/products.json");
  const products = await res.json();
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  products.forEach(p => {
    // Badges aus Tags bauen
    let badges = "";
    if (p.tags) {
      badges = p.tags.map(t => `<span class="badge bg-primary">${t}</span>`).join(" ");
    }

    grid.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${p.image}" class="card-img-top" alt="${p.name}">
          <div class="card-body">
            <h5 class="card-title">${p.name}</h5>
            <p>${badges}</p>
            <p class="card-text">${p.helps || ""}</p>
            <a href="${p.link}" target="_blank" class="btn btn-outline-primary">Mehr erfahren</a>
          </div>
        </div>
      </div>
    `;
  });
}
document.addEventListener("DOMContentLoaded", renderProducts);
