import axios from "axios"
import { jwtDecode } from "jwt-decode";

const URL_API= "http://localhost:5000/";

export const register = async (datosUsuario) =>{
    try {
        const res = await axios.post(`${URL_API}users/register`,datosUsuario)
        return res.data
    } catch (error) {
        if (error.response && error.response.data) {
            throw error;
        }
        throw new Error("Error de conexión");
    }
    
}

export const login = async (datosUsuario) =>{
    const res = await axios.post(`${URL_API}users/login`,datosUsuario)
    const usuario = datosUsuario
    const {token} = res.data

    console.log(datosUsuario)

    //Guardamos el token en el localStorage
    localStorage.setItem("token",token)
    localStorage.setItem("user",JSON.stringify(datosUsuario))
    return res.data
}

export const logout =()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("user")
}

export const getUser=()=>{
    const token = localStorage.getItem("token")

    if (!token)return null

    return jwtDecode(token)
}

export const isAuthenticated = () =>{
    Boolean (localStorage.getItem("token"))
}