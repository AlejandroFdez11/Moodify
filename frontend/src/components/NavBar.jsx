import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logout } from "../services/Auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  
  // Imagen por defecto
  const defaultImage = "https://media.istockphoto.com/id/877369086/es/foto/le%C3%B3n-panthera-leo-10-a%C3%B1os-de-edad-aislado-en-blanco.jpg?s=612x612&w=0&k=20&c=DY-jSoHGFJ-_fstEWhOZ5kAufR1zHFjwQdwZjI1vEoI=";

  // Obtener solo la imagen del perfil desde el backend
  const fetchProfileImage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await axios.get("http://localhost:5000/users/getUser", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUserImage(response.data.imagenPerfil || defaultImage);
    } catch (error) {
      console.error("Error obteniendo imagen de perfil:", error);
      setUserImage(defaultImage);
    }
  };

  // Verificar autenticación y obtener imagen
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      setAuthenticated(true);
      
      // Obtener imagen solo si no está en localStorage
      const user = JSON.parse(storedUser);
      if (user.imagenPerfil) {
        setUserImage(user.imagenPerfil);
      } else {
        fetchProfileImage();
      }
    } else {
      setAuthenticated(false);
      setUserImage(defaultImage);
    }
    
    // Escuchar eventos de actualización de imagen
    const handleImageUpdate = () => {
      fetchProfileImage();
    };
    
    window.addEventListener("imageUpdated", handleImageUpdate);
    return () => window.removeEventListener("imageUpdated", handleImageUpdate);
  }, []);

  // Manejar logout
  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUserImage(defaultImage);
    navigate("/login");
  };

  // Buscar canciones
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    navigate(`/buscador?query=${searchQuery}`);
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">Moodify</Link>

        {/* Barra de búsqueda */}
        <form onSubmit={handleSearch} className="flex items-center bg-gray-800 rounded-md p-1 flex-grow mx-4 max-w-2xl">
          <input
            type="text"
            placeholder="Buscar canciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white px-2 py-1 outline-none w-full"
          />
          <button type="submit" className="text-green-500 px-2">🔍</button>
        </form>

        <div className="space-x-4 flex items-center">
          {authenticated ? (
            <>
              <Link to="/biblioteca" className="text-gray-300 hover:text-white hidden md:block">📚 Biblioteca</Link>
              <Link to="/emocion" className="text-gray-300 hover:text-white hidden md:block">😄 Emocionometro</Link>
              
              {/* Imagen de perfil */}
              <button 
                onClick={() => navigate("/perfil")} 
                className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center"
              >
                <img 
                  src={userImage || defaultImage} 
                  alt="Perfil" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.target.src = defaultImage;
                  }}
                />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">Iniciar sesión</Link>
              <Link to="/registro" className="text-gray-300 hover:text-white hidden sm:block">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;