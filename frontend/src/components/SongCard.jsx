import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const SongCard = ({ song }) => {
  return (
    <div className="bg-gray-800 hover:bg-gray-700 transition duration-300 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between w-full max-w-xs mx-auto">
      <img
        src={song.imagen}
        alt={song.titulo}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-white font-bold text-lg truncate">{song.titulo}</h3>
          <p className="text-gray-400 text-sm truncate">{song.artista}</p>
        </div>

        <div className="flex justify-between items-center mt-4">
          {/* Enlace a DetallesSong */}
          <Link
            to={`/detalles/${song._id}`}
            state={{
              uri: song.uri,
              titulo: song.titulo,
              artista: song.artista,
              imagen: song.imagen,
              url: song.url,                  
              duration_ms: song.duration_ms,  
              release_date: song.release_date, 
              popularity: song.popularity,     
            }}
            className="text-blue-400 text-sm hover:underline"
          >
            Ver detalles
          </Link>

          {/* Enlace a Reproductor con la ruta adecuada */}
          <Link
            to={`/song/${song._id}`} // Usamos la ruta /song/:id
            state={{ uri: song.uri, titulo: song.titulo, artista: song.artista }}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition"
            title="Reproducir"
          >
            <Play className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SongCard;