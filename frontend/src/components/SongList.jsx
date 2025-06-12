import { useEffect, useState } from "react";
import axios from "axios";
import Notification from "./Notificacion";

const SongList = ({ songs }) => {
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (showModal) {
      axios
        .get("http://localhost:5000/playlists/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setPlaylists(res.data))
        .catch((err) => console.error("Error al cargar playlists:", err));
    }
  }, [showModal]);

  const handleAddToPlaylist = async (playlistId, song) => {
    if (!song) {
      addNotification("Error: Canción no seleccionada.", "error");
      return;
    }

    try {
      const spotifyId = song.spotifyId.includes(":")
        ? song.spotifyId.split(":")[2]
        : song.spotifyId;

      const payload = {
        songId: spotifyId,
      };

      const response = await axios.post(
        `http://localhost:5000/playlists/${playlistId}/add-song`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      {/* Notificaciones flotantes */}
      <div className="fixed top-4 right-4 space-y-2 z-[999]">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      <ul className="space-y-3">
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <li
              key={index}
              className="flex items-center justify-between text-gray-300 p-2 bg-gray-800 rounded hover:bg-gray-700 relative"
            >
              <div className="flex items-center">
                <img
                  src={song.imagen}
                  alt={song.titulo}
                  className="w-12 h-12 mr-3 rounded"
                />
                {song.titulo} - {song.artista}
              </div>

              {/* Botón de opciones */}
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

      {/* Modal para elegir playlist */}
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
                    onClick={() =>
                      handleAddToPlaylist(playlist._id, selectedSong)
                    }
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