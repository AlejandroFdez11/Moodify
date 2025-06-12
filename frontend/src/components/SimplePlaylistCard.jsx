import React from "react";
import { Link } from "react-router-dom";

const SimplePlaylistCard = ({ playlist }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-5 rounded-xl shadow-lg flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-2xl duration-300">
      {playlist.imagen ? (
        <img
          src={playlist.imagen}
          alt={playlist.name}
          className="w-48 h-48 object-cover rounded-lg mb-5 border-2 border-green-400"
          loading="lazy"
        />
      ) : (
        <div className="w-48 h-48 bg-gray-700 rounded-lg mb-5 flex items-center justify-center text-gray-500">
          Sin imagen
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-3 truncate max-w-xs">{playlist.name}</h3>
      <p className="text-gray-300 mb-6 px-2 line-clamp-3">
        {playlist.descripcion || "No hay descripción disponible."}
      </p>
      <Link
        to={`/spotify/playlist/${playlist._id}`}
        className="inline-block px-6 py-2 bg-green-500 text-white rounded-full font-semibold shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
      >
        Ver más
      </Link>
    </div>
  );
};

export default SimplePlaylistCard;