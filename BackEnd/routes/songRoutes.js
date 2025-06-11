const express = require("express");
const { addSong, getSongs,getSongById,getSongsByArtist} = require("../controllers/songController");

const router = express.Router();

router.post("/", addSong);
router.get("/", getSongs);
router.get("/:id", getSongById);
router.get("/songsArtist/:artistId",getSongsByArtist)

module.exports = router;
