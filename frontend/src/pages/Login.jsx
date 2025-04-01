import { useState } from "react";
import { login } from "../services/Auth";
import { useNavigate } from "react-router-dom";

const Login=()=>{
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const pag = useNavigate();

    const recogerDatos=(e)=>{
        setForm({...form, [e.target.name]: [e.target.value]})
    }

    const comprobacion= async (e)=>{
        e.preventDefault()
        try {
            await login(form)
            pag("/Perfil")
        } catch (error) {
            setError("Error en el Login, por fabor compruebe las credenciales.")
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
          <form onSubmit={comprobacion} className="bg-gray-800 p-6 rounded-md">
            <h2 className="text-white text-xl mb-4">Iniciar Sesión</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input type="email" name="email" placeholder="Correo" onChange={recogerDatos} className="w-full p-2 mb-2" />
            <input type="password" name="password" placeholder="Contraseña" onChange={recogerDatos} className="w-full p-2 mb-4" />
            <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Entrar</button>
          </form>
        </div>
      )
}