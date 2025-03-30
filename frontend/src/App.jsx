import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Playlists from './pages/Playlists';
import Home from "./pages/Home";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <div className="bg-gray-900 min-h-screen text-white">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/playlists" element={<Playlists/>}/>
        </Routes>
      </div>
      <Footer/>
    </Router>
  )
}

export default App
