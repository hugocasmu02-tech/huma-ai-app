(function () {
  // Evita cargar 2 veces
  if (window.__HUMA_CHAT_WIDGET_LOADED__) return;
  window.__HUMA_CHAT_WIDGET_LOADED__ = true;

  // Crea contenedor
  var mount = document.createElement("div");
  mount.id = "huma-chat-widget";
  document.body.appendChild(mount);

  // Carga React desde CDN (para que funcione en Hostinger)
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // Carga estilos mínimos
  var style = document.createElement("style");
  style.innerHTML = `
    #huma-chat-launcher{
      position:fixed; right:18px; bottom:18px; z-index:999999;
      width:56px; height:56px; border-radius:999px;
      background:#ffffff; color:#0b0f14; border:1px solid rgba(255,255,255,.12);
      box-shadow:0 12px 40px rgba(0,0,0,.35);
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; user-select:none;
      transition:transform .15s ease, box-shadow .15s ease;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
    }
    #huma-chat-launcher:hover{ transform:translateY(-2px); box-shadow:0 16px 50px rgba(0,0,0,.45); }
    #huma-chat-panel{
      position:fixed; right:18px; bottom:86px; z-index:999999;
      width:360px; max-width: calc(100vw - 36px);
      height:520px; max-height: calc(100vh - 120px);
      background:#0b0f14; color:#fff;
      border:1px solid rgba(255,255,255,.10);
      border-radius:16px;
      box-shadow:0 20px 70px rgba(0,0,0,.55);
      overflow:hidden; display:none;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
    }
    #huma-chat-header{
      padding:14px 14px;
      border-bottom:1px solid rgba(255,255,255,.10);
      display:flex; align-items:center; justify-content:space-between;
      font-weight:600;
    }
    #huma-chat-body{ padding:14px; height: calc(100% - 120px); overflow:auto; font-size:14px; line-height:1.35; }
    #huma-chat-input{
      padding:12px; border-top:1px solid rgba(255,255,255,.10);
      display:flex; gap:10px;
    }
    #huma-chat-input input{
      flex:1; padding:12px 12px; border-radius:12px;
      border:1px solid rgba(255,255,255,.12);
      background:rgba(255,255,255,.06); color:#fff; outline:none;
    }
    #huma-chat-input button{
      padding:12px 14px; border-radius:12px;
      border:1px solid rgba(255,255,255,.12);
      background:#fff; color:#0b0f14; cursor:pointer; font-weight:600;
    }
    .huma-msg{ margin:10px 0; }
    .huma-bot{ opacity:.92; }
    .huma-user{ text-align:right; }
    .huma-bubble{
      display:inline-block; padding:10px 12px; border-radius:14px;
      max-width: 90%;
    }
    .huma-bot .huma-bubble{ background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.08); }
    .huma-user .huma-bubble{ background:#fff; color:#0b0f14; }
  `;
  document.head.appendChild(style);

  // UI básica
  var launcher = document.createElement("div");
  launcher.id = "huma-chat-launcher";
  launcher.innerHTML = "H";
  document.body.appendChild(launcher);

  var panel = document.createElement("div");
  panel.id = "huma-chat-panel";
  panel.innerHTML = `
    <div id="huma-chat-header">
      <div>Huma AI</div>
      <div style="cursor:pointer;opacity:.7" id="huma-chat-close">✕</div>
    </div>
    <div id="huma-chat-body"></div>
    <div id="huma-chat-input">
      <input id="huma-chat-text" placeholder="Escribe tu mensaje..." />
      <button id="huma-chat-send">Enviar</button>
    </div>
  `;
  document.body.appendChild(panel);

  function toggle(open) {
    panel.style.display = open ? "block" : "none";
  }

  launcher.addEventListener("click", function () {
    toggle(panel.style.display !== "block");
  });
  document.getElementById("huma-chat-close").addEventListener("click", function () {
    toggle(false);
  });

  var body = document.getElementById("huma-chat-body");
  function addMsg(who, text) {
    var wrap = document.createElement("div");
    wrap.className = "huma-msg " + (who === "user" ? "huma-user" : "huma-bot");
    var bubble = document.createElement("div");
    bubble.className = "huma-bubble";
    bubble.textContent = text;
    wrap.appendChild(bubble);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  addMsg("bot", "Hola, soy Huma AI. En 2 minutos te digo si estás perdiendo citas por captación, agenda o retención. ¿Cómo puedo ayudarte?");

  async function send(text) {
    addMsg("user", text);
    addMsg("bot", "Un segundo…");

    // llama a TU API de Vercel (la de tu app)
    // esto funcionará cuando lo cargues desde tu dominio Vercel o app.humaagencia.es
    try {
      var res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      var data = await res.json();
      // borra "Un segundo…"
      body.removeChild(body.lastChild);
      addMsg("bot", data.reply || "Perfecto. ¿Me das un poco más de contexto?");
    } catch (e) {
      body.removeChild(body.lastChild);
      addMsg("bot", "No puedo conectar ahora. ¿Puedes intentarlo en un minuto?");
    }
  }

  document.getElementById("huma-chat-send").addEventListener("click", function () {
    var input = document.getElementById("huma-chat-text");
    var text = (input.value || "").trim();
    if (!text) return;
    input.value = "";
    send(text);
  });

  document.getElementById("huma-chat-text").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      document.getElementById("huma-chat-send").click();
    }
  });
})();

