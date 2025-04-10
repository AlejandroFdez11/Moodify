const express = require("express")
const {registerUser,loginUser,updateProfileImage} = require ("../controllers/userController")
const router = express.Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post('/update-profile-image', upload, updateProfileImage);

module.exports= router