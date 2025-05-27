import { useParams } from "react-router-dom";

const ListadoEmocion = () => {
  const { emocion } = useParams();

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">
        Emoción seleccionada:
      </h1>
      <div className="text-5xl capitalize">{emocion}</div>
    </div>
  );
};

export default ListadoEmocion;