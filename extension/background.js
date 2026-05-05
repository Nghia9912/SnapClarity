// background.js — Service Worker v2
// Calls Gemini API directly instead of Cloudflare Worker

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "callAI") {
    handleAIRequest(request).then(sendResponse).catch(err =>
      sendResponse({ error: err.message })
    );
    return true;
  }
});

async function handleAIRequest({ text, mode }) {
  const { geminiApiKey, targetLang } = await chrome.storage.sync.get(["geminiApiKey", "targetLang"]);

  if (!geminiApiKey) {
    throw new Error("No API key found. Please click the extension icon to activate.");
  }

  const lang = targetLang || "English";

  let prompt = "";
  if (mode === "summarize") prompt = `Summarize the following text concisely in ${lang}:\n\n`;
  else if (mode === "explain") prompt = `Explain the following text clearly in ${lang}:\n\n`;
  else if (mode === "improve") prompt = `Improve the grammar and flow of the following text in ${lang}:\n\n`;
  else prompt = "Process the following text:\n\n";

  const response = await fetch(`${GEMINI_URL}${geminiApiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt + text
        }]
      }]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 403 || response.status === 400)
      throw new Error("Invalid API key or request. Please check your extension settings.");
    throw new Error(data.error?.message || `Server error ${response.status}`);
  }

  if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
    return { result: data.candidates[0].content.parts[0].text };
  } else {
    throw new Error("No result returned from AI.");
  }
}
