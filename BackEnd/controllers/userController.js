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

// Actualizar imagen de perfil
exports.updateProfileImage = async (req, res) => {
  const { token } = req.body;

  if (!req.file) {
      return res.status(400).json({ error: 'No se ha proporcionado una imagen' });
  }

  // Obtener el ID del usuario desde el token
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Buscar el usuario en la base de datos
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Guardar la URL de la imagen de perfil en la base de datos
      const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      user.imagenPerfil = imageUrl;

      // Guardar los cambios en la base de datos
      await user.save();

      res.status(200).json({ message: 'Imagen de perfil actualizada', imagenPerfil: imageUrl });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al actualizar la imagen de perfil' });
  }
};