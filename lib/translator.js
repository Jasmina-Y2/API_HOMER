import { pipeline } from "@xenova/transformers";

// -------------------------
// TRADUCTORES (cached globally)
// -------------------------
let esToEn;
let enToEs;

export async function traducir(texto, from, to) {
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
