import { Link } from "react-router-dom";

const PlaylistCard = ({ playlist }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition w-full h-80 flex flex-col">
      <img
        src={playlist.imagen}
        alt={playlist.name}
        className="w-full h-56 object-cover rounded-md"
      />
      <h3 className="text-white font-semibold mt-2 text-sm truncate">{playlist.name}</h3>
      <p className="text-gray-400 text-xs truncate">{playlist.descripcion || "Sin descripción"}</p>
      <Link
        to={`/playlist/${playlist._id}`}
        className="text-green-400 hover:underline text-sm mt-auto"
      >
        Ver más
      </Link>
    </div>
  );
};

export default PlaylistCard;