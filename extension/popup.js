// popup.js — API key activation UI and Localization

const apiKeyInput = document.getElementById("license-key");
const langSelect = document.getElementById("target-lang");
const saveBtn = document.getElementById("save-btn");
const msgEl = document.getElementById("msg");
const statusBadge = document.getElementById("status-badge");
const statusText = document.getElementById("status-text");

// ─── Localization Dictionary ───────────────────────────────
const i18n = {
  English: {
    extName: "SnapClarity", extDesc: "Highlight text → summarize / explain / improve",
    apiKeyLabel: "Gemini API Key", getApiKey: "→ Get your free Gemini API Key here",
    langLabel: "Language", activateBtn: "Activate / Save", howToUse: "How to use",
    step1: "Highlight any text on the web", step2: "Click the <strong>✦ AI</strong> button near the text",
    step3: "Select an action — drag panel to move", btnSummarize: "Summarize",
    btnExplain: "Explain", btnImprove: "Improve", footerText: "API KEY IS STORED LOCALLY AND NEVER SHARED",
    statusActive: "Activated ✓", statusInactive: "Not Activated", btnUpdateKey: "Update Key",
    msgEnterKey: "Please enter an API key", msgSaving: "Saving...", msgSuccess: "✓ Settings saved successfully!"
  },
  Vietnamese: {
    extName: "SnapClarity", extDesc: "Bôi đen văn bản → tóm tắt / giải thích / cải thiện",
    apiKeyLabel: "Mã API Gemini", getApiKey: "→ Lấy mã API Gemini miễn phí tại đây",
    langLabel: "Ngôn ngữ", activateBtn: "Kích hoạt / Lưu", howToUse: "Cách sử dụng",
    step1: "Bôi đen văn bản trên trang web", step2: "Bấm nút <strong>✦ AI</strong> xuất hiện gần đó",
    step3: "Chọn hành động — kéo panel để di chuyển", btnSummarize: "Tóm tắt",
    btnExplain: "Giải thích", btnImprove: "Cải thiện", footerText: "MÃ API ĐƯỢC LƯU TRÊN MÁY VÀ KHÔNG BỊ CHIA SẺ",
    statusActive: "Đã kích hoạt ✓", statusInactive: "Chưa kích hoạt", btnUpdateKey: "Cập nhật Key",
    msgEnterKey: "Vui lòng nhập mã API", msgSaving: "Đang lưu...", msgSuccess: "✓ Đã lưu cài đặt thành công!"
  },
  Spanish: {
    extName: "SnapClarity", extDesc: "Resalta texto → resumir / explicar / mejorar",
    apiKeyLabel: "Clave API de Gemini", getApiKey: "→ Consigue tu Clave API de Gemini gratis aquí",
    langLabel: "Idioma", activateBtn: "Activar / Guardar", howToUse: "Cómo usar",
    step1: "Resalta cualquier texto en la web", step2: "Haz clic en el botón <strong>✦ AI</strong>",
    step3: "Selecciona una acción — arrastra el panel", btnSummarize: "Resumir",
    btnExplain: "Explicar", btnImprove: "Mejorar", footerText: "LA CLAVE API SE ALMACENA LOCALMENTE Y NUNCA SE COMPARTE",
    statusActive: "Activado ✓", statusInactive: "No Activado", btnUpdateKey: "Actualizar Clave",
    msgEnterKey: "Por favor, introduce una clave API", msgSaving: "Guardando...", msgSuccess: "✓ ¡Configuración guardada con éxito!"
  },
  French: {
    extName: "SnapClarity", extDesc: "Surlignez du texte → résumer / expliquer / améliorer",
    apiKeyLabel: "Clé API Gemini", getApiKey: "→ Obtenez votre clé API Gemini gratuite ici",
    langLabel: "Langue", activateBtn: "Activer / Enregistrer", howToUse: "Comment utiliser",
    step1: "Surlignez n'importe quel texte sur le web", step2: "Cliquez sur le bouton <strong>✦ AI</strong>",
    step3: "Sélectionnez une action — faites glisser le panneau", btnSummarize: "Résumer",
    btnExplain: "Expliquer", btnImprove: "Améliorer", footerText: "LA CLÉ API EST STOCKÉE LOCALEMENT ET N'EST JAMAIS PARTAGÉE",
    statusActive: "Activé ✓", statusInactive: "Non Activé", btnUpdateKey: "Mettre à jour",
    msgEnterKey: "Veuillez entrer une clé API", msgSaving: "Enregistrement...", msgSuccess: "✓ Paramètres enregistrés avec succès !"
  },
  Japanese: {
    extName: "SnapClarity", extDesc: "テキストを選択 → 要約 / 説明 / 改善",
    apiKeyLabel: "Gemini API キー", getApiKey: "→ ここで無料の Gemini API キーを取得",
    langLabel: "言語", activateBtn: "有効化 / 保存", howToUse: "使い方",
    step1: "ウェブ上の任意のテキストを選択", step2: "テキスト近くの <strong>✦ AI</strong> ボタンをクリック",
    step3: "アクションを選択 — パネルをドラッグして移動", btnSummarize: "要約",
    btnExplain: "説明", btnImprove: "改善", footerText: "API キーはローカルに保存され、共有されません",
    statusActive: "有効化済み ✓", statusInactive: "未有効化", btnUpdateKey: "キーを更新",
    msgEnterKey: "API キーを入力してください", msgSaving: "保存中...", msgSuccess: "✓ 設定が正常に保存されました！"
  },
  Chinese: {
    extName: "SnapClarity", extDesc: "高亮文本 → 总结 / 解释 / 润色",
    apiKeyLabel: "Gemini API 密钥", getApiKey: "→ 在此获取免费的 Gemini API 密钥",
    langLabel: "语言", activateBtn: "激活 / 保存", howToUse: "如何使用",
    step1: "在网页上高亮任何文本", step2: "点击文本附近的 <strong>✦ AI</strong> 按钮",
    step3: "选择一个操作 — 拖动面板以移动", btnSummarize: "总结",
    btnExplain: "解释", btnImprove: "润色", footerText: "API 密钥安全地存储在本地，绝不共享",
    statusActive: "已激活 ✓", statusInactive: "未激活", btnUpdateKey: "更新密钥",
    msgEnterKey: "请输入 API 密钥", msgSaving: "保存中...", msgSuccess: "✓ 设置保存成功！"
  },
  German: {
    extName: "SnapClarity", extDesc: "Text markieren → zusammenfassen / erklären / verbessern",
    apiKeyLabel: "Gemini API-Schlüssel", getApiKey: "→ Holen Sie sich hier Ihren kostenlosen Gemini API-Schlüssel",
    langLabel: "Sprache", activateBtn: "Aktivieren / Speichern", howToUse: "Verwendung",
    step1: "Markieren Sie einen beliebigen Text", step2: "Klicken Sie auf die Schaltfläche <strong>✦ AI</strong>",
    step3: "Wählen Sie eine Aktion — Panel zum Bewegen ziehen", btnSummarize: "Zusammenfassen",
    btnExplain: "Erklären", btnImprove: "Verbessern", footerText: "API-SCHLÜSSEL WIRD LOKAL GESPEICHERT UND NIEMALS GETEILT",
    statusActive: "Aktiviert ✓", statusInactive: "Nicht aktiviert", btnUpdateKey: "Schlüssel aktualisieren",
    msgEnterKey: "Bitte API-Schlüssel eingeben", msgSaving: "Speichern...", msgSuccess: "✓ Einstellungen erfolgreich gespeichert!"
  },
  Italian: {
    extName: "SnapClarity", extDesc: "Evidenzia il testo → riassumi / spiega / migliora",
    apiKeyLabel: "Chiave API Gemini", getApiKey: "→ Ottieni qui la tua chiave API Gemini gratuita",
    langLabel: "Lingua", activateBtn: "Attiva / Salva", howToUse: "Come usare",
    step1: "Evidenzia qualsiasi testo sul web", step2: "Fai clic sul pulsante <strong>✦ AI</strong>",
    step3: "Seleziona un'azione — trascina il pannello", btnSummarize: "Riassumi",
    btnExplain: "Spiega", btnImprove: "Migliora", footerText: "LA CHIAVE API È SALVATA LOCALMENTE E MAI CONDIVISA",
    statusActive: "Attivato ✓", statusInactive: "Non attivato", btnUpdateKey: "Aggiorna chiave",
    msgEnterKey: "Inserisci una chiave API", msgSaving: "Salvataggio...", msgSuccess: "✓ Impostazioni salvate con successo!"
  },
  Portuguese: {
    extName: "SnapClarity", extDesc: "Destaque o texto → resumir / explicar / melhorar",
    apiKeyLabel: "Chave API Gemini", getApiKey: "→ Obtenha sua chave API Gemini gratuita aqui",
    langLabel: "Idioma", activateBtn: "Ativar / Salvar", howToUse: "Como usar",
    step1: "Destaque qualquer texto na web", step2: "Clique no botão <strong>✦ AI</strong>",
    step3: "Selecione uma ação — arraste o painel", btnSummarize: "Resumir",
    btnExplain: "Explicar", btnImprove: "Melhorar", footerText: "A CHAVE API É ARMAZENADA LOCALMENTE E NUNCA COMPARTILHADA",
    statusActive: "Ativado ✓", statusInactive: "Não ativado", btnUpdateKey: "Atualizar chave",
    msgEnterKey: "Insira uma chave API", msgSaving: "Salvando...", msgSuccess: "✓ Configurações salvas com sucesso!"
  },
  Russian: {
    extName: "SnapClarity", extDesc: "Выделите текст → кратко / объяснить / улучшить",
    apiKeyLabel: "API ключ Gemini", getApiKey: "→ Получите бесплатный API ключ Gemini здесь",
    langLabel: "Язык", activateBtn: "Активировать / Сохранить", howToUse: "Как использовать",
    step1: "Выделите любой текст в интернете", step2: "Нажмите кнопку <strong>✦ AI</strong>",
    step3: "Выберите действие — перетащите панель", btnSummarize: "Кратко",
    btnExplain: "Объяснить", btnImprove: "Улучшить", footerText: "API-КЛЮЧ ХРАНИТСЯ ЛОКАЛЬНО И НИКОГДА НЕ ПЕРЕДАЕТСЯ",
    statusActive: "Активирован ✓", statusInactive: "Не активирован", btnUpdateKey: "Обновить ключ",
    msgEnterKey: "Пожалуйста, введите API ключ", msgSaving: "Сохранение...", msgSuccess: "✓ Настройки успешно сохранены!"
  },
  Arabic: {
    extName: "SnapClarity", extDesc: "حدد النص → تلخيص / شرح / تحسين",
    apiKeyLabel: "مفتاح Gemini API", getApiKey: "→ احصل على مفتاح Gemini API مجاني هنا",
    langLabel: "اللغة", activateBtn: "تفعيل / حفظ", howToUse: "كيفية الاستخدام",
    step1: "حدد أي نص على الويب", step2: "انقر على زر <strong>✦ AI</strong>",
    step3: "اختر إجراء — اسحب اللوحة للتحريك", btnSummarize: "تلخيص",
    btnExplain: "شرح", btnImprove: "تحسين", footerText: "يتم تخزين مفتاح API محليًا ولا يتم مشاركته أبدًا",
    statusActive: "مفعل ✓", statusInactive: "غير مفعل", btnUpdateKey: "تحديث المفتاح",
    msgEnterKey: "يرجى إدخال مفتاح API", msgSaving: "جاري الحفظ...", msgSuccess: "✓ تم حفظ الإعدادات بنجاح!"
  },
  Hindi: {
    extName: "SnapClarity", extDesc: "टेक्स्ट हाइलाइट करें → सारांश / व्याख्या / सुधारें",
    apiKeyLabel: "जेमिनी API कुंजी", getApiKey: "→ अपनी मुफ़्त जेमिनी API कुंजी यहाँ प्राप्त करें",
    langLabel: "भाषा", activateBtn: "सक्रिय करें / सहेजें", howToUse: "कैसे उपयोग करें",
    step1: "वेब पर कोई भी टेक्स्ट हाइलाइट करें", step2: "<strong>✦ AI</strong> बटन पर क्लिक करें",
    step3: "कोई कार्रवाई चुनें — पैनल खींचें", btnSummarize: "सारांश",
    btnExplain: "व्याख्या", btnImprove: "सुधारें", footerText: "एपीआई कुंजी स्थानीय रूप से संग्रहीत है और कभी साझा नहीं की जाती है",
    statusActive: "सक्रिय ✓", statusInactive: "सक्रिय नहीं", btnUpdateKey: "कुंजी अपडेट करें",
    msgEnterKey: "कृपया एपीआई कुंजी दर्ज करें", msgSaving: "सहेजा जा रहा है...", msgSuccess: "✓ सेटिंग्स सफलतापूर्वक सहेजी गईं!"
  },
  Korean: {
    extName: "SnapClarity", extDesc: "텍스트 강조 → 요약 / 설명 / 개선",
    apiKeyLabel: "Gemini API 키", getApiKey: "→ 여기서 무료 Gemini API 키 받기",
    langLabel: "언어", activateBtn: "활성화 / 저장", howToUse: "사용 방법",
    step1: "웹에서 텍스트를 강조 표시합니다", step2: "<strong>✦ AI</strong> 버튼을 클릭합니다",
    step3: "작업을 선택하세요 — 패널을 드래그하여 이동", btnSummarize: "요약",
    btnExplain: "설명", btnImprove: "개선", footerText: "API 키는 로컬에 저장되며 절대 공유되지 않습니다",
    statusActive: "활성화됨 ✓", statusInactive: "비활성화됨", btnUpdateKey: "키 업데이트",
    msgEnterKey: "API 키를 입력하세요", msgSaving: "저장 중...", msgSuccess: "✓ 설정이 성공적으로 저장되었습니다!"
  }
};

let currentLang = "English";

function applyLocalization(lang) {
  currentLang = lang;
  const dict = i18n[lang] || i18n["English"];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.innerHTML = dict[key]; // use innerHTML for bold tags in step2
    }
  });

  // Update status badge immediately if activated
  const isActivated = statusBadge.classList.contains("active");
  statusText.textContent = isActivated ? dict.statusActive : dict.statusInactive;
  saveBtn.textContent = isActivated ? dict.btnUpdateKey : dict.activateBtn;
}

langSelect.addEventListener("change", (e) => {
  applyLocalization(e.target.value);
});

// ─── Load current status ───────────────────────────────
chrome.storage.sync.get(["geminiApiKey", "apiKeySaved", "targetLang"], ({ geminiApiKey, apiKeySaved, targetLang }) => {
  if (geminiApiKey) {
    apiKeyInput.value = geminiApiKey;
  }
  if (targetLang) {
    langSelect.value = targetLang;
  }
  applyLocalization(langSelect.value);
  updateStatusBadge(apiKeySaved && geminiApiKey);
});

// ─── Update badge status ───────────────────────────────────────────
function updateStatusBadge(active) {
  const dict = i18n[currentLang] || i18n["English"];
  statusBadge.className = `status-badge ${active ? "active" : "inactive"}`;
  statusText.textContent = active ? dict.statusActive : dict.statusInactive;
  saveBtn.textContent = active ? dict.btnUpdateKey : dict.activateBtn;
}

// ─── Activate button ────────────────────────────────────────────────────────
saveBtn.addEventListener("click", async () => {
  const key = apiKeyInput.value.trim();
  const lang = langSelect.value;
  const dict = i18n[currentLang] || i18n["English"];

  if (!key) {
    showMsg(dict.msgEnterKey, "err");
    return;
  }

  saveBtn.textContent = dict.msgSaving;
  saveBtn.disabled = true;
  showMsg("", "");

  try {
    // Simply save the key and language
    await chrome.storage.sync.set({ geminiApiKey: key, apiKeySaved: true, targetLang: lang });
    updateStatusBadge(true);
    showMsg(dict.msgSuccess, "ok");
  } catch (err) {
    await chrome.storage.sync.set({ apiKeySaved: false });
    updateStatusBadge(false);
    showMsg(`✗ ${err.message}`, "err");
  } finally {
    saveBtn.disabled = false;
  }
});

// ─── Helper ───────────────────────────────────────────────────────────────
function showMsg(text, type) {
  msgEl.textContent = text;
  msgEl.className = `msg ${type}`;
  if (type === "ok") {
    setTimeout(() => { msgEl.textContent = ""; msgEl.className = "msg"; }, 4000);
  }
}
