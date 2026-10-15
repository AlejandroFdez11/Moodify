import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/Api";
import ArtistCard from "../components/ArtistCard";
import SongList from "../components/SongList";

const ListadoEmocion = () => {
  const { emocion } = useParams();
  const [searchParams] = useSearchParams();

  // Acepta ?genres=pop,dance (nuevo) o ?genre=pop (compatibilidad)
  const genresParam =
    searchParams.get("genres") || searchParams.get("genre") || "";

  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!genresParam) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1) Artistas por género (Deezer)
        const { data: artistas } = await api.get("/artistas", {
          params: { genres: genresParam },
        });

        const normalized = artistas.map((a) => ({
          id: a.id,
          name: a.nombre,
          imagen: a.imagen,
          genero: "Deezer",
        }));
        setArtists(normalized);

        // 2) Top tracks de los 6 primeros artistas (paralelo + tolerante a fallos)
        const top6 = normalized.slice(0, 6);
        const results = await Promise.allSettled(
          top6.map((a) => api.get(`/artistas/${a.id}/top`))
        );

        const allSongs = results
          .filter((r) => r.status === "fulfilled")
          .flatMap((r) => r.value.data);

        // Dedup por id de canción
        const unicos = [...new Map(allSongs.map((t) => [t.id, t])).values()];
        setSongs(unicos);
      } catch (err) {
        console.error(err);
        setError("Error al cargar datos de Deezer");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [genresParam]);

  if (!genresParam) {
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

      {loading && <p className="text-gray-400">Cargando datos de Deezer...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
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
            <p className="text-gray-400 mb-6">
              No se encontraron artistas para este género.
            </p>
          )}

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