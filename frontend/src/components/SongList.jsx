import { useState } from "react";
import axios from "axios";

const SongList = ({ songs }) => {
  const [loading, setLoading] = useState(false);

  // Función para manejar el clic en "Añadir a canciones populares"
  const handleAddSong = async (song) => {
    const confirmAdd = window.confirm("¿Quieres añadir esta canción a las canciones populares?");
    if (confirmAdd) {
      setLoading(true);
      try {
        // Hacer la petición al backend para guardar la canción en la base de datos
        await axios.post("http://localhost:5000/songs/", song);
        alert("Canción añadida a las canciones populares.");
      } catch (error) {
        console.error("Error al añadir la canción:", error);
        alert("Hubo un error al añadir la canción.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-white text-xl mb-4">Lista de Canciones</h2>
      <ul className="space-y-3">
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <li key={index} className="flex items-center justify-between text-gray-300 p-2 bg-gray-800 rounded hover:bg-gray-700">
              <div className="flex items-center">
                <img src={song.imagen} alt={song.titulo} className="w-12 h-12 mr-3 rounded" />
                {song.titulo} - {song.artista}
              </div>

              {/* Botón de añadir a canciones populares */}
              <button
                onClick={() => handleAddSong(song)}
                className="ml-4 bg-green-500 text-white rounded-full p-2 hover:bg-green-600"
              >
                +
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-400">No hay canciones disponibles</p>
        )}
      </ul>
    </div>
  );
};

export default SongList;