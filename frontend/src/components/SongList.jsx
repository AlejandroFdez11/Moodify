import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/Api";
import Notification from "./Notificacion";

const SongList = ({ songs }) => {
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (showModal) {
      api
        .get("/playlists/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setPlaylists(res.data))
        .catch((err) => console.error("Error al cargar playlists:", err));
    }
  }, [showModal, token]);

  const handlePlay = (song) => {
    // Deezer track DTO: { id, titulo, artista, portada, preview, duracion }
    if (!song.preview) {
      addNotification("Esta canción no tiene preview disponible", "error");
      return;
    }
    navigate(`/song/${song.id}`, {
      state: {
        id: song.id,
        titulo: song.titulo,
        artista: song.artista,
        portada: song.portada || song.imagen,
        preview: song.preview,
      },
    });
  };

  const handleAddToPlaylist = async (playlistId, song) => {
    if (!song) {
      addNotification("Error: Canción no seleccionada.", "error");
      return;
    }

    try {
      // Ahora el ID que guardamos es el de Deezer (numérico)
      const payload = { songId: String(song.id) };

      await api.post(`/playlists/${playlistId}/add-song`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      addNotification("Canción añadida correctamente a la playlist", "success");
      setShowModal(false);
      setSelectedSong(null);
    } catch (error) {
      console.error("Error al añadir canción:", error);
      addNotification("Error al añadir la canción a la playlist", "error");
    }
  };

  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-white text-xl mb-4">Lista de Canciones</h2>

      <div className="fixed top-4 right-4 space-y-2 z-[999]">
        {notifications.map((n) => (
          <Notification
            key={n.id}
            message={n.message}
            type={n.type}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>

      <ul className="space-y-3">
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <li
              key={song.id || index}
              className="flex items-center justify-between text-gray-300 p-2 bg-gray-800 rounded hover:bg-gray-700 relative"
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => handlePlay(song)}
                  className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center text-white text-lg flex-shrink-0"
                  title="Reproducir preview"
                >
                  ▶
                </button>
                <img
                  src={song.portada || song.imagen || "/default-cover.png"}
                  alt={song.titulo}
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="truncate font-medium">{song.titulo}</p>
                  <p className="truncate text-sm text-gray-400">{song.artista}</p>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setDropdownIndex(dropdownIndex === index ? null : index)
                  }
                  className="text-white text-xl px-2"
                >
                  ⋮
                </button>

                {dropdownIndex === index && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded shadow-lg z-10">
                    <button
                      className="block w-full px-4 py-2 text-left text-white hover:bg-gray-600"
                      onClick={() => {
                        setSelectedSong(song);
                        setShowModal(true);
                        setDropdownIndex(null);
                      }}
                    >
                      Añadir a Playlist
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-400">No hay canciones disponibles</p>
        )}
      </ul>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl w-96 shadow-2xl">
            <h2 className="text-white text-xl font-semibold mb-4 text-center">
              Selecciona una Playlist
            </h2>
            <ul className="space-y-3 max-h-64 overflow-y-auto">
              {playlists.map((playlist) => (
                <li key={playlist._id} className="flex items-center space-x-3">
                  <img
                    src={playlist.imagen}
                    alt={playlist.name}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <button
                    onClick={() => handleAddToPlaylist(playlist._id, selectedSong)}
                    className="flex-1 text-left bg-gray-700 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
                  >
                    {playlist.name}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="mt-4 block w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition font-semibold"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongList;