const Song = require("../models/Song")
const axios = require("axios")
const { getSpotifyToken } = require("../config/spotifyConfig")

exports.addSong = async (req, res) => {
  const { url } = req.body;

  try {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    const trackId = match ? match[1] : null;

    if (!trackId) {
      return res.status(400).json({ error: 'URL de Spotify no válida.' });
    }

    const token = await getSpotifyToken();

    const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const track = response.data;

    const newSong = new Song({
      titulo: track.name,
      artista: track.artists.map((a) => a.name).join(', '),
      album: track.album.name,
      genero: 'Sin definir',
      imagen: track.album.images[0]?.url || '',
      url: track.external_urls.spotify,
      trackId,
      uri: track.uri,
      preview_url: track.preview_url,
      duration_ms: track.duration_ms, 
      release_date: track.album.release_date,
      popularity: track.popularity,
    });

    await newSong.save();
    res.status(201).json(newSong);
  } catch (error) {
    console.error("Error al añadir canción:", error.message);
    res.status(400).json({ error: error.message });
  }
};


exports.getSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.searchSpotifySongs = async (req, res) => {
  const { query } = req.query;

  try {
    const token = await getSpotifyToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'track', limit: 10 },
    });

    // Mapeamos los resultados para extraer solo la información necesaria
    const songs = response.data.tracks.items.map((track) => ({
      titulo: track.name,
      artista: track.artists.map((a) => a.name).join(", "),
      album: track.album.name,
      genero: "Sin definir",
      imagen: track.album.images[0]?.url || "https://images.wondershare.com/default.jpg",
      url: track.external_urls.spotify,
      spotifyId: track.id,
      uri: track.uri,
      preview_url: track.preview_url || null,
      duration_ms: track.duration_ms, 
      release_date: track.album.release_date, 
      popularity: track.popularity, 
    }));

    // Devolvemos las canciones
    res.json(songs);
  } catch (error) {
    console.error('Error al buscar canciones:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ error: "Canción no encontrada" });
    res.json(song);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};