(function(){
  const FAB_ID   = 'sab_fab';        // runder Button
  const BOX_ID   = 'sab_panel';      // Chat-Fenster
  const LS_OPEN  = 'sab_open';       // merkt sich offen/zu

  // CSS einbetten
  const css = `
  #${FAB_ID}{
    position:fixed; right:18px; bottom:18px;
    width:54px; height:54px; border-radius:50%;
    border:1px solid rgba(0,0,0,.08);
    background:#2b65ff; color:#fff; font-weight:600;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; z-index:9998;
    box-shadow:0 6px 22px rgba(0,0,0,.18);
  }
  #${BOX_ID}{
    position:fixed; right:18px; bottom:84px;
    width:min(380px, 92vw); height:min(520px, 65vh);
    background:#fff; border:1px solid rgba(0,0,0,.06); border-radius:12px;
    display:none; flex-direction:column; z-index:9999;
    box-shadow:0 10px 30px rgba(0,0,0,.15); overflow:hidden;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  }
  #${BOX_ID}.open{ display:flex; }
  .sab_head{
    display:flex; align-items:center; justify-content:space-between;
    padding:10px 12px; background:#eff3ff; border-bottom:1px solid rgba(0,0,0,.06);
  }
  .sab_title{ font-weight:700; color:#1a2b6d; }
  .sab_close{ background:#2b65ff; color:#fff; border:none; padding:6px 10px; border-radius:8px; cursor:pointer; }
  .sab_log{ flex:1; padding:12px; overflow:auto; background:#f7f9ff;}
  .sab_msg{ margin:8px 0; max-width:90%; padding:8px 10px; border-radius:10px; font-size:14px;}
  .sab_msg.user{ background:#e7f0ff; margin-left:auto;}
  .sab_msg.bot{ background:#fff; border:1px solid rgba(0,0,0,.06);}
  .sab_input{ display:flex; gap:8px; padding:10px; border-top:1px solid rgba(0,0,0,.06); background:#fff;}
  .sab_input input{ flex:1; padding:10px; border:1px solid rgba(0,0,0,.15); border-radius:10px; }
  .sab_input button{ padding:10px 14px; border:1px solid rgba(0,0,0,.06); background:#2b65ff; color:#fff; border-radius:10px; cursor:pointer;}
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // FAB (schwebender Button)
  const fab = document.createElement('button');
  fab.id = FAB_ID;
  fab.title = 'SmartAssist Bot';
  fab.textContent = '💬';
  document.body.appendChild(fab);

  // Panel
  const box = document.createElement('div');
  box.id = BOX_ID;
  box.innerHTML = `
    <div class="sab_head">
      <div class="sab_title">SmartAssist Bot</div>
      <button class="sab_close" type="button">×</button>
    </div>
    <div class="sab_log"></div>
    <div class="sab_input">
      <input id="sab_in" type="text" placeholder="Frage eingeben und Enter drücken…">
      <button id="sab_send" type="button">Senden</button>
    </div>
  `;
  document.body.appendChild(box);

  const log   = box.querySelector('.sab_log');
  const input = box.querySelector('#sab_in');
  const send  = box.querySelector('#sab_send');
  const close = box.querySelector('.sab_close');

  // State wiederherstellen (standard: geschlossen)
  if(localStorage.getItem(LS_OPEN)==='1'){ box.classList.add('open'); }
  else { box.classList.remove('open'); }

  function toggleBox(force){
    const open = typeof force==='boolean' ? force : !box.classList.contains('open');
    box.classList.toggle('open', open);
    localStorage.setItem(LS_OPEN, open ? '1':'0');
    if(open) input.focus();
  }

  fab.addEventListener('click', ()=>toggleBox());
  close.addEventListener('click', ()=>toggleBox(false));

  // Mini-FAQ Antworten (offline, ohne Token)
  function answer(msg){
    const t = msg.toLowerCase();

    if(t.includes('kontakt')) return 'Kontakt: smartlivingberlin.github.io/roboteverlive/kontakt.html';
    if(t.includes('katalog')) return 'Den Katalog findest du oben im Menü „Katalog“.';
    if(t.includes('news') || t.includes('neuigkeiten')) return 'Aktuelle News: Menü „News“.';
    if(t.includes('partner')) return 'Partnerübersicht im Menü „Partner“.';
    if(t.includes('robot') || t.includes('roboter')) return 'Roboter & KI im Alltag: stöbere im Katalog oder frag konkreter („Rollstuhl“, „Greifarm“, „Haushalt“).';
    if(t.includes('hallo') || t.includes('hi')) return 'Hi! Ich bin die Offline-Hilfe ohne Anmeldung. Frag mich nach „Kontakt“, „Katalog“, „News“, „Partner“…';
    if(t.includes('hilfe') || t.includes('faq')) return 'Tipps: Öffne/Schließe mich per Button unten rechts. Ich speichere keine Daten und laufe lokal im Browser.';

    return 'Ich bin eine kleine Offline-Demo. Versuch z.B. „Kontakt“, „Katalog“, „News“, „Partner“ oder „Roboter“.';
  }

  // Hilfsfunktionen
  function addMsg(text, from){
    const el = document.createElement('div');
    el.className = 'sab_msg ' + (from==='user'?'user':'bot');
    el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  async function sendNow(){
    const msg = input.value.trim();
    if(!msg) return;
    input.value = '';
    addMsg(msg, 'user');
    const reply = answer(msg);
    addMsg(reply, 'bot');
  }

  send.addEventListener('click', sendNow);
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') sendNow(); });

})();
