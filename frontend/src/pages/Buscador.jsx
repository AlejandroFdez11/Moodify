import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SongList from "../components/SongList";

const Buscador = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  
  // Obtener la consulta de búsqueda desde la URL
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // Buscar canciones en Spotify usando el query
        const { data } = await axios.get(`http://localhost:5000/songs/search`, {
          params: { query },
        });
        setResults(data); // Actualizar los resultados
      } catch (error) {
        console.error("Error al buscar canciones:", error);
      }
    };

    if (query) fetchSongs();
  }, [query]); // Se ejecuta cuando el query cambia

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-4">Resultados de búsqueda</h1>
      
      {/* Mostrar resultados de la búsqueda */}
      {results.length > 0 ? (
        <SongList songs={results} />
      ) : (
        <p className="text-gray-400">No se encontraron canciones para "{query}"</p>
      )}
    </div>
  );
};

export default Buscador;