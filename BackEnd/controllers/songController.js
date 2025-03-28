const Song = require("../models/Song")
const axios = require("axios")
const { getSpotifyToken } = require("../config/spotifyConfig")

exports.addSong = async (req, res) => {
  const { titulo, artista, album, genero, url } = req.body

  try {
    const newSong = new Song({ titulo, artista, album, genero, url })
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
  const { query } = req.query

  try {
    const token = getSpotifyToken()
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: "track", limit: 10 },
    })
    
    //Filtro la información que quiero de cada cancion (sino lo hago me devuelve albunes enteros)
    const songs = response.data.tracks.items.map(track => ({
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(", "),
      album: track.album.name,
      release_date: track.album.release_date,
      preview_url: track.preview_url,  // URL para previsualizar la canción
      spotify_url: track.external_urls.spotify,
      album_image: track.album.images[0].url, // Imagen del álbum
    }))
    res.json(songs)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
