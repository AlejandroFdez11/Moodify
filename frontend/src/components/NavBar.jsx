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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/buscador?query=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setSearchSuggestions([]);
    setMobileMenuOpen(false);
  };

  // Cerrar menús cuando se hace clic fuera de ellos
  useEffect(() => {
    const closeMenus = () => {
      setMobileMenuOpen(false);
      setUserMenuOpen(false);
      setSearchSuggestions([]);
    };
    
    window.addEventListener("click", closeMenus);
    return () => window.removeEventListener("click", closeMenus);
  }, []);

  return (
    <nav className="bg-gray-900 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Primera fila: Logo y controles móviles */}
        <div className="w-full flex justify-between items-center md:w-auto">
          <Link to="/" className="text-white text-2xl font-bold">Moodify</Link>
          
          {/* Botones de menú móvil */}
          <div className="flex md:hidden gap-3">
            {authenticated ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen(!userMenuOpen);
                  setMobileMenuOpen(false);
                }}
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
            ) : (
              <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2">
                Iniciar sesión
              </Link>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
                setUserMenuOpen(false);
              }}
              className="text-white text-2xl"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Segunda fila: Barra de búsqueda - visible en todas las pantallas */}
        <div className="w-full md:w-auto md:flex-grow md:max-w-2xl">
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
            <div className="absolute top-full left-0 right-0 md:left-auto md:right-auto bg-gray-800 rounded-b-md shadow-lg z-50">
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

        {/* Tercera fila: Menú de escritorio */}
        <div className="hidden md:flex items-center gap-4">
          {authenticated ? (
            <>
              <Link to="/biblioteca" className="text-gray-300 hover:text-white">📚 Biblioteca</Link>
              <Link to="/emociones" className="text-gray-300 hover:text-white">😄 Emocionómetro</Link>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
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
                  />
                </button>
                
                {/* Menú desplegable de usuario en escritorio */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/perfil"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mi perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-600"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">Iniciar sesión</Link>
              <Link to="/registro" className="text-gray-300 hover:text-white">Registrarse</Link>
            </>
          )}
        </div>

        {/* Menú móvil desplegable */}
        {mobileMenuOpen && (
          <div className="md:hidden w-full bg-gray-800 rounded-md shadow-lg py-2 mt-2">
            <div className="flex flex-col">
              {authenticated ? (
                <>
                  <Link 
                    to="/biblioteca" 
                    className="px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white border-b border-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📚 Biblioteca
                  </Link>
                  <Link 
                    to="/emociones" 
                    className="px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white border-b border-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    😄 Emocionómetro
                  </Link>
                  <Link 
                    to="/perfil" 
                    className="px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white border-b border-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mi perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 text-left text-red-400 hover:bg-gray-700 hover:text-red-600"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/registro" 
                    className="px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white border-b border-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Menú de usuario móvil */}
        {userMenuOpen && (
          <div className="md:hidden absolute top-16 right-4 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
            <Link
              to="/perfil"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setUserMenuOpen(false)}
            >
              Mi perfil
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;