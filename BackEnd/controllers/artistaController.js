const {spotifyApi,refreshToken} = require("../services/spotify")


exports.buscarArtistasPorGenero = async (req, res) => {
  const genre = req.query.genre;
  if (!genre) return res.status(400).json({ error: "Falta parámetro genre" });

  try {
    await refreshToken();

    const data = await spotifyApi.searchArtists(genre, { limit: 50 });
    const artists = data.body.artists.items
      .filter((artist) =>
        artist.genres.some((g) =>
          g.toLowerCase().includes(genre.toLowerCase())
        )
      )
      .slice(0, 10)
      .map((artist) => ({
        id: artist.id,
        nombre: artist.name,
        imagen: artist.images[0]?.url || null,
        genre: artist.genres?.join(", ") || "Desconocido",
      }));

    res.json(artists);
  } catch (error) {
    console.error("Error buscando artistas por género:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};