import React from 'react';

const ArtistCard = ({ artist }) => {
  return (
    <div className="bg-gray-800 hover:bg-gray-700 transition duration-300 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between w-full max-w-xs mx-auto">
      <img
        src={artist.imagen}
        alt={artist.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-white font-bold text-lg truncate">{artist.name}</h3>
          <p className="text-gray-400 text-sm truncate">{artist.genero}</p>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;