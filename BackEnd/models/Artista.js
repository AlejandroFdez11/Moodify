const mongoose= require("mongoose");

const artistaSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  imagen:{
    type: String,
    required: true,
  },
  genero:{
    type: String,
    required: true,
  },
  seguidores:{
    type:Number,
  }
});

module.exports = mongoose.model("Artista", artistaSchema);