const SongList = ({ songs }) => {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-white text-xl mb-4">Lista de Canciones</h2>
        <ul className="space-y-3">
          {songs.length > 0 ? (
            songs.map((song, index) => (
              <li key={index} className="text-gray-300 p-2 bg-gray-800 rounded hover:bg-gray-700">
                🎵 {song.title} - {song.artist}
              </li>
            ))
          ) : (
            <p className="text-gray-400">No hay canciones disponibles</p>
          )}
        </ul>
      </div>
    );
  };
  
export default SongList;