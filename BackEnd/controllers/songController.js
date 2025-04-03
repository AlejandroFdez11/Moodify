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
    titulo: track.name, // Nombre de la canción
    artista: track.artists.map((artist) => artist.name).join(', '), // Artista(s)
    album: track.album.name,  // Nombre del álbum
    genero: "Sin definir", // Spotify no proporciona el género de la canción en esta consulta
    imagen: track.album.images[0]?.url || "https://images.wondershare.com/repairit/aticle/2021/07/resolve-images-not-showing-problem-1.jpg", // Imagen del álbum (con una imagen por defecto si no existe)
    url: track.external_urls.spotify, // URL para escuchar en Spotify
  }));


    // Devolvemos las canciones al cliente
    res.json(songs);
  } catch (error) {
    console.error('Error al buscar canciones:', error);
    res.status(400).json({ error: error.message });
  }
}
