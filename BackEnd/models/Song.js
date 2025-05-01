const mongoose = require("mongoose")

const songSchema = new mongoose.Schema({
    titulo:{
        type:String,
        required: true
    },
    artista:{
        type:String,
        required: true
    },
    album:{
        type: String,
        default: "Ninguno"
    },
    genero:{
        type:String,
        default: "Sin definir"
    },
    imagen:{
        type: String,
        required: true,
    },
    url:{
        type:String,
        required:true //Url de la cancion de spotify
    },
    spotifyId: {       // <-- Añade esto
      type: String,
      required: true,
      unique: true
    },
    uri: {              // <-- Añade esto
      type: String,
      required: true
    }
})

module.exports = mongoose.model("Song",songSchema)