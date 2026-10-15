const express = require("express");
const router = express.Router();

const {
  buscarArtistas,
  artistasPorGenero,
  topArtista,
  buscarCanciones,
  cancionFresca,
  porEmocion,
} = require("../services/deezerServicie");

const ok = (fn) => async (req, res) => {
  try {
    res.json(await fn(req));
  } catch (e) {
    console.error("[deezerRouter]", e.message);
    res.status(502).json({ error: e.message });
  }
};

router.get("/artistas", ok((q) =>
  q.query.q
    ? buscarArtistas(q.query.q)
    : artistasPorGenero((q.query.genres || q.query.genre || "pop").split(",").map(s => s.trim()))
));

router.get("/artistas/:id/top", ok((q) => topArtista(q.params.id)));

router.get("/canciones", ok((q) => buscarCanciones(q.query.q)));

router.get("/cancion/:id", ok((q) => cancionFresca(q.params.id)));

router.get("/emocion", ok((q) =>
  porEmocion(Number(q.query.animo) || 50, Number(q.query.energia) || 50)
));

module.exports = router;