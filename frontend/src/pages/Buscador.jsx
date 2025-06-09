import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SongList from "../components/SongList";
import ArtistCard from "../components/ArtistCard";
import SimplePlaylistCard from "../components/SimplePlaylistCard";

const Buscador = () => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [songsRes, artistsRes, playlistsRes] = await Promise.all([
          axios.get("http://localhost:5000/spotify/songs", {
            params: { query },
          }),
          axios.get("http://localhost:5000/spotify/artists", {
            params: { query },
          }),
          axios.get("http://localhost:5000/spotify/playlists", {
            params: { query },
          }),
        ]);
        setSongs(songsRes.data);
        setArtists(artistsRes.data);
        setPlaylists(playlistsRes.data);
      } catch (error) {
        console.error("Error al buscar:", error);
      }
    };

    if (query) fetchAll();
  }, [query]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Resultados para: <span className="text-green-400">"{query}"</span>
      </h1>

      {/* ARTISTAS */}
      {artists.length > 0 && (
        <>
          <h2 className="text-2xl text-white mb-2">Artistas</h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {artists.map((artist) => (
              <div key={artist.id} className="flex-shrink-0 w-48">
                <ArtistCard artist={artist} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* CANCIONES */}
      <h2 className="text-2xl text-white mt-8 mb-2">Canciones</h2>
      {songs.length > 0 ? (
        <SongList songs={songs} />
      ) : (
        <p className="text-gray-400">No se encontraron canciones.</p>
      )}

      {/* PLAYLISTS */}
      {/* PLAYLISTS */}
      {playlists.length > 0 && (
        <>
          <h2 className="text-2xl text-white mt-8 mb-2">Playlists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map((pl) => (
              <SimplePlaylistCard
                key={pl.id}
                playlist={{
                  _id: pl.id,
                  name: pl.nombre,
                  imagen: pl.imagen,
                  descripcion: pl.descripcion,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Buscador;
