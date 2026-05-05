// worker.js — Cloudflare Worker
// Extension → Worker (validate license) → Gemini API
//
// Env variables (set qua Cloudflare Dashboard → Workers → Settings → Variables):
//   GEMINI_API_KEY       : lấy miễn phí tại aistudio.google.com
//   GUMROAD_PRODUCT_ID   : permalink của product trên Gumroad (vd: "abcde")
//   GUMROAD_ACCESS_TOKEN : Settings → Advanced → Access token

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const PROMPTS = {
  summarize: `Summarize the given text in 2-4 bullet points using "•". Be concise. Reply in the same language as the input.`,
  explain:   `Explain the given text simply and clearly. Use plain language. Reply in the same language as the input.`,
  translate: `Translate: Vietnamese→English, English→Vietnamese, other→English. Output only the translation.`,
  improve:   `Improve the writing. Fix grammar, clarity, and flow. Keep original meaning. Reply in same language.`,
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

    const { pathname } = new URL(request.url);

    if (pathname === "/api/verify" && request.method === "POST")
      return handleVerify(request, env);

    if (pathname === "/api/process" && request.method === "POST")
      return handleProcess(request, env);

    return new Response("Not found", { status: 404 });
  },
};

// ─── /api/verify ──────────────────────────────────────────────────────────
async function handleVerify(request, env) {
  try {
    const { licenseKey } = await request.json();
    if (!licenseKey) return errRes("Missing license key", 400);

    const valid = await checkGumroadLicense(licenseKey, env);
    if (!valid) return errRes("Invalid or inactive license key", 403);

    return okRes({ ok: true, message: "License verified!" });
  } catch (e) {
    return errRes(e.message, 500);
  }
}

// ─── /api/process ─────────────────────────────────────────────────────────
async function handleProcess(request, env) {
  try {
    const { licenseKey, text, mode } = await request.json();

    if (!licenseKey || !text || !mode) return errRes("Missing fields", 400);
    if (text.trim().length < 3)        return errRes("Text too short", 400);
    if (text.length > 8000)            return errRes("Text too long (max 8000 chars)", 400);

    // 1. Validate license
    const valid = await checkGumroadLicense(licenseKey, env);
    if (!valid) return errRes("Invalid license key", 403);

    // 2. Call Gemini
    const prompt = PROMPTS[mode] ?? PROMPTS.summarize;
    const result = await callGemini(text, prompt, env.GEMINI_API_KEY);

    return okRes({ result });
  } catch (e) {
    return errRes(e.message || "Internal error", 500);
  }
}

// ─── Gumroad license verification ─────────────────────────────────────────
async function checkGumroadLicense(licenseKey, env) {
  const body = new URLSearchParams({
    product_id: env.GUMROAD_PRODUCT_ID,
    license_key: licenseKey.trim().toUpperCase(),
    increment_uses_count: "false",
  });

  const res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${env.GUMROAD_ACCESS_TOKEN}`,
    },
    body,
  });

  if (!res.ok) return false;
  const data = await res.json();
  return data.success === true && !data.purchase?.refunded && !data.purchase?.chargebacked;
}

// ─── Gemini API ────────────────────────────────────────────────────────────
async function callGemini(text, systemPrompt, apiKey) {
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text }] }],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.3 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gemini error ${res.status}`);
  }

  const data = await res.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error("Empty response from Gemini");
  return content;
}

// ─── Helpers ──────────────────────────────────────────────────────────────
const okRes  = (d, s=200) => new Response(JSON.stringify(d), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const errRes = (m, s=400) => new Response(JSON.stringify({ error: m }), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
