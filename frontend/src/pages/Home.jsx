import React, { useState, useEffect } from "react";
import axios from "axios";
import ArtistCard from "../components/ArtistCard";
import PlaylistCard from "../components/PlayListCard";

const Home = () => {
  const [user, setUser] = useState(null);
  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [featuredArtist, setFeaturedArtist] = useState(null);
  const [loading, setLoading] = useState({
    user: true,
    artists: true,
    playlists: true,
    featured: true,
  });

  // Cargar usuario
  useEffect(() => {
    axios
      .get("https://moodify-wf1j.onrender.com/users/getUser", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading((l) => ({ ...l, user: false })));
  }, []);

  // Cargar artistas populares por género (reggaeton)
  useEffect(() => {
    axios
      .get("https://moodify-wf1j.onrender.com/artistas?genre=reggaeton")
      .then((res) => {
        setArtists(res.data);
        if (res.data.length > 0) {
          const randomArtist = res.data[Math.floor(Math.random() * res.data.length)];
          setFeaturedArtist(randomArtist);
        }
      })
      .catch(() => setArtists([]))
      .finally(() => setLoading((l) => ({ ...l, artists: false, featured: false })));
  }, []);

  // Cargar playlists recientes
  useEffect(() => {
    axios
      .get("https://moodify-wf1j.onrender.com/playlists")
      .then((res) => setPlaylists(res.data))
      .catch(() => setPlaylists([]))
      .finally(() => setLoading((l) => ({ ...l, playlists: false })));
  }, []);

  return (
    <div className="p-8 bg-gray-900 min-h-screen font-sans">
      {/* Saludo */}
      <header className="mb-10 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-white mb-2">
          {loading.user
            ? "Cargando..."
            : user
            ? `¡Hola, ${user.name}!`
            : "Bienvenido a Moodify"}
        </h1>
        <p className="text-gray-400">
          Explora tus artistas favoritos y descubre nuevas playlists.
        </p>
      </header>

      {/* Artista destacado mejorado */}
      {featuredArtist && (
        <section className="mb-16 max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-xl relative">
          <img
            src={featuredArtist.imagen || "/default-artist.png"}
            alt={featuredArtist.name || featuredArtist.nombre}
            className="w-full h-[450px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
          <div className="absolute inset-0 flex flex-col justify-end items-center text-center p-8 md:p-16">
            <h2 className="text-4xl font-black text-white drop-shadow-lg">
              Artista de la Semana
            </h2>
            <h3 className="text-6xl font-extrabold mt-2 text-white drop-shadow-xl">
              {featuredArtist.name || featuredArtist.nombre}
            </h3>
            <p className="mt-4 text-gray-300 italic max-w-3xl drop-shadow-md">
              {featuredArtist.bio || "Un talento increíble que no te puedes perder."}
            </p>
          </div>
        </section>
      )}

      {/* Artistas Populares */}
      <section className="mb-14 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-white mb-6 border-b border-gray-700 pb-2">
          Artistas Populares
        </h2>
        {loading.artists ? (
          <p className="text-gray-400">Cargando artistas...</p>
        ) : artists.length === 0 ? (
          <p className="text-gray-400">No hay artistas disponibles</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {artists.map((artist) => (
              <ArtistCard key={artist._id} artist={artist} />
            ))}
          </div>
        )}
      </section>

      {/* Playlists Recientes */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-white mb-6 border-b border-gray-700 pb-2">
          Playlists Recientes
        </h2>
        {loading.playlists ? (
          <p className="text-gray-400">Cargando playlists...</p>
        ) : playlists.length === 0 ? (
          <p className="text-gray-400">No hay playlists disponibles</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;