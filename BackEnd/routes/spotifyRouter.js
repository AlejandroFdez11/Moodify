const express = require("express");
const router = express.Router();
const spotifyController = require("../controllers/spotifyController");

router.get("/search/songs", spotifyController.searchSpotifySongs);
router.get("/search/playlists", spotifyController.searchSpotifyPlaylists);
router.get("/search/artists", spotifyController.searchSpotifyArtists);

module.exports = router;