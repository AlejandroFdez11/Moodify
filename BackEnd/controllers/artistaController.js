const { spotifyGet, spotifyError } = require("../services/spotifyHttp");

exports.buscarArtistasPorGenero = async (req, res) => {
  const genres = String(req.query.genres || req.query.genre || "")
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean)
    .slice(0, 3);
  if (!genres.length)
    return res.status(400).json({ error: "Falta parámetro genre" });

  // Spotify limita /search a 10 resultados: una petición por género y se mezclan
  const buscar = async (g) => {
    const porGenero = await spotifyGet("/search", {
      q: `genre:"${g}"`,
      type: "artist",
      limit: 10,
    });
    if (porGenero.artists?.items?.length) return porGenero;
    return spotifyGet("/search", { q: g, type: "artist", limit: 10 }); // respaldo: búsqueda por texto
  };
  const results = await Promise.allSettled(genres.map(buscar));
  console.log(
    "Artistas por género:",
    results.map((r) =>
      r.status === "fulfilled"
        ? r.value.artists?.items?.length
        : r.reason.message,
    ),
  );
  if (results.every((r) => r.status === "rejected")) {
    console.error("Artistas por género:", results[0].reason?.message);
    const { status, error } = spotifyError(results[0].reason);
    return res.status(status).json({ error });
  }

  const seen = new Set();
  const artists = [];
  const lists = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value.artists?.items || []);
  for (let i = 0; i < 10; i++) {
    // reparto equilibrado entre géneros
    for (const l of lists) {
      const a = l[i];
      if (a && !seen.has(a.id)) {
        seen.add(a.id);
        artists.push({
          id: a.id,
          nombre: a.name,
          imagen: a.images?.[0]?.url || "/default-artist.png",
          genre: a.genres?.slice(0, 2).join(", ") || "Desconocido",
        });
      }
    }
  }
  res.json(artists.slice(0, 12));
};
