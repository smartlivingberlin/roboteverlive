document.addEventListener('DOMContentLoaded', ()=>{
  const f = document.querySelector('#contactForm');
  if(!f) return;
  f.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const btn = f.querySelector('button[type="submit"]');
    btn.disabled = true;
    const data = Object.fromEntries(new FormData(f).entries());
    try{
      const r = await fetch(f.action, {
        method: "POST",
        headers: {"Accept":"application/json"},
        body: new FormData(f)
      });
      if(r.ok){ alert("Danke! Wir haben deine Nachricht erhalten."); f.reset(); }
      else{ alert("Leider gab es ein Problem. Bitte später erneut versuchen."); }
    }catch(_){ alert("Netzwerkfehler. Prüfe deine Verbindung."); }
    btn.disabled = false;
  });
});
