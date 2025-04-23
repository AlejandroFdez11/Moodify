import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/NavBar"
import Registro from "./pages/Registro"
import Home from "./pages/Home"
import Footer from "./components/Footer"
import Login from "./pages/Login"
import Perfil from "./pages/Perfil"
import Busca from "./pages/Buscador"
import PagError from "./pages/PagError"
import Biblioteca from "./pages/Biblioteca"

const App = () => {
  return (
    <Router>
      <div className="bg-gray-900 min-h-screen text-white">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/registro" element={<Registro/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/perfil" element={<Perfil/>}/>
          <Route path="/buscador" element={<Busca/>}/>
          <Route path="/biblioteca" element={<Biblioteca/>}/>


          <Route path="*" element={<PagError/>}/>
        </Routes>
      </div>
      <Footer/>
    </Router>
  )
}

export default App
