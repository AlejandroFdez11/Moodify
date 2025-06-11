const express = require("express");
const router = express.Router();
const {
  buscarArtistasPorGenero,
} = require("../controllers/artistaController");

router.get("/", buscarArtistasPorGenero);

module.exports = router;