const Playlist = require("../models/Playlist");
const Song = require("../models/Song");
const Artista = require("../models/Artista");
const axios = require("axios");
const { getSpotifyToken } = require("../config/spotifyConfig");
const { spotifyApi, refreshToken } = require("../services/spotify");

exports.searchSpotifyPlaylists = async (req, res) => {
  const { query } = req.query;
  try {
    const token = await getSpotifyToken();
    const resp = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'playlist', limit: 10 }
    });
    const playlists = resp.data.playlists.items.map(pl => ({
      id: pl.id,
      nombre: pl.name,
      imagen: pl.images[0]?.url || null,
      descripcion: pl.description || ''
    }));
    res.json(playlists);
  } catch (error) {
    console.error('Error al buscar playlists:', error);
    res.status(400).json({ error: error.message });
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
  try {
    await refreshToken();
    const data = await spotifyApi.getPlaylist(playlistId); // adaptalo según tu código

    const playlistInfo = {
      id: data.body.id,
      nombre: data.body.name,
      descripcion: data.body.description,
      imagen: data.body.images[0]?.url,
      tracks: data.body.tracks.items.map((item) => ({
        titulo: item.track.name,
        artista: item.track.artists.map((a) => a.name).join(", "),
        imagen: item.track.album.images[0]?.url,
      })),
    };

    res.json(playlistInfo);
  } catch (error) {
    console.error("Error al obtener la playlist de Spotify:", error);
    res.status(500).json({ error: "Error al obtener la playlist de Spotify" });
  }
};

