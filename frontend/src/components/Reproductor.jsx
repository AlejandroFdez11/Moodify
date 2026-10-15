import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Reproductor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Ahora llega: { id, titulo, artista, portada, preview }
  const { id, titulo, artista, portada, preview } = location.state || {};

  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    if (!preview) navigate("/");
  }, [preview, navigate]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.pause(); else a.play();
    setPlaying(!playing);
  };

  const onSeek = (e) => {
    const a = audioRef.current;
    a.currentTime = (e.target.value / 100) * duration;
  };

  if (!preview) return null;

  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6">
      <div className="bg-gray-950/60 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-800 max-w-xl w-full">
        {portada && (
          <img
            src={portada}
            alt={titulo}
            className={`w-56 h-56 mx-auto rounded-2xl shadow-2xl mb-6 transition-transform duration-700 ${playing ? "scale-100" : "scale-95 opacity-80"}`}
          />
        )}
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-center">{titulo}</h1>
        <p className="mb-6 text-center text-gray-400 text-lg italic">{artista}</p>

        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 w-10">{fmt(currentTime)}</span>
          <input
            type="range"
            min="0" max="100" value={progress}
            onChange={onSeek}
            className="flex-1 accent-emerald-500"
          />
          <span className="text-xs text-gray-400 w-10">{fmt(duration)}</span>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={toggle}
            className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition rounded-full w-16 h-16 text-2xl font-bold shadow-lg"
            aria-label={playing ? "Pausar" : "Reproducir"}
          >
            {playing ? "⏸" : "▶"}
          </button>
        </div>

        <a
          href={`https://www.deezer.com/track/${id}`}
          target="_blank" rel="noreferrer"
          className="block text-center mt-6 text-sm text-emerald-400 hover:text-emerald-300"
        >
          Abrir en Deezer →
        </a>

        <audio
          ref={audioRef}
          src={preview}
          onTimeUpdate={() => {
            const a = audioRef.current;
            setCurrentTime(a.currentTime);
            setProgress((a.currentTime / (a.duration || 30)) * 100);
          }}
          onLoadedMetadata={() => setDuration(audioRef.current.duration || 30)}
          onEnded={() => { setPlaying(false); setProgress(0); setCurrentTime(0); }}
        />
      </div>
    </div>
  );
};

export default Reproductor;