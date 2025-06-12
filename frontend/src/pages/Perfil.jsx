import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { logout } from "../services/Auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PlaylistCard from "../components/PlayListCard";
import Notification from "../components/Notificacion";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [imageOption, setImageOption] = useState("url");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Obtener datos del usuario desde el backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://moodify-wf1j.onrender.com/users/getUser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Actualizar estado y localStorage con datos frescos del backend
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);

        // Si hay error (token inválido, etc.), redirigir a login
        if (error.response?.status === 401) {
          logout();
          navigate("/login");
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // Obtener playlists del usuario
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://moodify-wf1j.onrender.com/playlists/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlaylists(res.data);
      } catch (error) {
        console.error("Error al cargar playlists:", error);
        if (error.response?.status === 401) {
          logout();
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

  // Manejar cambio de imagen de perfil
  const handleImageUpload = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("token", token);

      if (imageOption === "url" && imageUrl) {
        try {
          new URL(imageUrl); // Validar URL
          formData.append("imageUrl", imageUrl);
        } catch (error) {
          setNotification({
            message: "Por favor ingresa una URL válida",
            type: "error",
          });
          setIsLoading(false);
          return;
        }
      } else if (imageOption === "file" && selectedFile) {
        formData.append("imagen", selectedFile);
      } else {
        setNotification({
          message: "Por favor selecciona una imagen",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        "https://moodify-wf1j.onrender.com/users/update-profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Actualizar estado y localStorage
      const updatedUser = {
        ...user,
        imagenPerfil: response.data.imagenPerfil,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("imageUpdated"));

      // Recargar para actualizar navbar
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar la imagen:", error);
      setNotification({
        message: error.response?.data?.error || "Error al actualizar la imagen",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setShowUploadModal(false);
      setImageUrl("");
      setSelectedFile(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    } else {
      setNotification({
        message: "Por favor selecciona un archivo de imagen válido",
        type: "error",
      });
      setSelectedFile(null);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <ClipLoader color="#ffffff" loading={true} size={60} />
      </div>
    );
  }

  const handleSendVerificationEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://moodify-wf1j.onrender.com/users/send-verification-email",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotification({
        message:
          "Correo de verificación enviado. Revisa tu bandeja de entrada.",
        type: "success",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setNotification({
        message: "Error al enviar correo de verificación.",
        type: "error",
      });
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      {/* Notificación */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Modal para cambiar imagen */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Cambiar foto de perfil</h3>

            <div className="flex border-b border-gray-700 mb-4">
              <button
                className={`flex-1 py-2 ${
                  imageOption === "url"
                    ? "text-green-500 border-b-2 border-green-500"
                    : ""
                }`}
                onClick={() => setImageOption("url")}
              >
                Desde URL
              </button>
              <button
                className={`flex-1 py-2 ${
                  imageOption === "file"
                    ? "text-green-500 border-b-2 border-green-500"
                    : ""
                }`}
                onClick={() => setImageOption("file")}
              >
                Subir archivo
              </button>
            </div>

            <form onSubmit={handleImageUpload}>
              {imageOption === "url" ? (
                <div>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Ingresa URL de la imagen"
                    className="w-full p-3 bg-gray-700 rounded mb-4"
                  />
                  <div className="text-xs text-gray-400 mb-4">
                    Ejemplo: https://ejemplo.com/imagen.jpg
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-3 bg-gray-700 rounded"
                  />
                  {selectedFile && (
                    <div className="mt-2 text-sm text-green-400">
                      Archivo seleccionado: {selectedFile.name}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 disabled:opacity-50"
                >
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header del perfil */}
      <div className="flex flex-col items-center text-center mb-10 relative">
        <div className="relative">
          <img
            src={
              user.imagenPerfil ||
              "https://media.istockphoto.com/id/877369086/es/foto/le%C3%B3n-panthera-leo-10-a%C3%B1os-de-edad-aislado-en-blanco.jpg?s=612x612&w=0&k=20&c=DY-jSoHGFJ-_fstEWhOZ5kAufR1zHFjwQdwZjI1vEoI="
            }
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-green-500 object-cover shadow-lg"
          />
          <button
            onClick={() => setShowUploadModal(true)}
            className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 hover:bg-green-600 transition-all"
            title="Cambiar foto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
        <h1 className="text-3xl font-bold mt-4 flex items-center justify-center gap-2">
          {user.name}
          {user.isVerified && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              viewBox="0 0 24 24"
              fill="currentColor"
              title="Usuario verificado"
            >
              <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm-1.25 14.5l-4.5-4.5 1.414-1.414 3.086 3.086 6.086-6.086L18.5 9.5z" />
            </svg>
          )}
        </h1>
        <p className="text-gray-400">{user.email}</p>
        <p className="text-gray-400 mb-4">Miembro Moodify</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full mt-2"
        >
          Cerrar sesión
        </button>

        {/* Solo mostrar botón si NO está verificado */}
        {!user.isVerified && (
          <button
            onClick={handleSendVerificationEmail}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full mt-3"
          >
            Verificar correo
          </button>
        )}
      </div>

      {/* Sección de playlists */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Tus playlists</h2>
        {playlists.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist._id}
                playlist={playlist}
                onDelete={() =>
                  setPlaylists(playlists.filter((p) => p._id !== playlist._id))
                }
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            <p className="text-gray-400 mb-4">No tienes playlists todavía</p>
            <button
              onClick={() => navigate("/biblioteca")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full"
            >
              Crear mi primera playlist
            </button>
          </div>
        )}
      </div>

      {/* Sección de datos de usuario */}
      <div className="mt-10 bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Datos de tu cuenta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium text-gray-400 mb-2">Nombre</h3>
            <p className="text-lg">{user.name}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium text-gray-400 mb-2">Email</h3>
            <p className="text-lg">{user.email}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium text-gray-400 mb-2">
              Fecha de registro
            </h3>
            <p className="text-lg">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
