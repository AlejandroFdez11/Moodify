// Reproductor.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Reproductor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { uri, titulo, artista } = location.state || {};
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (!uri) {
      // Si no hay URI, redirige al inicio
      navigate('/');
    }
  }, [uri, navigate]);

  const trackId = uri?.split(':').pop();
  const embedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">{titulo}</h1>
      <p className="mb-6 text-gray-400">{artista}</p>
      {!iframeLoaded && <p>Cargando reproductor...</p>}
      <iframe
        src={embedUrl}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="eager"
        allowFullScreen
        onLoad={() => setIframeLoaded(true)}
        className="rounded-lg"
      ></iframe>
    </div>
  );
};

export default Reproductor;