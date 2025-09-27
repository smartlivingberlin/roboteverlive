(() => {
  const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

  // UI einfügen (Button + Panel)
  const css = `
  .sa-chat-toggle{position:fixed;right:20px;bottom:20px;z-index:9999;background:#111;color:#fff;border:none;border-radius:50%;width:56px;height:56px;box-shadow:0 8px 20px rgba(0,0,0,.25);font-size:22px;cursor:pointer}
  .sa-chat{position:fixed;right:20px;bottom:90px;width:340px;max-height:70vh;background:#fff;border:1px solid #ddd;border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.25);display:none;overflow:hidden;z-index:9999}
  .sa-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#0d6efd;color:#fff}
  .sa-body{padding:10px;height:48vh;overflow:auto;font-size:.95rem}
  .sa-input{display:flex;border-top:1px solid #eee}
  .sa-input input{flex:1;padding:10px;border:0;outline:none}
  .sa-input button{border:0;background:#0d6efd;color:#fff;padding:0 14px}
  .sa-msg-u{margin:6px 0;text-align:right}
  .sa-msg-b{margin:6px 0;text-align:left}
  .sa-bubble{display:inline-block;padding:8px 10px;border-radius:10px;max-width:85%}
  .sa-u{background:#e7f1ff}
  .sa-b{background:#f6f6f6}
  .sa-setup{padding:10px;border-top:1px solid #eee;background:#fff6d8;font-size:.9rem}
  `;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  const toggle = document.createElement('button'); toggle.className='sa-chat-toggle'; toggle.title='Chat'; toggle.textContent='💬';
  const box = document.createElement('div'); box.className='sa-chat';
  box.innerHTML = `
    <div class="sa-head"><strong>SmartAssist Bot</strong>
      <button id="saCfg" title="Token setzen" style="background:transparent;border:0;color:#fff;font-size:18px">⚙️</button>
    </div>
    <div id="saBody" class="sa-body"></div>
    <div class="sa-setup" id="saSetup" style="display:none">
      <div><strong>Hugging Face Token</strong> (bleibt nur in deinem Browser gespeichert)</div>
      <input id="saTok" type="password" placeholder="hf_xxx…" style="width:100%;margin:6px 0;padding:6px">
      <button id="saSave" class="btn btn-sm btn-primary">Speichern</button>
      <button id="saClear" class="btn btn-sm btn-outline-secondary">Löschen</button>
      <div id="saInfo" style="margin-top:6px;color:#666"></div>
    </div>
    <div class="sa-input">
      <input id="saIn" placeholder="Frage mich nach Robotik & KI…">
      <button id="saSend">➤</button>
    </div>`;
  document.body.append(toggle, box);

  const elBody = box.querySelector('#saBody');
  const elIn   = box.querySelector('#saIn');
  const elSend = box.querySelector('#saSend');
  const elCfg  = box.querySelector('#saCfg');
  const elSetup= box.querySelector('#saSetup');
  const elTok  = box.querySelector('#saTok');
  const elSave = box.querySelector('#saSave');
  const elClear= box.querySelector('#saClear');
  const elInfo = box.querySelector('#saInfo');

  const getToken = () => localStorage.getItem('HF_TOKEN') || '';
  const setToken = v => localStorage.setItem('HF_TOKEN', v);

  const addMsg = (txt, who='b') => {
    const wrap = document.createElement('div');
    wrap.className = who==='u' ? 'sa-msg-u' : 'sa-msg-b';
    wrap.innerHTML = `<span class="sa-bubble ${who==='u'?'sa-u':'sa-b'}">${txt}</span>`;
    elBody.appendChild(wrap);
    elBody.scrollTop = elBody.scrollHeight;
  };

  // Request an HF (mit Fallbacks & Fehlertext)
  async function askHF(prompt){
    const token = getToken();
    if(!token){ addMsg('Bitte ⚙️ Token setzen (Hugging Face → Settings → Access Tokens).'); return; }
    addMsg('…denke nach…', 'b');
    try{
      const r = await fetch(API_URL, {
        method:'POST',
        headers:{
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          inputs: `User: ${prompt}\nAssistant:`,
          parameters: { max_new_tokens: 160, temperature: 0.6, return_full_text: false }
        })
      });
      const data = await r.json();
      // Verschiedene Antwortformen abfangen
      let out = '⚠️ Keine Antwort.';
      if(Array.isArray(data) && data[0]?.generated_text){ out = data[0].generated_text.trim(); }
      else if(data.generated_text){ out = data.generated_text.trim(); }
      else if(data.error){ out = 'API Fehler: ' + data.error; }
      addMsg(out, 'b');
    }catch(e){
      addMsg('Netzwerk/Browser-Fehler: '+ e.message, 'b');
    }
  }

  // Events
  toggle.onclick = ()=> box.style.display = (box.style.display==='block'?'none':'block');
  elSend.onclick = ()=> { const t=elIn.value.trim(); if(!t) return; addMsg(t,'u'); elIn.value=''; askHF(t); };
  elIn.addEventListener('keydown', e=>{ if(e.key==='Enter') elSend.click(); });
  elCfg.onclick = ()=> {
    elSetup.style.display = elSetup.style.display==='none' ? 'block':'none';
    elTok.value = getToken();
    elInfo.textContent = 'Token wird NUR lokal gespeichert (localStorage).';
  };
  elSave.onclick = ()=> { setToken(elTok.value.trim()); elInfo.textContent='✅ gespeichert'; setTimeout(()=>elSetup.style.display='none', 600); };
  elClear.onclick= ()=> { localStorage.removeItem('HF_TOKEN'); elTok.value=''; elInfo.textContent='🧹 gelöscht'; };
})();
