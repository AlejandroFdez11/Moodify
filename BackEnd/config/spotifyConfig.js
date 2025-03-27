const axios = require("axios")
const dotenv = require("dotenv")
dotenv.config()

let spotifyAccessToken = ""

const authenticateSpotify = async () => {
  try {
    const response = await axios.post("https://accounts.spotify.com/api/token", 
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    spotifyAccessToken = response.data.access_token
    console.log("Autenticado con Spotify")
  } catch (error) {
    console.error("Error autenticando con Spotify", error)
  }
};

const getSpotifyToken = () => spotifyAccessToken;

module.exports = { authenticateSpotify, getSpotifyToken }