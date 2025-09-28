// ganz oben, NACH dem Einbinden von config.js:
const CFG = (window.APP_CONFIG||{});
const HF_REQUIRED = !!CFG.HF_REQUIRED;
let HF_TOKEN = CFG.HF_TOKEN || localStorage.getItem('HF_TOKEN') || "";

// bisher: if (!HF_TOKEN) showPopup();
// neu:
function needsToken() {
  return HF_REQUIRED && !HF_TOKEN;
}

// statt „Popup anzeigen, sonst nichts“:
if (needsToken()) {
  // optional: kleine Info anzeigen oder Button deaktivieren
  console.warn("HF-Token fehlt. Chat läuft im Demo-Modus.");
} else {
  // normal initialisieren
}

// bei Anfrage statt echten API-Call:
async function askBot(prompt){
  if (needsToken()){
    // Demo-/Fallback-Antwort (kein API-Call)
    return "Demo-Modus: Kein HF-Token gesetzt. Frage gerne zu Katalog & Kategorien.";
  }
  // ... hier dein echter API-Call mit HF_TOKEN ...
}
