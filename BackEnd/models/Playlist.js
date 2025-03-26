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
  isPublic:{
    type: Boolean,
    default: false
  },
  fechaCreacion:{
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Playlist", playlistSchema);
