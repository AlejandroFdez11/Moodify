const User = require ("../models/User")
const bcrypt = require ("bcryptjs")
const jwt = require ("jsonwebtoken")
const upload = require("../middlewares/uploadImagen")

exports.registerUser = async (req,res)=>{
    const {name, email, password} = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          imagenPerfil: req.file ? req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename : "",  // Si hay imagen, se guarda la URL
        });
        await newUser.save();
        res.status(201).json({ message: "Usuario creado exitosamente" });
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Usuario no encontrado" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token, user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
}

// Actualizar imagen de perfil (ruta PUT)
exports.updateProfileImage = [
  upload.single("imagenPerfil"),  // Utilizar el middleware de Multer para subir una sola imagen
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      // Actualizar la URL de la imagen de perfil
      user.imagenPerfil = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      await user.save();

      res.json({ message: "Imagen de perfil actualizada exitosamente", imagenPerfil: user.imagenPerfil });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
]