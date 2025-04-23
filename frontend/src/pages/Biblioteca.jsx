import PlaylistCard from "../components/PlayListCard";
import axios from "axios";
import { useState, useEffect } from "react";

const Biblioteca = () =>{
    const [playlists,setPlaylists] = useState([])

    useEffect(()=>{
        axios.get("http://localhost:5000/playlists/")
        .then(res=> setPlaylists(res.data))
        .catch(error=> console.error(error))
    },[])

    return (
        <div className="p-6">
          <h1 className="text-3xl font-bold text-white mb-4">Mis Playlists</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {playlists.map(playlist => <PlaylistCard key={playlist._id} playlist={playlist} />)}
          </div>
        </div>
      ); 
}

export default Biblioteca;