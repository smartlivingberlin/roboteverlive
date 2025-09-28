(function () {
  const ID='smartassist-weblm'; if (document.getElementById(ID)) return;
  const box=document.createElement('div'); box.id=ID;
  box.innerHTML=`<style>
  #smartassist-weblm{position:fixed;right:16px;bottom:16px;width:320px;max-width:92vw;
    height:min(68vh,560px);z-index:9999;font-family:system-ui,-apple-system,"Segoe UI",
    Roboto,Arial,sans-serif}
  .sab{display:flex;flex-direction:column;height:100%;background:#fff;border:1px solid rgba(0,0,0,.08);
    border-radius:10px;box-shadow:0 8px 20px rgba(0,0,0,.1);overflow:hidden}
  .sab_head{background:#0d6efd;color:#fff;padding:10px 12px;font-weight:600;display:flex;
    align-items:center;justify-content:space-between}
  .sab_head .sab_status{font-weight:400;background:rgba(255,255,255,.18);padding:2px 8px;border-radius:6px}
  .sab_log{flex:1;overflow:auto;background:#f8fafc;padding:12px}
  .msg{margin:8px 0;padding:8px 12px;border-radius:8px;max-width:90%}
  .m_you{background:#e7f0ff;border:1px solid rgba(13,110,253,.25)}
  .m_bot{background:#fff;border:1px solid rgba(0,0,0,.08)}
  .sab_inputrow{display:flex;gap:8px;padding:10px;border-top:1px solid rgba(0,0,0,.06);background:#fff}
  .sab_inputrow input{flex:1;padding:10px 12px;border:1px solid rgba(0,0,0,.18);border-radius:8px}
  .sab_inputrow button{padding:10px 12px;border:0;border-radius:8px;background:#0d6efd;color:#fff;cursor:pointer}
  .sab_inputrow button:active{transform:translateY(1px)}
  </style>
  <div class="sab">
    <div class="sab_head"><span>SmartAssist Bot</span><span class="sab_status">bereit (FAQ)</span></div>
    <div class="sab_log" id="sab_log"></div>
    <div class="sab_inputrow">
      <input id="sab_input" type="text" placeholder="Frage eingeben und Enter drücken…">
      <button id="sab_send">Senden</button>
    </div>
  </div>`;
  document.body.appendChild(box);

  const log=document.getElementById('sab_log');
  function add(who,text){
    const d=document.createElement('div');
    d.className='msg ' + (who==='you'?'m_you':'m_bot');
    d.textContent=text; log.appendChild(d); log.scrollTop=log.scrollHeight;
  }
  function answer(q0){
    const q=q0.toLowerCase();
    if(q.includes('hallo')||q.includes('hi')) return 'Hallo! Frag mich zu Robotik, KI oder „Kontakt“.';
    if(q.includes('robot')) return 'Roboter helfen im Alltag. Schau in den Katalog für Beispiele.';
    if(q.includes('ki')||q.includes('ai')) return 'KI lernt aus Daten und unterstützt beim Entscheiden.';
    if(q.includes('kontakt')) return 'Nutze oben im Menü „Kontakt“.';
    if(q.includes('hilfe')||q.includes('faq')) return 'Beispiele: „Robotik“, „KI“, „Kontakt“ oder „hallo“.';
    return 'Ich bin eine kleine Offline-Demo ohne Internet/Token. Versuch: „Robotik“, „KI“, „Kontakt“ oder „hallo“.';
  }
  async function send(){
    const inp=document.getElementById('sab_input'); const msg=inp.value.trim();
    if(!msg) return; add('you', msg); inp.value=''; setTimeout(()=>add('bot', answer(msg)), 150);
  }
  document.getElementById('sab_send').addEventListener('click', send);
  document.getElementById('sab_input').addEventListener('keydown', e=>{ if(e.key==='Enter') send();});
})();
// --- Cleanup: entferne alte HF-Token-Karte, falls sie im HTML steckt ---
try {
  const all = document.querySelectorAll('div,section,form,main,article');
  for (const el of all) {
    if (el && el.textContent && /Hugging\s*Face\s*Token/i.test(el.textContent)) {
      el.remove();
    }
  }
} catch (e) { /* ignore */ }
