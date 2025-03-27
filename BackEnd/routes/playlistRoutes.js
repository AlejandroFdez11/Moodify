const express = require("express");
const { createPlaylist, getPlaylists } = require("../controllers/playlistController");

const router = express.Router();

router.post("/", createPlaylist);
router.get("/", getPlaylists);

module.exports = router;