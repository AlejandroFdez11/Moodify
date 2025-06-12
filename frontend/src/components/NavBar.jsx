import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../services/Auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const defaultImage =
    "https://media.istockphoto.com/id/877369086/es/foto/le%C3%B3n-panthera-leo-10-a%C3%B1os-de-edad-aislado-en-blanco.jpg?s=612x612&w=0&k=20&c=DY-jSoHGFJ-_fstEWhOZ5kAufR1zHFjwQdwZjI1vEoI=";

  // Verifica el token y obtiene la imagen
  const checkAuthentication = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthenticated(false);
      setUserImage(defaultImage);
      return;
    }

    try {
      const response = await axios.get("https://moodify-wf1j.onrender.com/users/getUser", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAuthenticated(true);
      setUserImage(response.data.imagenPerfil || defaultImage);
    } catch (error) {
      console.warn("Token inválido o expirado:", error);
      logout();
      setAuthenticated(false);
      setUserImage(defaultImage);
    }
  };

  // Ejecuta al montar y en cambios de localStorage desde otras pestañas
  useEffect(() => {
    checkAuthentication();

    const handleStorageChange = (e) => {
      if (e.key === "token") {
        checkAuthentication();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Escucha eventos personalizados (por ejemplo: imagen actualizada)
  useEffect(() => {
    const handleImageUpdate = () => checkAuthentication();
    window.addEventListener("imageUpdated", handleImageUpdate);
    return () => window.removeEventListener("imageUpdated", handleImageUpdate);
  }, []);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUserImage(defaultImage);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/buscador?query=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold">Moodify</Link>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-gray-800 rounded-md p-1 flex-grow max-w-2xl w-full md:mx-4"
        >
          <input
            type="text"
            placeholder="Buscar canciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white px-2 py-1 outline-none w-full"
          />
          <button type="submit" className="text-green-400 px-2 text-xl">🔍</button>
        </form>

        {/* Auth links */}
        <div className="flex items-center gap-4">
          {authenticated ? (
            <>
              <Link to="/biblioteca" className="text-gray-300 hover:text-white hidden md:inline-block">📚 Biblioteca</Link>
              <Link to="/emociones" className="text-gray-300 hover:text-white hidden md:inline-block">😄 Emocionómetro</Link>
              <button
                onClick={() => navigate("/perfil")}
                className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden"
              >
                <img
                  src={userImage || defaultImage}
                  alt="Perfil"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = defaultImage)}
                />
              </button>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-600 transition hidden md:inline-block"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">Iniciar sesión</Link>
              <Link to="/registro" className="text-gray-300 hover:text-white hidden sm:inline-block">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;