import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import SongList from "../components/SongList";
import ArtistCard from "../components/ArtistCard";
import { asArray } from "../utils/normalize";

const Buscador = () => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  useEffect(() => {
    if (!query) return;

    const fetchAll = async () => {
      try {
        const [songsRes, artistsRes] = await Promise.all([
          api.get("/canciones", { params: { q: query } }),
          api.get("/artistas", { params: { q: query } }),
        ]);
        setSongs(asArray(songsRes.data, "data", "songs"));
        setArtists(asArray(artistsRes.data, "data", "artists"));
      } catch (error) {
        console.error("[Buscador]", error.message);
        setSongs([]);
        setArtists([]);
      }
    };

    fetchAll();
  }, [query]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Resultados para: <span className="text-green-400">"{query}"</span>
      </h1>

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

      <h2 className="text-2xl text-white mt-8 mb-2">Canciones</h2>
      {songs.length > 0 ? (
        <SongList songs={songs} />
      ) : (
        <p className="text-gray-400">No se encontraron canciones.</p>
      )}
    </div>
  );
};

export default Buscador;