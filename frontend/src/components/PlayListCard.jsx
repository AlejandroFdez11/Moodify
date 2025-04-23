import { Link } from "react-router-dom";

const PlaylistCard = ({ playlist }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition w-full h-80 flex flex-col">
      <img
        src={playlist.imagen || "https://imgs.search.brave.com/YYu9RPXk_lu1X9oml5B_2KfMhrkxGPiS3DR1mPO58Es/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTgz/NzIwOTA5L2VzL2Zv/dG8vc2lnbi5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9cUJl/WHFzR3k3aUctZ3d0/UzNnX2J3bVlLNmdC/c3BGNFNIelREY09n/S3M2bz0"}
        alt={playlist.name}
        className="w-full h-56 object-cover rounded-md"
      />
      <h3 className="text-white font-semibold mt-2 text-sm truncate">{playlist.name}</h3>
      <p className="text-gray-400 text-xs truncate">{playlist.descripcion || "Sin descripción"}</p>
      <Link
        to={`/playlist/${playlist._id}`}
        className="text-green-400 hover:underline text-sm mt-auto"
      >
        Ver más
      </Link>
    </div>
  );
};

export default PlaylistCard;