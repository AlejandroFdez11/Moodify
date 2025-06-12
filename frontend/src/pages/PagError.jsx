import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white text-center px-6">
      <h1 className="text-6xl font-bold text-green-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">¡Ups! Página no encontrada</h2>
      <p className="text-gray-400 mb-6 max-w-md">
        Lo sentimos, la página que estás buscando no existe, se ha movido, o fue eliminada. Pero no te preocupes, puedes volver a la música.
      </p>
      <Link
        to="/"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default Error404;