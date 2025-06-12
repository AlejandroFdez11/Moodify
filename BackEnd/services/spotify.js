const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

const refreshToken = async () => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    const token = data.body.access_token;
    console.log("Nuevo token recibido:", token.slice(0, 20), "...");

    spotifyApi.setAccessToken(token);
  } catch (err) {
    console.error("Error al obtener token de Spotify:", err.message);
    throw err;
  }
};

module.exports = { spotifyApi, refreshToken };