const express = require("express");
const { createPlaylist, getPlaylists,getMyPlaylists} = require("../controllers/playlistController");
const Auth = require("../middlewares/auth")
const uploadPlaylistImage = require("../middlewares/uploadPlaylistsImagen")

const router = express.Router();

router.post('/', Auth, uploadPlaylistImage, createPlaylist);
router.get("/", getPlaylists);
router.get("/me",Auth,getMyPlaylists);

module.exports = router;