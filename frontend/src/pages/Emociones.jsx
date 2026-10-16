import { useNavigate } from "react-router-dom";

const Emociones = () => {
  const emotions = [
    { name: "Feliz", emoji: "😄", genres: ["pop", "dance", "reggaeton"] },
    { name: "Triste", emoji: "😢", genres: ["blues", "jazz", "soul"] },
    { name: "Enojado", emoji: "😡", genres: ["rock", "metal", "alternative"] },
    { name: "Enamorado", emoji: "😍", genres: ["soul", "rnb", "pop"] },
    { name: "Relajado", emoji: "😌", genres: ["jazz", "clasica", "soul"] },
    { name: "Enérgico", emoji: "⚡", genres: ["electro", "dance", "rap"] },
    { name: "Aventura", emoji: "🏔️", genres: ["latin", "reggaeton", "country"] },
    { name: "Melancólico", emoji: "🌧️", genres: ["alternative", "blues", "clasica"] },
  ];

  const navigate = useNavigate();

  const handleEmotionSelect = (emotion) => {
    navigate(
      `/emociones/${emotion.name.toLowerCase()}?genres=${encodeURIComponent(
        emotion.genres.join(",")
      )}`
    );
  };

  return (
    <div className="p-8 min-h-screen bg-gray-900">
      <h1 className="text-4xl font-extrabold text-white text-center mb-4">
        ¿Cómo te sientes hoy?
      </h1>
      <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
        Elige una emoción y descubre artistas que se alinean con tu estado de
        ánimo. ¡Date una sorpresa!
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-6 max-w-6xl mx-auto">
        {emotions.map((emotion) => (
          <div
            key={emotion.name}
            onClick={() => handleEmotionSelect(emotion)}
            className="cursor-pointer transform hover:scale-105 active:scale-95 transition-transform bg-gray-800 p-4 rounded-2xl flex flex-col items-center justify-center shadow-lg"
          >
            <div className="text-5xl">{emotion.emoji}</div>
            <h2 className="mt-2 text-white font-semibold text-lg">
              {emotion.name}
            </h2>
            <p className="text-gray-400 text-sm text-center mt-1">
              {emotion.genres.join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Emociones;