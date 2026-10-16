import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

const PlayerContext = createContext(null);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer debe usarse dentro de <PlayerProvider>");
  return ctx;
};

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);

  const [currentTrack, setCurrentTrack] = useState(null); // { id, titulo, artista, portada, preview }
  const [queue, setQueue] = useState([]);                 // array de tracks
  const [queueIndex, setQueueIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);            // 0-100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [volume, setVolume] = useState(1);

  // Cuando cambia currentTrack → reproducir automáticamente
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;
    audioRef.current.load();
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [currentTrack]);

  // Sincronizar volumen
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Reproduce una canción y opcionalmente define/usa una cola
  const play = useCallback((track, newQueue = null) => {
    if (newQueue && Array.isArray(newQueue)) {
      setQueue(newQueue);
      const idx = newQueue.findIndex((t) => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    }
    setCurrentTrack(track);
  }, []);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a || !currentTrack) return;
    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
    } else {
      a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [isPlaying, currentTrack]);

  const playIndex = useCallback((index) => {
    if (index < 0 || index >= queue.length) return;
    setQueueIndex(index);
    setCurrentTrack(queue[index]);
  }, [queue]);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    playIndex((queueIndex + 1) % queue.length);
  }, [queueIndex, queue, playIndex]);

  const prev = useCallback(() => {
    if (queue.length === 0) return;
    playIndex((queueIndex - 1 + queue.length) % queue.length);
  }, [queueIndex, queue, playIndex]);

  const seek = useCallback((percent) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    a.currentTime = (percent / 100) * duration;
  }, [duration]);

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (a) a.pause();
    setCurrentTrack(null);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, []);

  const value = {
    currentTrack, queue, queueIndex, isPlaying,
    progress, currentTime, duration, volume,
    play, togglePlay, next, prev, seek, stop, setVolume,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {/* Audio global — vive aquí y no se desmonta nunca */}
      <audio
        ref={audioRef}
        src={currentTrack?.preview || ""}
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (!a) return;
          setCurrentTime(a.currentTime);
          setProgress((a.currentTime / (a.duration || 30)) * 100);
        }}
        onLoadedMetadata={() => {
          const a = audioRef.current;
          if (a) setDuration(a.duration || 30);
        }}
        onEnded={() => {
          if (queue.length > 1) next();
          else { setIsPlaying(false); setProgress(0); setCurrentTime(0); }
        }}
      />
    </PlayerContext.Provider>
  );
};