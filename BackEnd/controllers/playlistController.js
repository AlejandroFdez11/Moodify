const Playlist = require("../models/Playlist")

exports.createPlaylist = async (req, res) => {
  const { name, creador, songs,imagen,isPublic } = req.body

  try {
    const newPlaylist = new Playlist({ name, creador, songs,imagen, isPublic})
    await newPlaylist.save()
    res.status(201).json(newPlaylist)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find().populate("creador").populate("songs")
    res.json(playlists)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
