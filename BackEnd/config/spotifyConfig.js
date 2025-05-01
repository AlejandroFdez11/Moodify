const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

let spotifyAccessToken = "";
let tokenExpiresAt = 0;

const authenticateSpotify = async () => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString("base64"),
        },
      }
    );

    spotifyAccessToken = response.data.access_token;
    tokenExpiresAt = Date.now() + response.data.expires_in * 1000;
    console.log("✅ Token de Spotify renovado");
  } catch (error) {
    console.error("❌ Error autenticando con Spotify:", error.response?.data || error.message);
  }
};

const getSpotifyToken = async () => {
  // Si no hay token o expiró, renovamos
  if (!spotifyAccessToken || Date.now() >= tokenExpiresAt) {
    await authenticateSpotify();
  }
  return spotifyAccessToken;
};

module.exports = { authenticateSpotify, getSpotifyToken };