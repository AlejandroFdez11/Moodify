import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const DetallesSong = () => {
  const location = useLocation();
  const { 
    titulo, 
    artista, 
    imagen, 
    url, 
    duration_ms, 
    release_date, 
    popularity 
  } = location.state || {};

  const [curiosidades, setCuriosidades] = useState('');

  // Convertir milisegundos a formato mm:ss
  const convertMillisecondsToTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };


  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen px-6 text-white">
      <div className="bg-gray-950/60 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-800 max-w-xl w-full text-center">
        {/* Imagen de la canción */}
        <img
          src={imagen}
          alt={titulo}
          className="w-48 h-48 object-cover rounded-full mx-auto mb-6 border-4 border-blue-500"
        />

        {/* Título y artista */}
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{titulo}</h1>
        <p className="text-gray-400 text-lg italic mb-8">{artista}</p>

        {/* URL de Spotify */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 text-sm mb-4 hover:underline"
        >
          Escuchar en Spotify
        </a>

        {/* Detalles adicionales */}
        <div className="text-left space-y-4">
          <h3 className="text-xl font-bold text-white">Detalles:</h3>
          <p className="text-gray-300 text-sm">Duración: {convertMillisecondsToTime(duration_ms)}</p>
          <p className="text-gray-300 text-sm">Fecha de lanzamiento: {release_date}</p>
          <p className="text-gray-300 text-sm">Popularidad: {popularity}</p>
        </div>
      </div>
    </div>
  );
};

export default DetallesSong;