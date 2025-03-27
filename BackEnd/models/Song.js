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
    url:{
        type:String,
        required:true //Url de la cancion de spotify
    }
})

module.exports = mongoose.model("Song",songSchema)