import { useState, useEffect, useRef } from "react";
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
  
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);

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
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      setSearchSuggestions([]);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-900 p-3 sm:p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        {/* Logo y controles móviles */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="text-white text-xl sm:text-2xl font-bold">Moodify</Link>
          
          {/* Botones de menú móvil */}
          <div className="flex md:hidden gap-3 items-center">
            {authenticated ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                    setMobileMenuOpen(false);
                  }}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-300 overflow-hidden relative"
                >
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-green-500 rounded-full animate-spin"></div>
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
                
                {/* Menú de usuario móvil */}
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
            ) : (
              <Link to="/login" className="text-gray-300 hover:text-white px-2 py-1 sm:px-3 sm:py-2 text-sm">
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

        {/* Barra de búsqueda */}
        <div className="w-full md:w-auto md:flex-grow md:max-w-2xl mt-3 md:mt-0 md:px-4 order-last md:order-none">
          <form onSubmit={handleSearch} className="flex items-center bg-gray-800 rounded-md p-1">
            <input
              type="text"
              placeholder="Buscar canciones, artistas..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              className="bg-transparent text-white px-2 py-1 outline-none w-full text-sm sm:text-base"
            />
            <button type="submit" className="text-green-400 px-2 text-lg sm:text-xl">🔍</button>
          </form>
          
          {/* Mostrar sugerencias */}
          {searchSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 md:left-auto md:right-auto bg-gray-800 rounded-b-md shadow-lg z-50 mt-1">
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
                  <div className="font-medium text-white text-sm sm:text-base">{item.title}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{item.artist}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menú de escritorio */}
        <div className="hidden md:flex items-center gap-4">
          {authenticated ? (
            <>
              <Link to="/biblioteca" className="text-gray-300 hover:text-white">📚 Biblioteca</Link>
              <Link to="/emociones" className="text-gray-300 hover:text-white">😄 Emocionómetro</Link>
              <div className="relative" ref={userMenuRef}>
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
          <div 
            ref={mobileMenuRef}
            className="md:hidden w-full bg-gray-800 rounded-md shadow-lg py-2 mt-3"
          >
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
                    to="/login" 
                    className="px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white border-b border-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link 
                    to="/registro" 
                    className="px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;