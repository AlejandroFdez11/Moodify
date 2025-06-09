import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DetallesPlaylistSpotify = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/spotify/playlists/${id}`);
        setPlaylist(res.data);
        setSongs(res.data.tracks || []);
      } catch (err) {
        console.error("Error al obtener la playlist de Spotify:", err);
      }
    };
    fetchData();
  }, [id]);

  if (!playlist) return <p className="text-white p-4">Cargando...</p>;

  return (
    <div className="p-6 text-white">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={playlist.imagen}
          alt={playlist.nombre}
          className="w-24 h-24 rounded object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold">{playlist.nombre}</h1>
          <p className="text-gray-400">{playlist.descripcion}</p>
        </div>
      </div>

      <div className="space-y-4">
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div key={index} className="flex gap-4 items-center bg-gray-700 p-3 rounded">
              <img
                src={song.imagen}
                alt={song.titulo}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{song.titulo}</p>
                <p className="text-gray-400 text-sm">{song.artista}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No hay canciones en esta playlist.</p>
        )}
      </div>
    </div>
  );
};

export default DetallesPlaylistSpotify;