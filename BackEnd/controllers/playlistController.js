const Playlist = require("../models/Playlist");
const Song = require("../models/Song");
const axios = require("axios");

const DEEZER_API="https://api.deezer.com";

exports.createPlaylist = async (req, res) => {
  try {
    const { name, songs, imagen, isPublic, descripcion } = req.body;
    const creador = req.user.id;

    let finalImagePath = imagen;
    if (req.file) {
      finalImagePath = `${req.BASE_URL}/uploads/playlists/${req.file.filename}`;
    }

    if (!name || !finalImagePath) {
      return res.status(400).json({ error: "El nombre y la imagen son obligatorios." });
    }

    const newPlaylist = new Playlist({
      name,
      creador,
      songs,
      imagen: finalImagePath,
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
    const playlists = await Playlist.find().populate("creador").populate("songs");
    res.json(playlists);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMyPlaylists = async (req, res) => {
  const userId = req.user.id;

  try {
    const playlists = await Playlist.find({ creador: userId }).populate("songs");
    res.json(playlists);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPlaylistSongs = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId).populate("songs");
    if (!playlist) return res.status(404).json({ error: "Playlist no encontrada" });

    res.json(playlist.songs);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener canciones de la playlist" });
  }
};

exports.getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId);
    if (!playlist) return res.status(404).json({ error: "Playlist no encontrada" });

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la playlist" });
  }
};

exports.addSongToPlaylist = async (req, res) => {
  try {
    let { songId } = req.body;
    const playlist = req.playlist;

    if (typeof songId === "string" && songId.includes(":")) {
      songId = songId.split(":").pop();
    }

    if (!songId) {
      return res.status(400).json({ error: "Falta el ID de la canción" });
    }

    let song = await Song.findOne({ trackId: String(songId) });

    if (!song) {
      try {
        const { data: track } = await axios.get(`${DEEZER_API}/track/${songId}`);

        if (track.error || !track.title) {
          return res.status(400).json({ error: "Canción no encontrada en Deezer" });
        }

        song = new Song({
          titulo: track.title,
          artista: track.artist?.name || "Desconocido",
          album: track.album?.title || "",
          genero: "Sin definir",
          imagen: track.album?.cover_medium || track.album?.cover || "",
          url: track.link || `https://www.deezer.com/track/${track.id}`,
          trackId: String(track.id),
          uri: `deezer:track:${track.id}`,
          preview_url: track.preview || null,
          duration_ms: (track.duration || 0) * 1000,
          release_date: null,
          popularity: track.rank || 0,
        });

        await song.save();
      } catch (error) {
        console.error("Error al obtener canción de Deezer:", error.message);
        return res.status(400).json({
          error: "No se pudo obtener la canción desde Deezer",
          details: error.message,
        });
      }
    }

    const yaExiste = playlist.songs.some(
      (id) => id.toString() === song._id.toString()
    );
    if (yaExiste) {
      return res.status(400).json({ error: "La canción ya está en la playlist" });
    }

    playlist.songs.push(song._id);
    await playlist.save();

    res.json({
      message: "Canción añadida correctamente",
      playlist: {
        ...playlist._doc,
        songs: playlist.songs.length,
      },
    });
  } catch (error) {
    console.error("Error general:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    });
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const userId = req.user.id;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist no encontrada" });
    }

    if (playlist.creador.toString() !== userId) {
      return res.status(403).json({ error: "No tienes permiso para eliminar esta playlist" });
    }

    await Playlist.findByIdAndDelete(playlistId);

    res.json({ message: "Playlist eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la playlist:", error);
    res.status(500).json({ error: "Error interno al eliminar la playlist" });
  }
};

// Eliminar una canción específica de una playlist
exports.removeSongFromPlaylist = async (req, res) => {
  const { playlistId, songId } = req.params;

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ error: "Playlist no encontrada" });

    playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
    await playlist.save();

    res.status(200).json({ message: "Canción eliminada de la playlist" });
  } catch (error) {
    console.error("Error al eliminar canción:", error);
    res.status(500).json({ error: "Error al eliminar canción de la playlist" });
  }
};
