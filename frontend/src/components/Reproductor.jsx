import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

const Reproductor = () => {
  const location = useLocation();
  const { uri } = location.state || {};
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!uri) return;

    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      const element = iframeRef.current;
      const options = {
        uri: uri,
        width: "100%",
        height: 80,
        theme: "dark",
      };
      IFrameAPI.createController(element, options, (embedController) => {
        // Puedes guardar embedController si necesitas controlar la reproducción
      });
    };

    return () => {
      // Limpia el script y la función global cuando el componente se desmonta
      delete window.onSpotifyIframeApiReady;
    };
  }, [uri]);

  if (!uri) {
    return <p>No se proporcionó información de la canción.</p>;
  }

  return (
    <div className="p-4">
      <div ref={iframeRef}></div>
    </div>
  );
};

export default Reproductor;