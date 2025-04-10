const multer = require("multer");
const path = require("path");

// Configuración para almacenar las imágenes en la carpeta 'uploads/'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");  // Asegúrate de crear la carpeta 'uploads' en tu raíz
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));  // Nombre único para evitar colisiones
    },
  });
  
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Solo se permiten imágenes JPEG, PNG o JPG"));
      }
      cb(null, true);
    },
  });
  
  module.exports = upload;