/* SmartAssist HF Bot v2 – einfacher, robuster, ohne versteckte Magie */
(function () {
  const WIDGET_ID = "smartassist-bot-v2";

  // --- Widget-HTML einfügen (wenn noch nicht da) ---
  if (!document.getElementById(WIDGET_ID)) {
    const box = document.createElement("div");
    box.id = WIDGET_ID;
    box.innerHTML = `
      <div class="sabv2">
        <div class="sabv2__header">
          <strong>SmartAssist Bot</strong>
          <button class="sabv2__gear" title="Einstellungen">⚙️</button>
        </div>

        <div class="sabv2__settings" hidden>
          <label>Hugging Face Token
            <input id="sabv2_token" type="password" placeholder="hf_xxx..." autocomplete="off">
          </label>
          <label>Modell
            <input id="sabv2_model" type="text" value="HuggingFaceH4/zephyr-7b-beta">
          </label>
          <button id="sabv2_save">Speichern</button>
          <small>Token wird nur lokal im Browser gespeichert.</small>
          <hr/>
        </div>

        <div id="sabv2_log" class="sabv2__log">
          <div class="sabv2__hint">Frage mich zu Robotik & KI…</div>
        </div>

        <div class="sabv2__inputrow">
          <input id="sabv2_input" type="text" placeholder="Nachricht eingeben und Enter drücken…">
          <button id="sabv2_send" class="sabv2__send">➤</button>
        </div>
      </div>
    `;
    document.body.appendChild(box);
  }

  // --- DOM-Refs ---
  const $gear = document.querySelector(`#${WIDGET_ID} .sabv2__gear`);
  const $settings = document.querySelector(`#${WIDGET_ID} .sabv2__settings`);
  const $token = document.getElementById('sabv2_token');
  const $model = document.getElementById('sabv2_model');
  const $save = document.getElementById('sabv2_save');
  const $input = document.getElementById('sabv2_input');
  const $send = document.getElementById('sabv2_send');
  const $log = document.getElementById('sabv2_log');

  // --- LocalStorage-Key ---
  const LS_TOKEN_KEY = 'hf_token';
  const LS_MODEL_KEY = 'hf_model';

  // --- UI init: bestehende Werte laden ---
  try {
    const t = localStorage.getItem(LS_TOKEN_KEY) || '';
    const m = localStorage.getItem(LS_MODEL_KEY) || 'HuggingFaceH4/zephyr-7b-beta';
    $token.value = t;
    $model.value = m;
  } catch (e) {}

  function addMsg(text, who) {
    const el = document.createElement('div');
    el.className = 'sabv2__msg sabv2__msg--' + (who || 'bot');
    el.textContent = text;
    $log.appendChild(el);
    $log.scrollTop = $log.scrollHeight;
  }

  function status(msg) {
    const el = document.createElement('div');
    el.className = 'sabv2__status';
    el.textContent = msg;
    $log.appendChild(el);
    $log.scrollTop = $log.scrollHeight;
  }

  // --- Einstellungen toggeln ---
  $gear.addEventListener('click', () => {
    $settings.hidden = !$settings.hidden;
  });

  // --- Speichern ---
  $save.addEventListener('click', () => {
    try {
      localStorage.setItem(LS_TOKEN_KEY, $token.value.trim());
      localStorage.setItem(LS_MODEL_KEY, $model.value.trim());
      status('✅ Einstellungen gespeichert.');
      $settings.hidden = true;
    } catch (e) {
      status('⚠️ Konnte nicht speichern: ' + e.message);
    }
  });

  // --- HF API Call ---
  async function askHF(prompt) {
    const token = ($token.value || '').trim();
    const model = ($model.value || '').trim() || 'HuggingFaceH4/zephyr-7b-beta';
    if (!token) {
      status('⚠️ Kein Token gesetzt. Klicke auf ⚙️ und füge deinen hf_… Token ein.');
      return { error: 'no-token' };
    }
    try {
      const res = await fetch(`https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: prompt })
      });
      if (res.status === 401) {
        status('❌ Token ungültig (401). Prüfe deinen hf_… Token.');
        return { error: 'unauthorized' };
      }
      if (!res.ok) {
        status('❌ API-Fehler: ' + res.status + ' ' + res.statusText);
        return { error: 'http' };
      }
      const data = await res.json();
      // Verschiedene Modell-Outputs normalisieren
      let text = '';
      if (Array.isArray(data) && data[0]?.generated_text) text = data[0].generated_text;
      else if (data?.generated_text) text = data.generated_text;
      else if (data?.choices?.[0]?.text) text = data.choices[0].text;
      else if (typeof data === 'string') text = data;
      else text = JSON.stringify(data);

      return { text };
    } catch (e) {
      status('❌ Netzwerk-Fehler: ' + e.message);
      return { error: 'network' };
    }
  }

  async function send() {
    const msg = $input.value.trim();
    if (!msg) return;
    addMsg(msg, 'me');
    $input.value = '';
    status('…denke nach…');
    const res = await askHF(msg);
    const last = $log.querySelector('.sabv2__status:last-child');
    if (last) last.remove();
    if (res.text) addMsg(res.text, 'bot');
  }

  $send.addEventListener('click', send);
  $input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') send();
  });
})();
