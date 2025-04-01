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
        default: "https://images.wondershare.com/repairit/aticle/2021/07/resolve-images-not-showing-problem-1.jpg"
    },
    url:{
        type:String,
        required:true //Url de la cancion de spotify
    }
})

module.exports = mongoose.model("Song",songSchema)