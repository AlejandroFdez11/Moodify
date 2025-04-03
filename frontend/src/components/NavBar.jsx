import { useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated, logout } from "../services/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SongCard from "./SongCard";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    // Redirigir a la página del buscador con la query de búsqueda
    navigate(`/buscador?query=${searchQuery}`);
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">Moodify</Link>

        {/* Barra de búsqueda */}
        <form onSubmit={handleSearch} className="flex items-center bg-gray-800 rounded-md p-1">
          <input
            type="text"
            placeholder="Buscar canciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white px-2 py-1 outline-none"
          />
          <button type="submit" className="text-green-500 px-2">🔍</button>
        </form>

        <div className="space-x-4">
          <Link to="/" className="text-gray-300 hover:text-white">Inicio</Link>
          {isAuthenticated() ? (
            <>
              <Link to="/perfil" className="text-gray-300 hover:text-white">Perfil</Link>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">Iniciar sesión</Link>
              <Link to="/registro" className="text-gray-300 hover:text-white">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;