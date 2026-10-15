const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  artista: {
    type: String,
    required: true
  },
  album: {
    type: String,
    default: "Ninguno"
  },
  genero: {
    type: String,
    default: "Sin definir"
  },
  imagen: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  trackId: {
    type: String,
    required: true
  },
  uri: {
    type: String,
    required: true
  },
  preview_url: {
    type: String
  },
  duration_ms: {
    type: Number,  
    required: true
  },
  release_date: {
    type: String,  
    required: true
  },
  popularity: {
    type: Number,  
    default: 0
  }
});

module.exports = mongoose.model("Song", songSchema);