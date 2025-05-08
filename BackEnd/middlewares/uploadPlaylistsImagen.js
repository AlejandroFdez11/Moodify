const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dir = 'uploads/playlists';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});

const uploadPlaylistImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowedExts.includes(ext)) {
      return cb(new Error('Solo se permiten imágenes .jpg, .jpeg, .png y .webp'));
    }
    cb(null, true);
  }
}).single('imagenFile');

module.exports = uploadPlaylistImage;