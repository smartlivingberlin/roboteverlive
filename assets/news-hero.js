(async()=>{
  try{
    const h = await (await fetch('data/highlights.json?cb='+Date.now())).json();
    const img = document.getElementById('news-hero');
    if(img && h.newsHero){ img.src = h.newsHero; }
  }catch(e){}
})();
