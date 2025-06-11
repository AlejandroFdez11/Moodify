const User = require ("../models/User")
const bcrypt = require ("bcryptjs")
const jwt = require ("jsonwebtoken")
const upload = require("../middlewares/uploadImagen")
const nodemailer = require('nodemailer');

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Comprobar si email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      imagenPerfil: req.file
        ? req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename
        : "",
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("Error en registro:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    res.status(500).json({ error: "Error del servidor, intenta nuevamente" });
  }
};

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

const jwtSecret = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendVerificationEmail = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    if (user.isVerified) {
      return res.status(400).json({ error: "Usuario ya está verificado" });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
    const verifyUrl = `http://localhost:5000/users/verify-email/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Verifica tu correo en Moodify",
      html: `
        <p>Hola ${user.name},</p>
        <p>Para verificar tu cuenta haz clic en el siguiente botón:</p>
        <a href="${verifyUrl}" style="padding:10px 20px; background:#22c55e; color:white; border-radius:5px; text-decoration:none;">Verificar correo</a>
        <p>Si no creaste esta cuenta, ignora este mensaje.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Correo de verificación enviado" });
  } catch (error) {
    console.error("Error enviando email:", error);
    res.status(500).json({ error: "Error enviando correo de verificación" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).send("Usuario no encontrado");

    if (user.isVerified) return res.send("Usuario ya está verificado");

    user.isVerified = true;
    await user.save();

    res.redirect("http://localhost:5173/perfil?verified=true");
  } catch (error) {
    console.error("Error verificando email:", error);
    res.status(400).send("Token inválido o expirado");
  }
};