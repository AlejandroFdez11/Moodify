import {Link} from "react-router-dom";

const NavBar=() =>{
    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">Moodify</Link>

            <input 
                type="text"
                placeholder="Buscar canciones ... "
                className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none"
            />
            
            <Link to="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md">
                Inicio Sesión
            </Link>
            <Link to="/playlists" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md">
                PlayLists
            </Link>
        </nav>
    );
};

export default NavBar;