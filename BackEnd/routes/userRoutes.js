const express = require("express")
const {registerUser,
    loginUser,
    updateProfileImage,
    getUser,
    verifyEmail,
    sendVerificationEmail
} = require ("../controllers/userController")
const upload = require ("../middlewares/uploadImagen")
const router = express.Router()
const auth = require("../middlewares/auth")

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post(
  '/update-profile-image',
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  updateProfileImage
);
router.get('/getUser',auth,getUser)
router.post("/send-verification-email", auth, sendVerificationEmail);
router.get("/verify-email/:token", verifyEmail);

module.exports= router