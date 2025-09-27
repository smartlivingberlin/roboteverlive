async function applyAffiliateLinks(){
  try{
    const res=await fetch('data/affiliates.json',{cache:'no-store'});
    const rules=await res.json(); const map=new Map(rules.map(r=>[r.host,r]));
    document.querySelectorAll('a[href^="http"]').forEach(a=>{
      try{const u=new URL(a.href);const r=map.get(u.host);if(!r)return;
        if(!u.searchParams.has(r.param))u.searchParams.set(r.param,r.id);
        a.href=u.toString();}catch{}
    });
  }catch(e){console.warn('affiliate map not loaded',e);}
}
document.addEventListener('DOMContentLoaded',applyAffiliateLinks);
