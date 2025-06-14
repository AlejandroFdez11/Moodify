const multer = require('multer');
const path = require('path');

// Crear carpeta uploads si no existe
const fs = require('fs');
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const isValidType = validMimeTypes.includes(file.mimetype);
    
    if (!isValidType) {
      return cb(new Error('Solo se permiten imágenes JPEG o PNG'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 3 * 1024 * 1024 // Reducir a 3MB para mayor estabilidad
  }
}).single('image'); // Nombre del campo debe ser 'image'

module.exports = upload;