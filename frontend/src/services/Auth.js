import axios from "axios"
import { jwtDecode } from "jwt-decode";

const URL_API= "http://localhost:5000/";

export const register = async (datosUsuario) =>{
    const res = await axios.post(`${URL_API}users/register`,datosUsuario)
    return res.data
}

export const login = async (datosUsuario) =>{
    const res = await axios.post(`${URL_API}users/login`,datosUsuario)
    const {token} = res.data

    console.log(datosUsuario)

    //Guardamos el token en el localStorage
    localStorage.setItem("token",token)
    return res.data
}

export const logout =()=>{
    localStorage.removeItem("token")
}

export const getUser=()=>{
    const token = localStorage.getItem("token")

    if (!token)return null

    return jwtDecode(token)
}

export const isAuthenticated = () =>{
    Boolean (localStorage.getItem("token"))
}