import { useEffect, useState } from "react";
import { useParams, useNavigate,Link} from "react-router-dom";
import axios from "axios";
import { FaTrash, FaPlay } from "react-icons/fa";
import Notification from "../components/Notificacion";

const DetallesPlaylist = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playlistRes = await axios.get(
          `https://moodify-wf1j.onrender.com/playlists/${playlistId}`
        );
        const songsRes = await axios.get(
          `https://moodify-wf1j.onrender.com/playlists/${playlistId}/songs`
        );
        setPlaylist(playlistRes.data);
        setSongs(songsRes.data);
      } catch (err) {
        console.error("Error al cargar la playlist:", err);
      }
    };
    fetchData();
  }, [playlistId]);

  const confirmDelete = () => {
    setNotification({
      message: "¿Estás seguro de que deseas eliminar esta playlist?",
      type: "confirm",
      onConfirm: handleDelete,
      onCancel: () => setNotification(null),
    });
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://moodify-wf1j.onrender.com/playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotification({
        message: "Playlist eliminada correctamente",
        type: "success"
      });
      setTimeout(() => {
        navigate(-1)
      }, 2000);
    } catch (error) {
      console.error("Error al eliminar la playlist:", error);
      setNotification({
        message: "No se pudo eliminar la playlist",
        type: "error",
      });
    }
  };

  const handleRemoveSong = async (songId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(
      `https://moodify-wf1j.onrender.com/playlists/${playlistId}/song/${songId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setNotification({
        message: "Canción eliminada correctamente",
        type: "success"
      });

    // Actualiza la lista sin recargar
    setSongs((prevSongs) => prevSongs.filter((s) => s._id !== songId));
  } catch (error) {
    console.error("Error al eliminar la canción:", error);
    setNotification({
      message: "No se puede eliminar la cación de la playlists",
      type: "error"
    })
  }
};


  if (!playlist) return <p className="text-white p-4">Cargando...</p>;

  return (
    <div className="p-6">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
          onConfirm={notification.onConfirm}
          onCancel={notification.onCancel}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src={playlist.imagen || "https://via.placeholder.com/150"}
            alt={playlist.name}
            className="w-24 h-24 object-cover rounded-md"
          />
          <div>
            <h1 className="text-3xl font-bold text-white">{playlist.name}</h1>
            <p className="text-gray-400 text-sm">
              {playlist.descripcion || "Sin descripción"}
            </p>
          </div>
        </div>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          onClick={confirmDelete}
        >
          Eliminar Playlist
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        {songs.length > 0 ? (
          songs.map((song) => (
            <div
              key={song._id}
              className="flex items-center justify-between bg-gray-700 p-3 rounded mb-2 hover:bg-gray-600"
            >
              <div className="flex items-center gap-4">
                <img
                  src={song.imagen}
                  alt={song.titulo}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="text-white font-semibold">{song.titulo}</p>
                  <p className="text-gray-400 text-sm">{song.artista}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to={`/song/${song._id}`}
                  state={{
                    uri: song.uri,
                    titulo: song.titulo,
                    artista: song.artista,
                  }}
                  className="text-green-400 hover:text-green-300"
                  title="Reproducir"
                >
                  <FaPlay />
                </Link>
                <button
                  className="text-red-500 hover:text-red-400"
                  title="Eliminar de playlist"
                  onClick={() => handleRemoveSong(song._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Esta playlist no tiene canciones aún.</p>
        )}
      </div>
    </div>
  );
};

export default DetallesPlaylist;
