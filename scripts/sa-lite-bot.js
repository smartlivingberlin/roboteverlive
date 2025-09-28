(() => {
  const ID_BTN = 'sa-bot-launcher';
  const ID_BOX = 'sa-bot-box';
  const ID_WRAP = 'sa-bot-wrap';
  const ID_LOG = 'sa-bot-log';
  const ID_INPUT = 'sa-bot-input';
  const ID_SEND = 'sa-bot-send';

  // UI bauen (Button + versteckte Box)
  function ensureUI() {
    if (!document.getElementById(ID_BTN)) {
      const btn = document.createElement('button');
      btn.id = ID_BTN;
      btn.setAttribute('aria-label','Chat starten');
      btn.innerHTML = '💬';
      document.body.appendChild(btn);
    }
    if (!document.getElementById(ID_BOX)) {
      const box = document.createElement('div');
      box.id = ID_BOX;
      box.innerHTML = `
        <div class="sa-bot-head">
          <strong>SmartAssist Bot</strong>
          <button class="sa-bot-close" title="Schließen">✕</button>
        </div>
        <div id="${ID_WRAP}">
          <div id="${ID_LOG}" class="sa-bot-log" aria-live="polite"></div>
          <div class="sa-bot-inputrow">
            <input id="${ID_INPUT}" type="text" placeholder="Frage eingeben und Enter drücken…">
            <button id="${ID_SEND}">Senden</button>
          </div>
        </div>`;
      document.body.appendChild(box);
    }
  }

  // Einfaches Offline-FAQ (Schlüsselwörter -> Antworten/Links)
  function reply(text) {
    const t = text.toLowerCase();
    const link = (href, label) => `<a href="${href}">${label}</a>`;
    if (/katalog|catalog|produkte?/.test(t))
      return `Zum Katalog: ${link('katalog.html','Katalog öffnen')}`;
    if (/news|neu|aktuell/.test(t))
      return `Aktuelle Meldungen: ${link('news.html','News öffnen')}`;
    if (/kontakt|email|mail/.test(t))
      return `Kontakt: ${link('kontakt.html','Kontaktseite')}`;
    if (/partner|netzwerk/.test(t))
      return `Partner: ${link('partner.html','Partner ansehen')}`;
    if (/ki|robotik|roboter|hilfe|hilfeimalltag/.test(t))
      return 'Ich bin eine kleine Offline-Demo ohne Internet/Token. Probiere: „Katalog“, „News“, „Kontakt“, „Partner“.';
    if (/hallo|hi|moin|servus|grüß/.test(t))
      return 'Hallo! Wie kann ich helfen? (Tipps: „Katalog“, „News“, „Kontakt“)';
    return 'Ich habe dich nicht ganz verstanden. Stichwörter wie „Katalog“, „News“, „Kontakt“, „Partner“ funktionieren gut.';
  }

  function addMsg(who, text) {
    const log = document.getElementById(ID_LOG);
    const el = document.createElement('div');
    el.className = 'sa-bot-msg ' + (who === 'bot' ? 'bot' : 'me');
    el.innerHTML = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  function send() {
    const input = document.getElementById(ID_INPUT);
    const msg = (input.value || '').trim();
    if (!msg) return;
    addMsg('me', msg);
    input.value = '';
    const r = reply(msg);
    addMsg('bot', r);
  }

  function openBox() {
    document.getElementById(ID_BOX).classList.add('open');
    if (!document.getElementById(ID_LOG).dataset.greeted) {
      addMsg('bot','Hallo! Ich helfe dir durch das Portal. Stichworte: „Katalog“, „News“, „Kontakt“, „Partner“.');
      document.getElementById(ID_LOG).dataset.greeted = '1';
    }
  }
  function closeBox(){ document.getElementById(ID_BOX).classList.remove('open'); }

  function wire() {
    document.getElementById(ID_BTN).addEventListener('click', openBox);
    document.querySelector('#'+ID_BOX+' .sa-bot-close').addEventListener('click', closeBox);
    document.getElementById(ID_SEND).addEventListener('click', send);
    document.getElementById(ID_INPUT).addEventListener('keydown', e => {
      if (e.key === 'Enter') send();
    });
  }

  // Start
  ensureUI();
  wire();
})();
