const Playlist = require("../models/Playlist")
const path = require("path");

exports.createPlaylist = async (req, res) => {
  try {
    const { name, songs, imagen, isPublic, descripcion } = req.body;
    const creador = req.user.id;

    let finalImagePath = imagen;  // Usar la imagen proporcionada en el body si existe

    // Si se ha subido una imagen por formulario, usarla
    if (req.file) {
      // Cambiar las barras invertidas por barras normales
      finalImagePath = `http://localhost:5000/uploads/playlists/${req.file.filename}`;
    }

    if (!name || !finalImagePath) {
      return res.status(400).json({ error: "El nombre y la imagen son obligatorios." });
    }

    const newPlaylist = new Playlist({
      name,
      creador,
      songs,
      imagen: finalImagePath,  // Guardar la URL completa de la imagen
      isPublic,
      descripcion,
    });

    await newPlaylist.save();
    res.status(201).json(newPlaylist);
  } catch (error) {
    console.error("Error al crear playlist:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find().populate("creador").populate("songs")
    res.json(playlists)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.getMyPlaylists = async (req, res) => {
  const userId = req.user.id;

  try {
    const playlists = await Playlist.find({ creador: userId }).populate("songs");
    res.json(playlists);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
