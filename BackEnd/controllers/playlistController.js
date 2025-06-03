const Playlist = require("../models/Playlist");
const Song = require("../models/Song");
const { getSpotifyToken } = require("../config/spotifyConfig");
const axios = require("axios");

exports.createPlaylist = async (req, res) => {
  try {
    const { name, songs, imagen, isPublic, descripcion } = req.body;
    const creador = req.user.id;

    let finalImagePath = imagen;
    if (req.file) {
      finalImagePath = `http://localhost:5000/uploads/playlists/${req.file.filename}`;
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

    // Limpiar el ID si viene en formato URI
    if (songId.startsWith('spotify:track:')) {
      songId = songId.split(':')[2];
    }

    // Validar formato del ID
    if (!songId || typeof songId !== 'string' || songId.length < 10) {
      return res.status(400).json({ error: "Formato de ID inválido" });
    }

    let song = await Song.findOne({ trackId: songId });

    if (!song) {
      try {
        const token = await getSpotifyToken();
        
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const track = response.data;

        // Validar datos esenciales
        if (!track.name || !track.artists) {
          throw new Error("Datos incompletos de Spotify");
        }

        song = new Song({
          titulo: track.name,
          artista: track.artists.map((a) => a.name).join(", "),
          album: track.album.name,
          genero: track.genres?.join(", ") || "Sin definir",
          imagen: track.album.images[0]?.url || "",
          url: track.external_urls.spotify,
          trackId: songId,
          uri: `spotify:track:${songId}`,
          preview_url: track.preview_url,
          duration_ms: track.duration_ms,
          release_date: track.album.release_date,
          popularity: track.popularity,
        });

        await song.save();
      } catch (error) {
        console.error("Error al obtener canción de Spotify:", error.message);
        return res.status(400).json({ 
          error: "No se pudo obtener la canción desde Spotify",
          details: error.message 
        });
      }
    }

    if (playlist.songs.includes(song._id)) {
      return res.status(400).json({ error: "La canción ya está en la playlist" });
    }

    playlist.songs.push(song._id);
    await playlist.save();

    res.json({ 
      message: "Canción añadida correctamente", 
      playlist: {
        ...playlist._doc,
        songs: playlist.songs.length
      }
    });

  } catch (error) {
    console.error("Error general:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      details: error.message 
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
