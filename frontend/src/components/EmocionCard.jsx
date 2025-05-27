// src/components/EmotionCard.jsx
import { Link } from "react-router-dom";

const EmotionCard = ({ emotion }) => {
  return (
    <Link
      to={`/emocion/${emotion.name.toLowerCase()}`}
      className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition w-full h-64 flex flex-col items-center justify-center"
    >
      <div className="text-6xl mb-4">{emotion.emoji}</div>
      <h3 className="text-white font-semibold text-lg">{emotion.name}</h3>
    </Link>
  );
};

export default EmotionCard;