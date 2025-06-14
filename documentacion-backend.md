# 🛠️ Documentación para Programadores

## 🚀 Tecnologías Principales

- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- Multer para subida de archivos
- Spotify Web API
- Vercel + Render para despliegue

---

## 🔧 Estructura del Proyecto

```
backend/
├── config/
│   └── spotifyConfig.js
├── controllers/
├── middlewares/
├── models/
├── routes/
├── uploads/
├── .env
└── server.js
```

---

## 🔑 Autenticación y Seguridad

- JWT obligatorio en rutas protegidas.
- Middleware `requireAuth` para validar tokens.
- Middleware `PlaylistVerifyOwner` para verificar la propiedad de la playlist.

---

## 📂 Middlewares

### `requireAuth`

Protege rutas que requieren login.

### `PlaylistVerifyOwner`

Verifica que el usuario sea el creador de una playlist.

### `upload`

Subida general de imágenes (`/uploads`), 3MB max, campos tipo `image`.

### `uploadPlaylistImage`

Para imágenes de playlists (`/uploads/playlists`), acepta `.jpg`, `.jpeg`, `.png`, `.webp`.

---

## 🗒️ Rutas

### 💼 `/users`

- `POST /register`: Registro
- `POST /login`: Login
- `POST /update-profile-image`: Subida de avatar (requiere imagen `image`)
- `GET /getUser`: Datos del usuario logueado (auth)
- `POST /send-verification-email`: Reenvío de email
- `GET /verify-email/:token`: Verifica email

### 🎵 `/songs`

- `POST /`: Agrega canción
- `GET /`: Todas las canciones
- `GET /:id`: Canción por ID
- `GET /songsArtist/:artistId`: Canción por artista

### 🔹 `/playlists`

- `POST /`: Crear playlist (auth + imagen)
- `GET /`: Todas las playlists
- `GET /me`: Mis playlists (auth)
- `POST /:playlistId/add-song`: Agrega canción (auth + propietario)
- `GET /:playlistId/songs`: Canciones de una playlist
- `GET /:playlistId`: Detalle de playlist
- `DELETE /:playlistId`: Eliminar (auth + propietario)
- `DELETE /:playlistId/song/:songId`: Quitar canción (auth + propietario)
- `GET /playlists-por-artistas`: Recomendaciones

### 🌊 `/spotify`

- `GET /songs`: Buscar canciones en Spotify
- `GET /playlists`: Buscar playlists
- `GET /artists`: Buscar artistas
- `GET /playlists/:id`: Obtener playlist

### 🎨 `/artistas`

- `GET /`: Buscar artistas por género

---

## 🌍 Integración con Spotify

Usa `spotify-web-api-node` con `clientCredentialsGrant`.

---

## 🚧 Despliegue

- Frontend en Vercel: [https://moodify-2tjk.vercel.app](https://moodify-2tjk.vercel.app)
- Backend en Render: [https://moodify-wf1j.onrender.com](https://moodify-wf1j.onrender.com)
- En desarrollo: `http://localhost:5000`

---

## ⚡ Tips para desarrollo local

Crear archivo `.env` con:

```
PORT=5000
MONGO_URL=<tu_url_de_mongo>
JWT_SECRET=<clave_secreta>
SPOTIFY_CLIENT_ID=<id>
SPOTIFY_CLIENT_SECRET=<secret>
```

Ejecutar:

```bash
npm install
node server.js
```

Asegúrate de que las carpetas `uploads/` y `uploads/playlists/` existan