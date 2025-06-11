import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import ArtistCard from "../components/ArtistCard";
import SongList from "../components/SongList";

const emotionsMap = {
  feliz: { name: "Feliz", genres: ["pop", "dance pop", "happy"] },
  triste: { name: "Triste", genres: ["sad", "acoustic", "piano"] },
  enojado: { name: "Enojado", genres: ["hard rock", "metal", "punk"] },
  enamorado: { name: "Enamorado", genres: ["romantic", "r&b", "soul"] },
  relajado: { name: "Relajado", genres: ["chill", "ambient", "lofi"] },
};

const ListadoEmocion = () => {
  const { emocion } = useParams();
  const emotionData = emotionsMap[emocion];

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    if (!emotionData) return;

    const fetchSpotifyData = async () => {
      setLoading(true);
      setError(null);

      try {
        const genre = emotionData.genres[0];

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

        setSongs(songsPorArtista.flat());
      } catch (err) {
        setError("Error al cargar datos de Spotify");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotifyData();
  }, [emotionData]);

  if (!emotionData) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold">Emoción no encontrada</h1>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Resultados para emoción:{" "}
        <span className="text-green-400">{emotionData.name}</span>
      </h1>

      {loading && <p>Cargando datos de Spotify...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
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
          <SongList songs={songs} />
        </>
      )}
    </div>
  );
};

export default ListadoEmocion;
