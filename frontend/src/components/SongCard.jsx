import { Link } from "react-router-dom";

const SongCard = ({ song }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition w-full h-80 flex flex-col">
      <img
        src={song.imagen}
        alt={song.titulo}
        className="w-full h-56 object-cover rounded-md"
      />
      <h3 className="text-white font-semibold mt-2 text-sm truncate">{song.titulo}</h3>
      <p className="text-gray-400 text-xs truncate">{song.artista}</p>
      <Link
        to={`/song/${song._id}`}
        state={{ uri: song.uri, titulo: song.titulo, artista: song.artista }}
        className="text-blue-500 hover:underline text-sm mt-auto"
      >
        Ver más
      </Link>
    </div>
  );
};

export default SongCard;