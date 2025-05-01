import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Reproductor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { uri, titulo, artista } = location.state || {};
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (!uri) {
      navigate('/');
    }
  }, [uri, navigate]);

  const trackId = uri?.split(':').pop();
  const embedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6">
      <div className="bg-gray-950/60 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-800 max-w-xl w-full transition-all duration-500">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-center tracking-tight text-white">
          {titulo}
        </h1>
        <p className="mb-6 text-center text-gray-400 text-lg italic">{artista}</p>
        <div className="relative w-full">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg z-10">
              <p className="animate-pulse text-sm text-gray-300">Cargando reproductor...</p>
            </div>
          )}
          <iframe
            src={embedUrl}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="eager"
            allowFullScreen
            onLoad={() => setIframeLoaded(true)}
            className="rounded-lg transition-all duration-500 shadow-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Reproductor;