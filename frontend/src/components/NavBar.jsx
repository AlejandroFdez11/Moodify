import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated, logout } from "../services/Auth";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [authenticated, setAuthenticated] = useState(false); // Estado de autenticación

  // Este useEffect verifica el estado de la autenticación al iniciar el componente
  useEffect(() => {
    const checkAuthStatus = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setAuthenticated(true);
        const user = JSON.parse(storedUser);
        setUserImage(user.profileImage || "https://media.istockphoto.com/id/877369086/es/foto/le%C3%B3n-panthera-leo-10-a%C3%B1os-de-edad-aislado-en-blanco.jpg?s=612x612&w=0&k=20&c=DY-jSoHGFJ-_fstEWhOZ5kAufR1zHFjwQdwZjI1vEoI=");
      } else {
        setAuthenticated(false);
        setUserImage(null);
      }
    };

    // Llamar a checkAuthStatus cuando se monte el componente
    checkAuthStatus();

    // También podemos escuchar cambios en el `localStorage`
    window.addEventListener("storage", checkAuthStatus);

    // Limpiar el listener cuando el componente se desmonte
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  // Función de logout
  const handleLogout = () => {
    logout();
    setAuthenticated(false); // Desactiva la autenticación
    setUserImage(null); // Limpiar la imagen del perfil
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

        <div className="space-x-4 flex items-center">

          {authenticated ? (
            <>
            <Link to="/biblioteca" className="text-gray-300 hover:text-white">📚 Biblioteca</Link>
            <Link to="/emocion" className="text-gray-300 hover:text-white">😄 Emocionometro</Link>
              {/* Círculo con imagen de perfil */}
              <button 
                onClick={() => navigate("/perfil")} 
                className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center"
              >
                <img 
                  src={userImage} 
                  alt="Perfil" 
                  className="w-full h-full object-cover" 
                />
              </button>
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