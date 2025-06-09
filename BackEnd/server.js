const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")

//Importar los Routers de cada elemento
const userRoutes = require("./routes/userRoutes")
const songRoutes = require("./routes/songRoutes")
const playlistRoutes = require("./routes/playlistRoutes")
const spotifyRouter = require ("./routes/spotifyRouter")
const { authenticateSpotify } = require("./config/spotifyConfig")
const path = require('path');

dotenv.config()
const app = express()

app.use(express.json())
app.use(cors())
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
app.use("spotify",spotifyRouter)


//Autentificación con Spotify
authenticateSpotify()

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));