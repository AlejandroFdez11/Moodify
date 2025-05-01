const Song = require("../models/Song")
const axios = require("axios")
const { getSpotifyToken } = require("../config/spotifyConfig")

exports.addSong = async (req, res) => {
  const { titulo, artista, album, genero,imagen, url } = req.body

  try {
    const newSong = new Song({ titulo, artista, album, genero,imagen, url })
    await newSong.save()
    res.status(201).json(newSong)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

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
    const token = getSpotifyToken();  // Aquí obtienes el token de Spotify
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
      uri: track.uri
    }));


    // Devolvemos las canciones al cliente
    res.json(songs);
  } catch (error) {
    console.error('Error al buscar canciones:', error);
    res.status(400).json({ error: error.message });
  }
}
