const { artistasPorGenero } = require("../services/deezerServicie");

exports.buscarArtistasPorGenero = async (req, res) => {
  const genres = String(req.query.genres || req.query.genre || "")
    .split(",")
    .map((g) => g.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 3);

  if (!genres.length)
    return res.status(400).json({ error: "Falta parámetro genre" });

  try {
    const artists = await artistasPorGenero(genres);
    if (!artists.length)
      return res.status(404).json({ error: "Sin resultados para esos géneros" });
    res.json(artists.slice(0, 12));
  } catch (err) {
    console.error("Artistas por género (Deezer):", err.message);
    res.status(500).json({ error: "Error consultando Deezer" });
  }
};