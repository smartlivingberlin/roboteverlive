(async()=>{
  try{
    const h = await (await fetch('data/highlights.json?cb='+Date.now())).json();
    const imgs = document.querySelectorAll('img[data-trend-img]');
    (h.trends||[]).slice(0, imgs.length).forEach((u,i)=> imgs[i].src = u || 'img/placeholder.jpg');
  }catch(e){}
})();
