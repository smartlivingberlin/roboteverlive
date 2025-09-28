/**
 * SmartAssist Web-Bot (ohne Account/Token)
 * - versucht erst WebLLM (lokales LLM im Browser)
 * - wenn nicht verfügbar: einfacher FAQ-Fallback
 */
const WIDGET_ID = "smartassist-webllm";
if (!document.getElementById(WIDGET_ID)) {
  const box = document.createElement("div");
  box.id = WIDGET_ID;
  box.innerHTML = `
  <style>
    #smartassist-webllm{position:fixed;right:16px;bottom:16px;width:min(360px,95vw);height:min(65vh,520px);z-index:9999;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;}
    .sab_head{background:#2b65ff;color:#fff;padding:10px 12px;border-radius:10px 10px 0 0;display:flex;align-items:center;justify-content:space-between}
    .sab_body{background:#fff;border:1px solid rgba(0,0,0,.08);border-top:0;height:calc(100% - 46px);display:flex;flex-direction:column;border-radius:0 0 10px 10px;overflow:hidden}
    .sab_log{flex:1;overflow:auto;padding:12px;background:#fafafe}
    .sab_msg{margin:8px 0;padding:10px 12px;border-radius:10px;max-width:90%}
    .sab_msg.user{background:#e9f0ff;margin-left:auto}
    .sab_msg.bot{background:#fff;border:1px solid rgba(0,0,0,.06)}
    .sab_input{display:flex;gap:8px;border-top:1px solid rgba(0,0,0,.06);padding:10px;background:#fff}
    .sab_input input{flex:1;padding:10px;border:1px solid rgba(0,0,0,.2);border-radius:8px}
    .sab_input button{padding:10px 14px;border-radius:8px;border:0;background:#2b65ff;color:#fff;cursor:pointer}
    .sab_hint{font-size:12px;color:#666;padding:0 12px 8px}
  </style>
  <div class="sab_head"><b>SmartAssist Bot</b><span id="sab_status">lädt…</span></div>
  <div class="sab_body">
    <div class="sab_hint">Läuft lokal im Browser – keine Anmeldung, keine Tokens.</div>
    <div id="sab_log" class="sab_log"></div>
    <div class="sab_input">
      <input id="sab_in" type="text" placeholder="Frage eingeben und Enter drücken…">
      <button id="sab_send">Senden</button>
    </div>
  </div>`;
  document.body.appendChild(box);
}

const $log   = document.getElementById("sab_log");
const $in    = document.getElementById("sab_in");
const $send  = document.getElementById("sab_send");
const $stat  = document.getElementById("sab_status");

function addMsg(text, who="bot"){
  const el = document.createElement("div");
  el.className = `sab_msg ${who}`;
  el.textContent = text;
  $log.appendChild(el);
  $log.scrollTop = $log.scrollHeight;
}

function setStatus(text){ $stat.textContent = text; }

let engine = null;       // WebLLM Engine oder null
let ready  = false;      // bereit zum Antworten
let usingLLM = false;    // true wenn WebLLM aktiv

async function initLLM(){
  try {
    // dynamisch laden – keine Bundler nötig
    const m = await import("https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.48/dist/index.min.js");
    setStatus("Modell lädt… (einmalig)");
    // sehr kleines Modell für schwächere Rechner
    engine = await m.CreateMLCEngine({
      model: "Qwen2.5-0.5B-Instruct-q4f32_1-MLC"  // ~0.5B, klein & schnell
    }, { initProgressCallback: (p) => setStatus(`Lade: ${Math.round((p.progress||0)*100)}%`) });
    usingLLM = true;
    ready = true;
    setStatus("bereit");
    addMsg("Hallo! Ich laufe lokal im Browser (WebLLM). Frag mich gern etwas zu Robotik & KI.");
  } catch(e){
    console.warn("WebLLM init failed, fallback to FAQ:", e);
    usingLLM = false;
    ready = true;
    setStatus("bereit (FAQ)");
    addMsg("WebLLM nicht verfügbar – ich antworte mit einer kleinen eingebauten FAQ. (Firefox/WebGPU hilft für das volle Modell.)");
  }
}

async function askLLM(prompt){
  const res = await engine.chat.completions.create({
    messages: [
      { role: "system", content: "Antworte kurz und hilfreich auf Deutsch." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    stream: false
  });
  return res.choices?.[0]?.message?.content?.trim() || "(keine Antwort)";
}

function askFAQ(q){
  const s = q.toLowerCase();
  if (s.includes("katalog") || s.includes("produkte")) {
    return "Zum Katalog: Öffne oben „Katalog“. Dort findest du die Produkte und Filter.";
  }
  if (s.includes("kontakt") || s.includes("email")) {
    return "Kontakt findest du oben im Menü „Kontakt“. Alternativ Mail an: info@smartassist.de (Platzhalter).";
  }
  if (s.includes("token") || s.includes("hugging")) {
    return "Kein Token nötig – dieser Bot läuft lokal im Browser (WebLLM).";
  }
  return "Dazu habe ich gerade keine spezielle Antwort. Formuliere die Frage anders oder nutze das Menü oben.";
}

async function send(){
  const msg = $in.value.trim();
  if(!msg || !ready) return;
  $in.value = "";
  addMsg(msg, "user");
  setStatus("denke nach…");
  try{
    let reply = usingLLM ? await askLLM(msg) : askFAQ(msg);
    addMsg(reply, "bot");
  }catch(e){
    addMsg("Fehler: "+e.message, "bot");
  }finally{
    setStatus("bereit");
  }
}

$send.addEventListener("click", send);
$in.addEventListener("keydown", (e)=>{ if(e.key==="Enter") send(); });

// Start
initLLM();
