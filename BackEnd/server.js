const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")

dotenv.config()
const app = express()

app.use(express.json())
app.use(cors())

//Conexion a MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB conectado"))
.catch(e => console.log(e))

//import userRoutes from "./routes/userRoutes.js";
//app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));