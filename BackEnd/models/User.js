const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        require: [true, "El nombre es obligatorio"]
    },
    email:{
        type: String,
        unique: true,
        require: [true, "El email es obligatorio"],
        validate: {
            validator: validator.isEmail,
            message: "Por fabor, ingresa un email valido"
        }
    },
    password:{
        type: String,
        require: [true,"La contraseña es obligatoria"],
        minlength: [8,"La contraseña debe tener al menos 8 caracteres"]
    },
    playlists:[{
        type: mongoose.Schema.Types.ObjectId, ref: "Playlist"
    }]
})

export default mongoose.model("User",userSchema)