import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SongList from "../components/SongList";

const DetallesPlaylistSpotify = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/spotify/playlists/${id}`);
        setPlaylist(res.data);

        // Formatear canciones asegurando que tengan un 'spotifyId'
        const formattedSongs = (res.data.tracks || []).map((song) => ({
          ...song,
          spotifyId: song.spotifyId,
        }));

        console.log(formattedSongs)

        setSongs(formattedSongs);
      } catch (err) {
        console.error("Error al obtener la playlist de Spotify:", err);
      }
    };

    fetchData();
  }, [id]);

  if (!playlist) return <p className="text-white p-4">Cargando...</p>;

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900">
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

      <SongList songs={songs} />
    </div>
  );
};

export default DetallesPlaylistSpotify;