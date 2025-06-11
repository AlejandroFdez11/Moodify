import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import ArtistCard from "../components/ArtistCard";
import SimplePlaylistCard from "../components/SimplePlaylistCard";
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
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!emotionData) return;

    const fetchSpotifyData = async () => {
      setLoading(true);
      setError(null);

      try {
        const genre = emotionData.genres[0];

        // Petición para artistas
        const artistsRes = await axios.get("http://localhost:5000/artistas", {
          params: { genre },
        });

        const fetchedArtists = artistsRes.data;
        setArtists(fetchedArtists);

        if (fetchedArtists.length > 0) {
          const artistId = fetchedArtists[0].id;

          // Álbumes del artista
          const albumsRes = await axios.get(
            `http://localhost:5000/artistas/${artistId}/albums`
          );
          setAlbums(albumsRes.data);

          // Canciones top del artista
          const songsRes = await axios.get(
            `http://localhost:5000/artistas/${artistId}/top-tracks`
          );
          setSongs(songsRes.data);
        } else {
          setAlbums([]);
          setSongs([]);
        }
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
        Emoción seleccionada: {emotionData.name}
      </h1>

      {loading && <p>Cargando datos de Spotify...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Artistas relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artists.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={{
                    name: artist.nombre,
                    imagen: artist.imagen || "https://via.placeholder.com/300",
                    genero: artist.genero || "Desconocido",
                  }}
                />
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Álbumes destacados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {albums.map((album) => (
                <SimplePlaylistCard
                  key={album.id}
                  playlist={{
                    _id: album.id,
                    name: album.nombre,
                    descripcion: album.descripcion || "Álbum de música",
                    imagen: album.imagen || "https://via.placeholder.com/300",
                  }}
                />
              ))}
            </div>
          </section>

          <section>
            <SongList songs={songs} />
          </section>
        </>
      )}
    </div>
  );
};

export default ListadoEmocion;