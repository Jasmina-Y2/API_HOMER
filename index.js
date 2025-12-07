import express from "express";
import cors from "cors";
import { pipeline } from "@xenova/transformers";

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------
// AUTH
// -------------------------
const API_KEY = "HomeroApp06-12-2025";

function auth(req, res, next) {
  const key = req.headers["x-api-key"];
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

// -------------------------
// TRADUCTORES
// -------------------------
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

// -------------------------
// RUTA PROTEGIDA
// -------------------------
app.post("/traducir", auth, async (req, res) => {
  const { texto, from, to } = req.body;
  const output = await traducir(texto, from, to);
  res.json({ traducido: output });
});

// -------------------------
app.listen(3000, () => {
  console.log("API en puerto 3000");
});
