import { useNavigate } from "react-router-dom";
import EmotionCard from "../components/EmocionCard";

const Emociones = () => {
  const emotions = [
    { name: "Feliz", emoji: "😄", genres: ["pop", "dance pop", "happy"] },
    { name: "Triste", emoji: "😢", genres: ["sad", "acoustic", "piano"] },
    { name: "Enojado", emoji: "😡", genres: ["hard rock", "metal", "punk"] },
    { name: "Enamorado", emoji: "😍", genres: ["romantic", "r&b", "soul"] },
    { name: "Relajado", emoji: "😌", genres: ["chill", "ambient", "lofi"] },
  ];

  const navigate = useNavigate();

  const handleEmotionSelect = (emotion) => {
    navigate(`/emociones/${emotion.name.toLowerCase()}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        ¿Cómo te sientes hoy?
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-8">
        {emotions.map((emotion) => (
          <div
            key={emotion.name}
            onClick={() => handleEmotionSelect(emotion)}
            className="cursor-pointer transition transform hover:scale-105"
          >
            <EmotionCard emotion={emotion} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Emociones;