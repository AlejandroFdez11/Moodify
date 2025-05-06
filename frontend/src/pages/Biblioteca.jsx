import PlaylistCard from "../components/PlayListCard";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/Auth";
import { ClipLoader } from "react-spinners";

const Biblioteca = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      logout();
      navigate("/login");
      return;
    }

    axios.get("http://localhost:5000/playlists/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setPlaylists(res.data);
      setLoading(false);
    })
    .catch(error => {
      console.error(error);
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      }
      setLoading(false);
    });
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <ClipLoader color="#ffffff" loading={true} size={60} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-4">Mis Playlists</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {playlists.length > 0 ? (
          playlists.map(playlist => (
            <PlaylistCard key={playlist._id} playlist={playlist} />
          ))
        ) : (
          <p className="text-gray-400">No se encontraron playlists</p>
        )}
      </div>
    </div>
  ); 
}

export default Biblioteca;