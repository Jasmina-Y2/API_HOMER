import express from "express";
import cors from "cors";
import traducir from "./api/traducir.js";
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
