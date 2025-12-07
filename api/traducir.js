import { pipeline } from "@xenova/transformers";
const API_KEY = "HomeroApp06-12-2025";

function auth(req, res, next) {
  const key = req.headers["x-api-key"];
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

let esToEn;
let enToEs;

async function traducir(texto, from, to) {
  try {
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
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-api-key"
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check authentication
  const key = req.headers["x-api-key"];
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }

  try {
    const { texto, from, to } = req.body;

    // Validate input
    if (!texto || !from || !to) {
      return res
        .status(400)
        .json({ error: "Missing required fields: texto, from, to" });
    }

    const output = await traducir(texto, from, to);

    if (output === null) {
      return res.status(400).json({ error: "Invalid language pair" });
    }

    res.status(200).json({ traducido: output });
  } catch (error) {
    console.error("Handler error:", error);
    res
      .status(500)
      .json({ error: "Translation failed", details: error.message });
  }
}
