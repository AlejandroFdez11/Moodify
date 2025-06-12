const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

let spotifyAccessToken = "";
let tokenExpiresAt = 0;

const authenticateSpotify = async () => {
  console.log("Client ID definido?", !!process.env.SPOTIFY_CLIENT_ID);
  console.log("Client Secret definido?", !!process.env.SPOTIFY_CLIENT_SECRET);

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
              `${process.env.SPOTIFY_CLIENT_ID.trim()}:${process.env.SPOTIFY_CLIENT_SECRET.trim()}`
            ).toString("base64"),
        },
      }
    );

    spotifyAccessToken = response.data.access_token;
    tokenExpiresAt = Date.now() + response.data.expires_in * 1000;
    console.log("✅ Token de Spotify renovado");
  } catch (error) {
    console.error("❌ Error autenticando con Spotify:", error.response?.data || error.message);
    throw error;
  }
};

const getSpotifyToken = async () => {
  if (!spotifyAccessToken || Date.now() >= tokenExpiresAt) {
    await authenticateSpotify();
  }
  return spotifyAccessToken;
};

module.exports = { authenticateSpotify, getSpotifyToken };