const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    email:{
        type: String,
        unique: true,
        required: [true, "El email es obligatorio"],
        validate: {
            validator: validator.isEmail,
            message: "Por fabor, ingresa un email valido"
        }
    },
    password:{
        type: String,
        required: [true,"La contraseña es obligatoria"],
        minlength: [8,"La contraseña debe tener al menos 8 caracteres"]
    },
    imagenPerfil:{
        type: String
    },
    playlists:[{
        type: mongoose.Schema.Types.ObjectId, ref: "Playlist"
    }]
})

module.exports = mongoose.model("User",userSchema)