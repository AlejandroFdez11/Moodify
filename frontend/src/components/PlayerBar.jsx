import { usePlayer } from "../context/PlayerContext";

const fmt = (s) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = String(Math.floor(s % 60)).padStart(2, "0");
  return `${m}:${sec}`;
};

const PlayerBar = () => {
  const {
    currentTrack, isPlaying, progress, currentTime, duration, volume,
    togglePlay, next, prev, seek, stop, setVolume,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-md border-t border-gray-800 text-white px-4 py-3 z-[999]">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Info canción */}
        <div className="flex items-center gap-3 w-64 min-w-0">
          {currentTrack.portada && (
            <img
              src={currentTrack.portada}
              alt={currentTrack.titulo}
              className={`w-12 h-12 rounded object-cover flex-shrink-0 transition-transform ${isPlaying ? "scale-100" : "scale-95 opacity-80"}`}
            />
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-sm">{currentTrack.titulo}</p>
            <p className="truncate text-xs text-gray-400">{currentTrack.artista}</p>
          </div>
        </div>

        {/* Controles + progreso */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              className="text-gray-300 hover:text-white text-lg"
              title="Anterior"
            >
              ⏮
            </button>
            <button
              onClick={togglePlay}
              className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition rounded-full w-10 h-10 text-white text-lg shadow"
              title={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button
              onClick={next}
              className="text-gray-300 hover:text-white text-lg"
              title="Siguiente"
            >
              ⏭
            </button>
          </div>

          <div className="flex items-center gap-2 w-full max-w-xl">
            <span className="text-[10px] text-gray-400 w-9 text-right">{fmt(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              className="flex-1 accent-emerald-500 h-1"
            />
            <span className="text-[10px] text-gray-400 w-9">{fmt(duration)}</span>
          </div>
        </div>

        {/* Volumen + cerrar */}
        <div className="hidden md:flex items-center gap-3 w-48 justify-end">
          <span className="text-xs text-gray-400">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-emerald-500"
          />
          <button
            onClick={stop}
            className="text-gray-400 hover:text-red-400 text-sm ml-2"
            title="Cerrar reproductor"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;