import { useState, useEffect } from "react";
import axios from "axios";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    axios.get("https://moodify-wf1j.onrender.com/playlists")
      .then(res => setPlaylists(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-6">Mis Playlists</h1>
      <div className="mt-4 w-3/4">
        {playlists.length > 0 ? (
          playlists.map((playlist, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded-lg shadow-md mb-4">
              <h2 className="text-xl font-semibold">{playlist.name}</h2>
              <p className="text-gray-400">Creado por: {playlist.creator?.name || "Anónimo"}</p>
              <p className="text-gray-500">{playlist.songs.length} canciones</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 mt-4">No tienes playlists creadas</p>
        )}
      </div>
    </div>
  );
};

export default Playlists;