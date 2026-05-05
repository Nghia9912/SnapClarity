// content.js v2 — dùng license key thay API key

(function () {
  "use strict";

  let floatBtn = null, panel = null;
  let selectedText = "", selectionRect = null;

  // ─── Localization Dictionary ──────────────────────────────────────────
  const i18n = {
    English: { panelTitle: "✦ SnapClarity", btnSummarize: "Summarize", btnExplain: "Explain", btnImprove: "Improve", placeholder: "Select an action above ↑", btnCopy: "Copy", btnCopied: "Copied!", errApiKey: "Click the extension icon to activate your API key." },
    Vietnamese: { panelTitle: "✦ SnapClarity", btnSummarize: "Tóm tắt", btnExplain: "Giải thích", btnImprove: "Cải thiện", placeholder: "Chọn một hành động bên trên ↑", btnCopy: "Sao chép", btnCopied: "Đã sao chép!", errApiKey: "Bấm icon extension để kích hoạt mã API của bạn." },
    Spanish: { panelTitle: "✦ SnapClarity", btnSummarize: "Resumir", btnExplain: "Explicar", btnImprove: "Mejorar", placeholder: "Selecciona una acción arriba ↑", btnCopy: "Copiar", btnCopied: "¡Copiado!", errApiKey: "Haz clic en el icono para activar tu clave API." },
    French: { panelTitle: "✦ SnapClarity", btnSummarize: "Résumer", btnExplain: "Expliquer", btnImprove: "Améliorer", placeholder: "Sélectionnez une action ci-dessus ↑", btnCopy: "Copier", btnCopied: "Copié !", errApiKey: "Cliquez sur l'icône pour activer votre clé API." },
    Japanese: { panelTitle: "✦ SnapClarity", btnSummarize: "要約", btnExplain: "説明", btnImprove: "改善", placeholder: "上のアクションを選択 ↑", btnCopy: "コピー", btnCopied: "コピーしました！", errApiKey: "拡張機能アイコンをクリックして API キーを有効にしてください。" },
    Chinese: { panelTitle: "✦ SnapClarity", btnSummarize: "总结", btnExplain: "解释", btnImprove: "润色", placeholder: "在上方选择一个操作 ↑", btnCopy: "复制", btnCopied: "已复制！", errApiKey: "点击扩展图标激活您的 API 密钥。" },
    German: { panelTitle: "✦ SnapClarity", btnSummarize: "Zusammenfassen", btnExplain: "Erklären", btnImprove: "Verbessern", placeholder: "Aktion oben auswählen ↑", btnCopy: "Kopieren", btnCopied: "Kopiert!", errApiKey: "Klicken Sie auf das Erweiterungssymbol, um Ihren API-Schlüssel zu aktivieren." },
    Italian: { panelTitle: "✦ SnapClarity", btnSummarize: "Riassumi", btnExplain: "Spiega", btnImprove: "Migliora", placeholder: "Seleziona un'azione sopra ↑", btnCopy: "Copia", btnCopied: "Copiato!", errApiKey: "Fai clic sull'icona dell'estensione per attivare la tua chiave API." },
    Portuguese: { panelTitle: "✦ SnapClarity", btnSummarize: "Resumir", btnExplain: "Explicar", btnImprove: "Melhorar", placeholder: "Selecione uma ação acima ↑", btnCopy: "Copiar", btnCopied: "Copiado!", errApiKey: "Clique no ícone da extensão para ativar sua chave API." },
    Russian: { panelTitle: "✦ SnapClarity", btnSummarize: "Кратко", btnExplain: "Объяснить", btnImprove: "Улучшить", placeholder: "Выберите действие выше ↑", btnCopy: "Копировать", btnCopied: "Скопировано!", errApiKey: "Нажмите на значок расширения, чтобы активировать API-ключ." },
    Arabic: { panelTitle: "✦ SnapClarity", btnSummarize: "تلخيص", btnExplain: "شرح", btnImprove: "تحسين", placeholder: "اختر إجراءً أعلاه ↑", btnCopy: "نسخ", btnCopied: "تم النسخ!", errApiKey: "انقر على أيقونة الإضافة لتفعيل مفتاح API الخاص بك." },
    Hindi: { panelTitle: "✦ SnapClarity", btnSummarize: "सारांश", btnExplain: "व्याख्या", btnImprove: "सुधारें", placeholder: "ऊपर एक कार्रवाई चुनें ↑", btnCopy: "कॉपी", btnCopied: "कॉपी किया गया!", errApiKey: "अपनी एपीआई कुंजी सक्रिय करने के लिए एक्सटेंशन आइकन पर क्लिक करें।" },
    Korean: { panelTitle: "✦ SnapClarity", btnSummarize: "요약", btnExplain: "설명", btnImprove: "개선", placeholder: "위에서 작업을 선택하세요 ↑", btnCopy: "복사", btnCopied: "복사됨!", errApiKey: "확장 프로그램 아이콘을 클릭하여 API 키를 활성화하세요." }
  };
  
  let currentLang = "English";
  let dict = i18n["English"];

  chrome.storage.sync.get(["targetLang"], ({ targetLang }) => {
    if (targetLang && i18n[targetLang]) {
      currentLang = targetLang;
      dict = i18n[targetLang];
    }
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && changes.targetLang) {
      currentLang = changes.targetLang.newValue;
      dict = i18n[currentLang] || i18n["English"];
      if (panel) updatePanelLang();
    }
  });

  function updatePanelLang() {
    panel.querySelector(".ais-panel-title").textContent = dict.panelTitle;
    panel.querySelector('[data-mode="summarize"]').textContent = dict.btnSummarize;
    panel.querySelector('[data-mode="explain"]').textContent = dict.btnExplain;
    panel.querySelector('[data-mode="improve"]').textContent = dict.btnImprove;
    const placeholder = panel.querySelector(".ais-placeholder");
    if (placeholder) placeholder.textContent = dict.placeholder;
    const copyBtn = panel.querySelector("#ais-copy");
    if (copyBtn && copyBtn.style.display !== "none" && copyBtn.textContent !== dict.btnCopied) {
      copyBtn.textContent = dict.btnCopy;
    }
  }

  // ─── Float button ─────────────────────────────────────────────────────
  function createFloatBtn() {
    const btn = document.createElement("div");
    btn.id = "ais-float-btn";
    btn.innerHTML = `<span class="ais-icon">✦</span><span class="ais-label">AI</span>`;
    btn.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showPanel(selectedText, selectionRect);
    });
    document.body.appendChild(btn);
    return btn;
  }

  function positionBtn(rect) {
    if (!floatBtn) floatBtn = createFloatBtn();
    const sx = window.scrollX, sy = window.scrollY, bw = 56;
    let left = rect.left + sx + rect.width / 2 - bw / 2;
    let top = rect.top + sy - 44;
    left = Math.max(sx + 8, Math.min(left, sx + window.innerWidth - bw - 8));
    if (top < sy + 8) top = rect.bottom + sy + 8;
    floatBtn.style.left = `${left}px`;
    floatBtn.style.top = `${top}px`;
    floatBtn.classList.add("ais-visible");
  }

  function hideBtn() { floatBtn?.classList.remove("ais-visible"); }

  // ─── Panel ────────────────────────────────────────────────────────────
  function createPanel() {
    const el = document.createElement("div");
    el.id = "ais-panel";
    el.innerHTML = `
      <div class="ais-panel-header">
        <span class="ais-panel-title">${dict.panelTitle}</span>
        <button class="ais-close-btn" id="ais-close">✕</button>
      </div>
      <div class="ais-panel-selected" id="ais-selected-preview"></div>
      <div class="ais-action-bar">
        <button class="ais-action" data-mode="summarize">${dict.btnSummarize}</button>
        <button class="ais-action" data-mode="explain">${dict.btnExplain}</button>
        <button class="ais-action" data-mode="improve">${dict.btnImprove}</button>
      </div>
      <div class="ais-result" id="ais-result">
        <div class="ais-placeholder">${dict.placeholder}</div>
      </div>
      <div class="ais-panel-footer">
        <button class="ais-copy-btn" id="ais-copy" style="display:none">${dict.btnCopy}</button>
      </div>
    `;
    el.querySelector("#ais-close").addEventListener("click", hidePanel);
    el.querySelectorAll(".ais-action").forEach(btn =>
      btn.addEventListener("click", () => runAction(btn.dataset.mode))
    );
    el.querySelector("#ais-copy").addEventListener("click", copyResult);
    makeDraggable(el);
    document.body.appendChild(el);
    return el;
  }

  function showPanel(text, rect) {
    if (!panel) panel = createPanel();
    updatePanelLang(); // Ensure correct language on show
    selectedText = text;
    const display = text.length > 120 ? text.slice(0, 120) + "…" : text;
    panel.querySelector("#ais-selected-preview").textContent = `"${display}"`;
    panel.querySelector("#ais-result").innerHTML = `<div class="ais-placeholder">${dict.placeholder}</div>`;
    panel.querySelector("#ais-copy").style.display = "none";
    panel.querySelectorAll(".ais-action").forEach(b => b.classList.remove("ais-active"));

    const sx = window.scrollX, sy = window.scrollY, pw = 340;
    let left = rect.right + sx + 12;
    let top = rect.top + sy;
    if (left + pw > sx + window.innerWidth - 12) left = rect.left + sx - pw - 12;
    if (left < sx + 8) left = sx + Math.max(8, window.innerWidth / 2 - pw / 2);
    top = Math.max(sy + 8, Math.min(top, sy + window.innerHeight - 400));

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
    panel.classList.add("ais-visible");
    hideBtn();
  }

  function hidePanel() { panel?.classList.remove("ais-visible"); }

  // ─── Run AI action ─────────────────────────────────────────────────────
  async function runAction(mode) {
    const resultEl = panel.querySelector("#ais-result");
    const copyBtn = panel.querySelector("#ais-copy");

    panel.querySelectorAll(".ais-action").forEach(b => b.classList.remove("ais-active"));
    panel.querySelector(`[data-mode="${mode}"]`).classList.add("ais-active");

    resultEl.innerHTML = `<div class="ais-loading"><span></span><span></span><span></span></div>`;
    copyBtn.style.display = "none";

    chrome.runtime.sendMessage(
      { action: "callAI", text: selectedText, mode },
      (response) => {
        if (chrome.runtime.lastError || response?.error) {
          const msg = response?.error || chrome.runtime.lastError?.message;
          const isApiKey = msg?.toLowerCase().includes("api key") || msg?.toLowerCase().includes("license");
          resultEl.innerHTML = `
            <div class="ais-error">
              ⚠ ${escHtml(msg)}
              ${isApiKey ? `<br><br><span style="font-size:11px;color:#6b6b8a">${dict.errApiKey}</span>` : ""}
            </div>`;
          return;
        }
        resultEl.innerHTML = formatResult(response.result);
        copyBtn.textContent = dict.btnCopy;
        copyBtn.style.display = "block";
        copyBtn.dataset.text = response.result;
      }
    );
  }

  function formatResult(text) {
    return text.split("\n").map(line => {
      line = line.trim();
      if (!line) return "";
      if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*"))
        return `<div class="ais-bullet">${escHtml(line.slice(1).trim())}</div>`;
      return `<p>${escHtml(line)}</p>`;
    }).filter(Boolean).join("");
  }

  async function copyResult(e) {
    await navigator.clipboard.writeText(e.currentTarget.dataset.text);
    e.currentTarget.textContent = dict.btnCopied;
    setTimeout(() => (e.currentTarget.textContent = dict.btnCopy), 1500);
  }

  function makeDraggable(el) {
    const header = el.querySelector(".ais-panel-header");
    let dragging = false, ox = 0, oy = 0;
    header.addEventListener("mousedown", e => {
      if (e.target.id === "ais-close") return;
      dragging = true;
      ox = e.clientX - el.getBoundingClientRect().left;
      oy = e.clientY - el.getBoundingClientRect().top;
      el.style.transition = "none";
      e.preventDefault();
    });
    document.addEventListener("mousemove", e => {
      if (!dragging) return;
      el.style.left = `${e.clientX - ox + window.scrollX}px`;
      el.style.top = `${e.clientY - oy + window.scrollY}px`;
    });
    document.addEventListener("mouseup", () => { dragging = false; el.style.transition = ""; });
  }

  // ─── Text selection ────────────────────────────────────────────────────
  document.addEventListener("mouseup", e => {
    if (e.target.closest("#ais-float-btn, #ais-panel")) return;
    setTimeout(() => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();
      if (text && text.length >= 5) {
        selectedText = text;
        selectionRect = sel.getRangeAt(0).getBoundingClientRect();
        positionBtn(selectionRect);
      } else { hideBtn(); }
    }, 10);
  });

  document.addEventListener("mousedown", e => {
    if (!e.target.closest("#ais-float-btn, #ais-panel")) hideBtn();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { hideBtn(); hidePanel(); }
  });

  function escHtml(str) {
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }
})();
