const express = require("express")
const {registerUser,loginUser,updateProfileImage,getUser} = require ("../controllers/userController")
const upload = require ("../middlewares/uploadImagen")
const router = express.Router()
const auth = require("../middlewares/auth")

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post('/update-profile-image', upload, updateProfileImage);
router.get('/getUser',auth,getUser)

module.exports= router