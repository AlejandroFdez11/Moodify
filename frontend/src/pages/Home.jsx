import SongCard from "../components/SongCard";
import axios from "axios";
import { useState, useEffect } from "react";

const Home = () => {
  const [songs,setSongs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/songs")
      .then(res => setSongs(res.data))
      .catch(err => console.error(err));
  }, [])

 

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-4">Canciones Populares</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {songs.map(song => <SongCard key={song._id} song={song} />)}
      </div>
    </div>
  );
};

export default Home;