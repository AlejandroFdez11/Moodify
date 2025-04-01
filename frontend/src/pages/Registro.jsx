import { useState } from "react"
import { register } from "../services/Auth"
import { userNavigate} from "react-router-dom"

const Registro = () =>{
    const [form,setForm] = useState({name: "", email: "", password: ""})
    const [error, setError] = useState("")
    const pag = userNavigate()

    const cogerDatos=(e)=>{
        setForm({...form, [e.target.name]: e.target.value})
    }

    const comprobacion= async (e)=>{
        e.preventDefault()
        try {
            await register(form)
            pag("/login")
        } catch (error) {
            setError("Error en el Registro")
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <form onSubmit={comprobacion} className="bg-gray-800 p-6 rounded-md">
                <h2 className="text-white text-xl mb-4">Registrarse</h2>
                {error && <p className="text-red-500">{error}</p>}
                <input type="text" name="name" placeholder="Nombre" onChange={cogerDatos} className="w-full p-2 mb-2" />
                <input type="email" name="email" placeholder="Correo" onChange={cogerDatos} className="w-full p-2 mb-2" />
                <input type="password" name="password" placeholder="Contraseña" onChange={cogerDatos} className="w-full p-2 mb-4" />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Registrarse</button>
            </form>
        </div>
    )
}

export default Registro