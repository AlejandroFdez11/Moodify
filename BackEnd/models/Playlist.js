const mongoose= require("mongoose");

const playlistSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  creador:{
    type: mongoose.Schema.Types.ObjectId, ref: "User", 
    required: true
  },
  songs:[{
    type: mongoose.Schema.Types.ObjectId, ref: "Song"
  }],
  imagen:{
    type: String,
    required: true,
    default: "https://images.wondershare.com/repairit/aticle/2021/07/resolve-images-not-showing-problem-1.jpg"
  },
  isPublic:{
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Playlist", playlistSchema);
