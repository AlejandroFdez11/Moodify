import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../services/Auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [userImage, setUserImage] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const defaultImage =
    "https://imgs.search.brave.com/gpitD9caAmK6KPyVZsIQkKR2nUHUkAPNRSN-vzKvuEw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/dmVjdG9yLXByZW1p/dW0vaWNvbm8tbWVt/YnJlc2lhLXBsYXRl/YWRvLWljb25vLXBl/cmZpbC1hdmF0YXIt/ZGVmZWN0by1pY29u/by1taWVtYnJvcy1p/bWFnZW4tdXN1YXJp/by1yZWRlcy1zb2Np/YWxlcy1pbHVzdHJh/Y2lvbi12ZWN0b3Jp/YWxfNTYxMTU4LTQx/OTUuanBnP3NlbXQ9/YWlzX2h5YnJpZCZ3/PTc0MA";

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
      console.warn("Error de autenticación:", error);
      
      if (error.response?.status === 401) {
        logout();
        setAuthenticated(false);
        setUserImage(defaultImage);
      } else {
        console.error("Error de red:", error);
      }
    }
  };

  // Obtener sugerencias de búsqueda
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSearchSuggestions([]);
      return;
    }
    
    try {
      const response = await axios.get(
        `https://moodify-wf1j.onrender.com/songs/suggestions?q=${encodeURIComponent(query)}`
      );
      setSearchSuggestions(response.data.slice(0, 5)); // Limitar a 5 sugerencias
    } catch (error) {
      console.error("Error obteniendo sugerencias:", error);
      setSearchSuggestions([]);
    }
  };

  // Ejecuta al montar y en cambios de localStorage
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

  // Escucha eventos personalizados para actualización de imagen
  useEffect(() => {
    const handleImageUpdate = (e) => {
      setUserImage(e.detail || defaultImage);
      setImageLoading(false);
    };

    window.addEventListener("imageUpdated", handleImageUpdate);
    return () => window.removeEventListener("imageUpdated", handleImageUpdate);
  }, []);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUserImage(defaultImage);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/buscador?query=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setSearchSuggestions([]);
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold">Moodify</Link>

        {/* Search bar con sugerencias */}
        <div className="relative flex-grow max-w-2xl w-full md:mx-4">
          <form onSubmit={handleSearch} className="flex items-center bg-gray-800 rounded-md p-1">
            <input
              type="text"
              placeholder="Buscar canciones, artistas..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              className="bg-transparent text-white px-2 py-1 outline-none w-full"
            />
            <button type="submit" className="text-green-400 px-2 text-xl">🔍</button>
          </form>
          
          {/* Mostrar sugerencias */}
          {searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-gray-800 rounded-b-md shadow-lg z-50">
              {searchSuggestions.map((item, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                  onClick={() => {
                    navigate(`/cancion/${item.id}`);
                    setSearchQuery("");
                    setSearchSuggestions([]);
                  }}
                >
                  <div className="font-medium text-white">{item.title}</div>
                  <div className="text-sm text-gray-400">{item.artist}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Auth links */}
        <div className="flex items-center gap-4">
          {authenticated ? (
            <>
              <Link to="/biblioteca" className="text-gray-300 hover:text-white hidden md:inline-block">📚 Biblioteca</Link>
              <Link to="/emociones" className="text-gray-300 hover:text-white hidden md:inline-block">😄 Emocionómetro</Link>
              <button
                onClick={() => navigate("/perfil")}
                className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden relative"
              >
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="w-4 h-4 border-t-2 border-green-500 rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={userImage || defaultImage}
                  alt="Perfil"
                  className={`w-full h-full object-cover ${imageLoading ? 'invisible' : 'visible'}`}
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    if (e.target.src !== defaultImage) {
                      e.target.src = defaultImage;
                    }
                    setImageLoading(false);
                  }}
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