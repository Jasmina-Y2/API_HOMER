import { pipeline } from "@xenova/transformers";

const API_KEY = "HomeroApp06-12-2025";

let esToEn;
let enToEs;

async function traducir(texto, from, to) {
  if (from === "es" && to === "en") {
    if (!esToEn) {
      esToEn = await pipeline("translation", "Xenova/opus-mt-es-en", {
        quantized: true,
      });
    }
    return (await esToEn(texto))[0].translation_text;
  }

  if (from === "en" && to === "es") {
    if (!enToEs) {
      enToEs = await pipeline("translation", "Xenova/opus-mt-en-es", {
        quantized: true,
      });
    }
    return (await enToEs(texto))[0].translation_text;
  }

  return null;
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const key = req.headers["x-api-key"];
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const { texto, from, to } = req.body;
  if (!texto || !from || !to) {
    return res.status(400).json({ error: "missing_fields" });
  }

  try {
    const out = await traducir(texto, from, to);
    if (out === null) {
      return res.status(400).json({ error: "invalid_language_pair" });
    }
    return res.status(200).json({ traducido: out });
  } catch (err) {
    return res.status(500).json({ error: "internal_error" });
  }
}
