import { useState } from "react";
import { register } from "../services/Auth";
import { useNavigate } from "react-router-dom";

const Registro = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const cogerDatos = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Limpiar error al modificar inputs
  };

  const comprobacion = async (e) => {
    e.preventDefault();
    try {
      const response = await register(form); // register debe devolver respuesta json
      if (response.error) {
        setError(response.error);
        return;
      }
      navigate("/login");
    } catch (error) {
      // Si error.response?.data?.error viene del backend, lo usamos
      const backendError = error.response?.data?.error || "Error en el registro";
      setError(backendError);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form onSubmit={comprobacion} className="bg-gray-800 p-6 rounded-md w-80">
        <h2 className="text-white text-xl mb-4">Registrarse</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          onChange={cogerDatos}
          className="w-full p-2 mb-2 rounded"
          value={form.name}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          onChange={cogerDatos}
          className="w-full p-2 mb-2 rounded"
          value={form.email}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={cogerDatos}
          className="w-full p-2 mb-4 rounded"
          value={form.password}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Registro;