const Playlist = require("../models/Playlist");

const PlaylistVerifyOwner = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId);

    if (!playlist) {
      return res.status(404).json({ error: "Playlist no encontrada" });
    }

    if (playlist.creador.toString() !== req.user.id) {
      return res.status(403).json({ error: "No tienes permisos sobre esta playlist" });
    }

    req.playlist = playlist;
    next();
  } catch (error) {
    res.status(400).json({ error: "ID de playlist no válido" });
  }
};

module.exports = PlaylistVerifyOwner;