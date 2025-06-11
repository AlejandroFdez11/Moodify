const express = require("express");
const router = express.Router();
const {
  buscarArtistasPorGenero,
  obtenerAlbumsDeArtista,
  obtenerTopCanciones,
} = require("../controllers/artistaController");

router.get("/", buscarArtistasPorGenero);
router.get("/:id/albums", obtenerAlbumsDeArtista);
router.get("/:id/top-tracks", obtenerTopCanciones);

module.exports = router;