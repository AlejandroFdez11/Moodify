import { Link } from "react-router-dom";

const SongCard = ({ song }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition">
      <img src={song.imagen} alt={song.titulo} className="w-full h-40 object-cover rounded-md" />
      <h3 className="text-white font-semibold mt-2">{song.titulo}</h3>
      <p className="text-gray-400">{song.artista}</p>
      <Link to={`/song/${song._id}`} className="text-blue-500 hover:underline">Ver más</Link>
    </div>
  );
};

export default SongCard;