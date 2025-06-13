const dotenv = require("dotenv")
dotenv.config()

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://moodify-wf1j.onrender.com' 
  : `http://localhost:${process.env.PORT || 5000}`;

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

//Importar los Routers de cada elemento
const userRoutes = require("./routes/userRoutes")
const songRoutes = require("./routes/songRoutes")
const playlistRoutes = require("./routes/playlistRoutes")
const spotifyRouter = require ("./routes/spotifyRouter")
const artistaRoutes = require("./routes/artistaRoutes")
const { authenticateSpotify } = require("./config/spotifyConfig")
const path = require('path');


const app = express()

// Middleware para agregar BASE_URL a todas las solicitudes
app.use((req, res, next) => {
  req.BASE_URL = BASE_URL;
  next();
});

app.use(express.json())

//Agrega CORS específico
const corsOptions = {
  origin: ['http://localhost:5173', 'https://moodify-2tjk.vercel.app/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/uploads", express.static("uploads"));

//Conexion a MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB conectado"))
.catch(e => console.log(e))

//Rutas de la API
app.use("/users",userRoutes)
app.use("/songs",songRoutes)
app.use("/playlists",playlistRoutes)
app.use("/spotify",spotifyRouter)
app.use("/artistas",artistaRoutes)


//Autentificación con Spotify
authenticateSpotify()

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));