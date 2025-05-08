import PlaylistCard from "../components/PlayListCard";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/Auth";
import { ClipLoader } from "react-spinners";

const Biblioteca = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [imagenFile, setImagenFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    imagen: "",
    descripcion: "",
    isPublic: false
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      logout();
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/playlists/me", {
        headers: { Authorization: `Bearer ${token}` }
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

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!formData.name.trim()) {
      setError("El nombre de la playlist es obligatorio.");
      return;
    }
  
    if (!imagenFile && !formData.imagen.trim()) {
      setError("Debes subir una imagen o proporcionar una URL.");
      return;
    }
  
    const data = new FormData();
    data.append("name", formData.name);
    data.append("descripcion", formData.descripcion);
    data.append("isPublic", formData.isPublic);
  
    if (imagenFile) {
      data.append("imagenFile", imagenFile);
    } else {
      data.append("imagen", formData.imagen);
    }
  
    try {
      const token = localStorage.getItem("token");
      
      // Verificar si el token existe antes de realizar la solicitud
      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }
  
      const res = await axios.post("http://localhost:5000/playlists", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
  
      const updated = await axios.get("http://localhost:5000/playlists/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setPlaylists(prev => [...prev, res.data]);
      setShowForm(false);
      setFormData({ name: "", imagen: "", descripcion: "", isPublic: false });
      setImagenFile(null);
    } catch (err) {
      console.error("Error al crear playlist:", err);
      alert("Error al crear la playlist");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <ClipLoader color="#ffffff" loading={true} size={60} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Mis Playlists</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Nueva Playlist
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Crear Playlist</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <fieldset className="space-y-2">
                <label className="block text-white">
                  Nombre de la Playlist *
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
                    required
                  />
                  {error.includes("nombre") && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}
                </label>

                <label className="block text-white">
                  Descripción
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
                  />
                </label>

                <label className="block text-white">
                  Subir imagen
                  <div className="relative w-full mt-1">
                    <button
                      type="button"
                      onClick={() => document.getElementById("imagenFileInput").click()}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Elegir imagen
                    </button>
                    <input
                      type="file"
                      id="imagenFileInput"
                      accept="image/*"
                      onChange={e => setImagenFile(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                  {imagenFile && <p className="text-sm text-gray-300 mt-1">{imagenFile.name}</p>}
                </label>

                <p className="text-center text-gray-400">o</p>

                <label className="block text-white">
                  URL de la imagen
                  <input
                    type="text"
                    name="imagen"
                    value={formData.imagen}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
                  />
                </label>

                {(imagenFile || formData.imagen) && (
                  <img
                    src={imagenFile ? URL.createObjectURL(imagenFile) : formData.imagen}
                    alt="Vista previa"
                    className="w-full h-48 object-cover rounded mt-2"
                  />
                )}

                {error.includes("imagen") && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <label className="flex items-center text-white mt-2">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  ¿Hacer pública?
                </label>
              </fieldset>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                    setFormData({ name: "", imagen: "", descripcion: "", isPublic: false });
                    setImagenFile(null);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
};

export default Biblioteca;