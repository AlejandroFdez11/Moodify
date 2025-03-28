const express = require("express");
const { addSong, getSongs, searchSpotifySongs } = require("../controllers/songController");

const router = express.Router();

router.post("/", addSong);
router.get("/", getSongs);
router.get("/search", searchSpotifySongs); // Búsca en SpotifyAPI

module.exports = router;
