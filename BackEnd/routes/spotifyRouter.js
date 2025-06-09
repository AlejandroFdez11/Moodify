const express = require("express");
const router = express.Router();
const spotifyController = require("../controllers/spotifyController");

router.get("/songs", spotifyController.searchSpotifySongs);
router.get("/playlists", spotifyController.searchSpotifyPlaylists);
router.get("/artists", spotifyController.searchSpotifyArtists);
router.get("/playlists/:id", spotifyController.getSpotifyPlaylistById);

module.exports = router;