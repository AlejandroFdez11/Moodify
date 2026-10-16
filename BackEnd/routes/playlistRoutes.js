const express = require("express");
const {createPlaylist,
    getPlaylists,
    getMyPlaylists,
    addSongToPlaylist,
    getPlaylistSongs,
    getPlaylistById,
    deletePlaylist,
    removeSongFromPlaylist} = require("../controllers/playlistController");
const Auth = require("../middlewares/auth");
const uploadPlaylistImage = require("../middlewares/uploadPlaylistsImagen");
const PlaylistVerifyOwner = require("../middlewares/authPlaylist");

const router = express.Router();

router.post("/", Auth, uploadPlaylistImage, createPlaylist);
router.get("/", getPlaylists);
router.get("/me", Auth, getMyPlaylists);
router.post("/:playlistId/add-song", Auth, PlaylistVerifyOwner, addSongToPlaylist);
router.get("/:playlistId/songs", getPlaylistSongs);
router.get("/:playlistId", getPlaylistById);
router.delete("/:playlistId",Auth,PlaylistVerifyOwner,deletePlaylist);
router.delete("/:playlistId/song/:songId", Auth, PlaylistVerifyOwner, removeSongFromPlaylist);

module.exports = router;