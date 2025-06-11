import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import ArtistCard from "../components/ArtistCard";
import SongList from "../components/SongList";

const ListadoEmocion = () => {
  const { emocion } = useParams();
  const [searchParams] = useSearchParams();
  const genre = searchParams.get("genre");

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    if (!genre) return;

    const fetchSpotifyData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Obtener artistas filtrados por género
        const artistsRes = await axios.get("http://localhost:5000/artistas", {
          params: { genre },
        });

        const fetchedArtists = artistsRes.data.map((a) => ({
          id: a.id,
          name: a.nombre,
          imagen: a.imagen,
          genero: a.genre || "Desconocido",
        }));

        setArtists(fetchedArtists);

        // 2. Obtener canciones por artista
        const songsPorArtista = await Promise.all(
          fetchedArtists.map(async (artist) => {
            const res = await axios.get(
              `http://localhost:5000/songs/songsArtist/${artist.id}`,
              { params: { limit: 5 } }
            );
            return res.data;
          })
        );

        setSongs(songsPorArtista.flat());
      } catch (err) {
        setError("Error al cargar datos de Spotify");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotifyData();
  }, [genre]);

  if (!genre) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">Género no especificado</h1>
        <p className="text-gray-400">No se encontró ningún género en la URL.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900">
      <h1 className="text-3xl font-bold mb-6">
        Resultados para emoción:{" "}
        <span className="text-green-400 capitalize">{emocion}</span>
      </h1>

      {loading && <p className="text-gray-400">Cargando datos de Spotify...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {/* ARTISTAS */}
          {artists.length > 0 ? (
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
          ) : (
            <p className="text-gray-400 mb-6">No se encontraron artistas para este género.</p>
          )}

          {/* CANCIONES */}
          {songs.length > 0 ? (
            <SongList songs={songs} />
          ) : (
            <p className="text-gray-400 mt-6">No se encontraron canciones.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ListadoEmocion;