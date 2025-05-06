import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { logout } from "../services/Auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PlaylistCard from "../components/PlayListCard";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const datosUser = localStorage.getItem("user");
    if (datosUser) {
      try {
        const parsedUser = JSON.parse(datosUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error al parsear el usuario:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem("token"); // Obtener token del localStorage
        
        const res = await axios.get("http://localhost:5000/playlists/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setPlaylists(res.data);
      } catch (error) {
        console.error("Error al cargar playlists:", error);
        if (error.response?.status === 401) {
          logout(); // Cerrar sesión si el token es inválido
          navigate("/login");
        }
      }
    };
  
    if (user) fetchPlaylists();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <ClipLoader color="#ffffff" loading={true} size={60} />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      {/* Header del perfil */}
      <div className="flex flex-col items-center text-center mb-10">
        <img
          src={
            user.profileImage ||
            "https://media.istockphoto.com/id/877369086/es/foto/le%C3%B3n-panthera-leo-10-a%C3%B1os-de-edad-aislado-en-blanco.jpg?s=612x612&w=0&k=20&c=DY-jSoHGFJ-_fstEWhOZ5kAufR1zHFjwQdwZjI1vEoI="
          }
          alt="Avatar"
          className="w-32 h-32 rounded-full border-4 border-green-500 object-cover shadow-lg"
        />
        <h1 className="text-3xl font-bold mt-4">{user.email}</h1>
        <p className="text-gray-400 mb-4">Miembro Moodify</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Sección de playlists */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Tus playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} />
            ))
          ) : (
            <p className="text-gray-400">No tienes playlists todavía.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;