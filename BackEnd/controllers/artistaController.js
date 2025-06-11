const {spotifyApi,refreshToken} = require("../services/spotify")


exports.buscarArtistasPorGenero = async (req, res) => {
  const genre = req.query.genre;
  if (!genre) return res.status(400).json({ error: "Falta parámetro genre" });

  try {
    await refreshToken();

    const data = await spotifyApi.searchArtists(`genre:"${genre}"`, { limit: 10 });
    const artists = data.body.artists.items.map((artist) => ({
      id: artist.id,
      nombre: artist.name,
      imagen: artist.images[0]?.url || null,
    }));

    res.json(artists);
  } catch (error) {
    console.error("Error buscando artistas por género:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.obtenerAlbumsDeArtista = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Falta parámetro id" });

  try {
    await refreshToken();

    const data = await spotifyApi.getArtistAlbums(id, { limit: 10 });
    const albums = data.body.items.map((album) => ({
      id: album.id,
      nombre: album.name,
      imagen: album.images[0]?.url || null,
    }));

    res.json(albums);
  } catch (error) {
    console.error("Error obteniendo álbumes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.obtenerTopCanciones = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Falta parámetro id" });

  try {
    await refreshToken();

    const data = await spotifyApi.getArtistTopTracks(id, "ES"); // Cambia "ES" si necesitas otro país
    const tracks = data.body.tracks.map((track) => ({
      id: track.id,
      nombre: track.name,
      preview_url: track.preview_url,
      album: {
        id: track.album.id,
        nombre: track.album.name,
        imagen: track.album.images[0]?.url || null,
      },
    }));

    res.json(tracks);
  } catch (error) {
    console.error("Error obteniendo top tracks:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};