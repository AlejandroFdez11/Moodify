const express = require("express");
const { addSong, getSongs, searchSpotifySongs,getSongById } = require("../controllers/songController");

const router = express.Router();

router.post("/", addSong);
router.get("/", getSongs);
router.get("/search", searchSpotifySongs); // Búsca en SpotifyAPI
router.get("/:id", getSongById); 

module.exports = router;
