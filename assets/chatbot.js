const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
const HF_TOKEN = "HIER_DEIN_TOKEN"; // <- Ersetze mit deinem Hugging Face API Key

async function queryHF(prompt) {
  const res = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: prompt })
  });
  const data = await res.json();
  if (Array.isArray(data) && data[0]?.generated_text) {
    return data[0].generated_text;
  }
  return data.error || "⚠️ Keine Antwort vom Modell.";
}

function initChatbot() {
  const bot = document.createElement("div");
  bot.innerHTML = `
    <div id="chatbot" style="position:fixed;bottom:20px;right:20px;width:320px;height:400px;background:#fff;border:1px solid #ccc;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.2);display:flex;flex-direction:column;">
      <div id="chat-log" style="flex:1;overflow-y:auto;padding:8px;font-size:0.9rem;"></div>
      <input id="chat-input" placeholder="Frag mich..." style="border:none;border-top:1px solid #ccc;padding:8px;">
    </div>`;
  document.body.appendChild(bot);

  const log = document.getElementById("chat-log");
  const input = document.getElementById("chat-input");

  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      const msg = input.value.trim();
      if (!msg) return;
      log.innerHTML += `<div><b>Du:</b> ${msg}</div>`;
      input.value = "";
      log.scrollTop = log.scrollHeight;

      log.innerHTML += `<div><i>Bot denkt nach...</i></div>`;
      log.scrollTop = log.scrollHeight;

      const reply = await queryHF(msg);
      log.innerHTML += `<div><b>Bot:</b> ${reply}</div>`;
      log.scrollTop = log.scrollHeight;
    }
  });
}

document.addEventListener("DOMContentLoaded", initChatbot);
