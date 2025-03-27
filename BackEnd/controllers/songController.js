const Song = require("../models/Song")
const axios = require("axios")
const { getSpotifyToken } = require("../config/spotifyConfig")

exports.addSong = async (req, res) => {
  const { title, artist, album, genre, url } = req.body

  try {
    const newSong = new Song({ title, artist, album, genre, url })
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
    res.json(response.data.tracks.items)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
