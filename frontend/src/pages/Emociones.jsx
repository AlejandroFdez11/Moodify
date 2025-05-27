import EmotionCard from "../components/EmocionCard";

const Emociones = () => {
  const emotions = [
    { name: "Feliz", emoji: "😄" },
    { name: "Triste", emoji: "😢" },
    { name: "Enojado", emoji: "😡" },
    { name: "Enamorado", emoji: "😍" },
    { name: "Relajado", emoji: "😌" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        ¿Cómo te sientes hoy?
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {emotions.map((emotion) => (
          <EmotionCard key={emotion.name} emotion={emotion} />
        ))}
      </div>
    </div>
  );
};

export default Emociones;