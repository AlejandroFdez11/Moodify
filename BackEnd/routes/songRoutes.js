const express = require("express");
const { addSong, getSongs,getSongById } = require("../controllers/songController");

const router = express.Router();

router.post("/", addSong);
router.get("/", getSongs);
router.get("/:id", getSongById); 

module.exports = router;
