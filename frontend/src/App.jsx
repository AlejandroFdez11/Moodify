import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Registro from "./pages/Registro";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Busca from "./pages/Buscador";
import PagError from "./pages/PagError";
import Biblioteca from "./pages/Biblioteca";
import Reproductor from "./components/Reproductor";
import DetallesSong from "./pages/DetallesSong";
import DetallesPlaylist from "./pages/DetallesPlaylists";
import Emociones from "./pages/Emociones";
import ListadoEmocion from "./pages/ListadoEmocion";
import { useLocation } from "react-router-dom";

// 👇 NUEVOS
import { PlayerProvider } from "./context/PlayerContext";
import PlayerBar from "./components/PlayerBar";

const ListadoEmocionWrapper = () => {
  const location = useLocation();
  return <ListadoEmocion key={location.search} />;
};

const App = () => {
  return (
    <PlayerProvider>                     
      <Router>
        <div className="bg-gray-900 min-h-screen text-white pb-24"> {/* 👈 pb-24 para que la barra no tape contenido */}
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/buscador" element={<Busca />} />
            <Route path="/biblioteca" element={<Biblioteca />} />
            <Route path="/song/:id" element={<Reproductor />} />
            <Route path="/detalles/:id" element={<DetallesSong />} />
            <Route path="/playlist/:playlistId" element={<DetallesPlaylist />} />
            <Route path="/emociones" element={<Emociones />} />
            <Route path="/emocion" element={<Emociones />} />
            <Route path="/emociones/:emocion" element={<ListadoEmocionWrapper />} />
            <Route path="/emocion/:emocion" element={<ListadoEmocion />} />
            <Route path="*" element={<PagError />} />
          </Routes>
        </div>
        <Footer />
        <PlayerBar />                  
      </Router>
    </PlayerProvider>
  );
};

export default App;