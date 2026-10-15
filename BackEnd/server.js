const dotenv = require("dotenv")
dotenv.config()

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://moodify-wf1j.onrender.com' 
  : `http://localhost:${process.env.PORT || 5000}`;

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const fs = require('fs');
const path = require('path');

// 1. Crear carpeta uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Carpeta uploads creada exitosamente');
}

// Importar routers
const userRoutes = require("./routes/userRoutes")
const songRoutes = require("./routes/songRoutes")
const playlistRoutes = require("./routes/playlistRoutes")
const artistaRoutes = require("./routes/artistaRoutes")
const deezerRoutes = require ("./routes/deezerRouter")

const app = express()

// Configuración CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'https://moodify-2tjk.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.get(['/perfil', '/biblioteca', '/login'], (req, res) => {
  res.redirect('https://moodify-2tjk.vercel.app/');
});

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json())

// Middleware para BASE_URL
app.use((req, res, next) => {
  req.BASE_URL = BASE_URL;
  next();
});

// Servir archivos estáticos DESPUÉS de crear la carpeta
app.use('/uploads', express.static(uploadsDir));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("✅ MongoDB conectado"))
.catch(e => console.error("❌ Error MongoDB:", e))

// Rutas
app.use("/",deezerRoutes)
app.use("/users", userRoutes)
app.use("/songs", songRoutes)
app.use("/playlists", playlistRoutes)
app.use("/artistas", artistaRoutes)


// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));