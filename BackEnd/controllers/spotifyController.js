const axios = require("axios");
const { getSpotifyToken } = require("../config/spotifyConfig");
const { spotifyApi, refreshToken } = require("../services/spotify")

exports.searchSpotifyPlaylists = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "El parámetro 'query' es obligatorio." });
  }

  try {
    const token = await getSpotifyToken();
    const resp = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'playlist', limit: 10 }
    });

    if (
      !resp.data ||
      !resp.data.playlists ||
      !Array.isArray(resp.data.playlists.items)
    ) {
      return res.status(500).json({ error: "Respuesta inesperada de la API de Spotify." });
    }

    const playlists = resp.data.playlists.items
      .filter(pl => pl && pl.id)
      .map(pl => ({
        id: pl.id,
        nombre: pl.name,
        imagen: pl.images?.[0]?.url || null,
        descripcion: pl.description || 'Álbum de música'
      }));

    res.json(playlists);
  } catch (error) {
    console.error('Error al buscar playlists:', error);
    res.status(400).json({ error: error.message || "Error inesperado" });
  }
};

exports.searchSpotifyArtists = async (req, res) => {
  const { query } = req.query;
  try {
    const token = await getSpotifyToken();
    const resp = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'artist', limit: 10 }
    });
    const artistas = resp.data.artists.items.map(ar => ({
      id: ar.id,
      name: ar.name,
      imagen: ar.images[0]?.url || null,
      genero: ar.genres?.[0] || 'Sin definir'
    }));
    res.json(artistas);
  } catch (error) {
    console.error('Error al buscar artistas:', error);
    res.status(400).json({ error: error.message });
  }
};

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

exports.getSpotifyPlaylistById = async (req, res) => {
  const playlistId = req.params.id;

  if (!playlistId) {
    return res.status(400).json({ error: "ID de playlist no proporcionado" });
  }

  try {
    await refreshToken();

    const response = await spotifyApi.getPlaylist(playlistId);
    const data = response.body;

    const playlistInfo = {
      id: data.id,
      nombre: data.name,
      descripcion: data.description,
      imagen: data.images?.[0]?.url || null,
      tracks: data.tracks.items
        .filter(item => item && item.track)
        .map(item => ({
          spotifyId: item.track.uri,
          titulo: item.track.name,
          artista: item.track.artists.map((a) => a.name).join(", "),
          imagen: item.track.album.images?.[0]?.url || null,
        })),
    };

    res.json(playlistInfo);
  } catch (error) {
    console.error("Error al obtener la playlist de Spotify:", error?.response?.body || error.message);
    res.status(500).json({ error: "No se pudo obtener la playlist de Spotify." });
  }
};

