(() => {
  // --- Mini-Styles für Modal/Toast ---
  const css = `
  .sa-token-mask{position:fixed;inset:0;background:rgba(0,0,0,.35);display:none;z-index:9998}
  .sa-token-modal{position:fixed;z-index:9999;top:50%;left:50%;transform:translate(-50%,-50%);
    background:#fff;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.2);width:min(420px,92vw);
    padding:18px 18px 14px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial}
  .sa-token-modal h3{margin:0 0 8px;font-size:18px}
  .sa-token-modal p{margin:0 0 10px;color:#444;font-size:14px}
  .sa-token-row{display:flex;gap:8px}
  .sa-token-row input{flex:1;border:1px solid #ccd;border-radius:8px;padding:10px 12px;font-size:14px}
  .sa-token-row button{border:0;border-radius:8px;padding:10px 12px;cursor:pointer}
  .sa-btn-save{background:#2563eb;color:#fff}
  .sa-btn-clear{background:#eee}
  .sa-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#111;color:#fff;
    padding:10px 14px;border-radius:8px;font-size:14px;opacity:0;transition:opacity .2s;z-index:10000}
  .sa-token-fab{position:fixed;right:18px;bottom:18px;width:44px;height:44px;border-radius:50%;
    background:#2563eb;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;
    box-shadow:0 8px 20px rgba(0,0,0,.25);z-index:9997;user-select:none}
  `;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  // --- Helpers ---
  const getToken = () => localStorage.getItem('hf_token') || '';
  const setToken = (t) => { t ? localStorage.setItem('hf_token', t.trim()) : localStorage.removeItem('hf_token'); };
  const toast = (msg) => {
    const el = document.createElement('div'); el.className='sa-toast'; el.textContent = msg;
    document.body.appendChild(el); requestAnimationFrame(()=>{ el.style.opacity=1; });
    setTimeout(()=>{ el.style.opacity=0; setTimeout(()=>el.remove(),250); }, 1400);
  };

  // --- Modal UI ---
  const mask = document.createElement('div'); mask.className = 'sa-token-mask';
  const modal = document.createElement('div'); modal.className = 'sa-token-modal'; modal.innerHTML = `
     <h3>Hugging Face Token</h3>
     <p>Dein persönlicher Token (beginnt mit <code>hf_</code>). Er wird nur <b>lokal</b> im Browser gespeichert.</p>
     <div class="sa-token-row" style="margin-top:10px">
       <input id="saTokenInput" type="password" placeholder="hf_xxx..." autocomplete="off" />
       <button class="sa-btn-save">Speichern</button>
       <button class="sa-btn-clear">Löschen</button>
     </div>
     <p style="margin-top:6px;color:#666;font-size:12px">Tipp: Token auf <em>huggingface.co → Settings → Access Tokens</em> erzeugen.</p>
  `;
  document.body.append(mask, modal);
  const input = modal.querySelector('#saTokenInput');
  const openModal  = () => { input.value = getToken(); mask.style.display='block'; modal.style.display='block'; input.focus(); };
  const closeModal = () => { mask.style.display='none'; modal.style.display='none'; };

  mask.addEventListener('click', closeModal);
  modal.querySelector('.sa-btn-save').addEventListener('click', () => {
    const val = input.value.trim();
    if(!val.startsWith('hf_')) { toast('Ungültiger Token'); return; }
    setToken(val); toast('Token gespeichert'); closeModal(); location.reload();
  });
  modal.querySelector('.sa-btn-clear').addEventListener('click', () => { setToken(''); toast('Token gelöscht'); closeModal(); location.reload(); });

  // --- Falls kein Zahnrad im Bot existiert: eigenen ⚙️-Button einblenden ---
  const ensureFab = () => {
    if (document.getElementById('sa-token-fab')) return;
    const fab = document.createElement('div'); fab.id='sa-token-fab'; fab.className='sa-token-fab'; fab.title='Token';
    fab.innerHTML = '⚙️'; fab.addEventListener('click', openModal); document.body.appendChild(fab);
  };
  ensureFab();

  // --- Wenn ein Zahnrad im Bot existiert, daran anhängen ---
  const hookGear = () => {
    const gear = document.querySelector('#sa-bot-gear, .sa-gear, .smartassist-gear');
    if (gear && !gear.dataset.saBound) {
      gear.dataset.saBound = '1';
      gear.addEventListener('click', (e)=>{ e.preventDefault(); openModal(); });
    }
  };
  hookGear(); const obs = new MutationObserver(hookGear); obs.observe(document.body,{childList:true,subtree:true});

  // --- Fetch-Interceptor: hängt automatisch den Token an HF-Inference-API ---
  const origFetch = window.fetch.bind(window);
  window.fetch = (input, init={}) => {
    try {
      const url = typeof input === 'string' ? input : (input?.url || '');
      if (url.includes('api-inference.huggingface.co')) {
        const token = getToken();
        init = init || {};
        init.headers = new Headers(init.headers || {});
        if (token) init.headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (e) {}
    return origFetch(input, init);
  };

  // --- Debug-Hinweis in Konsole ---
  const t = getToken();
  console.log('[SmartAssist] HF-Token', t ? '(gesetzt, ' + t.slice(0,8) + '… )' : 'nicht gesetzt');
})();
