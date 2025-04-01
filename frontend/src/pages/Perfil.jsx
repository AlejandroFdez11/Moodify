import { useEffect, useState } from "react";
import { getUser, logout } from "../services/Auth";
import { useNavigate } from "react-router-dom";

const Perfil =()=>{
    const [user,setUser] = useState(null)
    const pag = useNavigate()

    useEffect(()=>{
        const datosUsuario = getUser()
        if (!datosUsuario) pag("/login")
        setUser(datosUsuario)
    },[pag])

    const Logout=()=>{
        logout()
        pag("/login")
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            {user ? (
            <div className="bg-gray-800 p-6 rounded-md text-center">
                <h2 className="text-white text-xl mb-4">Bienvenido, {user.name}</h2>
                <p className="text-gray-400">{user.email}</p>
                <button onClick={handleLogout} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">Cerrar sesión</button>
            </div>
            ) : (
            <p className="text-white">Cargando...</p>
            )}
        </div>
    )
}