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

//Obtener todos los datos de un usuario
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('playlists', 'name imagen');

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos del usuario' });
  }
};

// Actualizar imagen de perfil
exports.updateProfileImage = async (req, res) => {
  const token = req.body.token;
  const imageUrl = req.body.imageUrl;

  if (!req.file && !imageUrl) {
    return res.status(400).json({ error: 'No se ha proporcionado una imagen o URL' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    let finalImageUrl;
    if (req.file) {
      finalImageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      try {
        new URL(imageUrl);
        finalImageUrl = imageUrl;
      } catch (error) {
        return res.status(400).json({ error: 'URL de imagen inválida' });
      }
    }

    user.imagenPerfil = finalImageUrl;
    await user.save();

    res.status(200).json({ 
      message: 'Imagen de perfil actualizada', 
      imagenPerfil: finalImageUrl 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al actualizar la imagen de perfil' });
  }
};