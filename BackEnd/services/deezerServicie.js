const { deezer } = require("./deezerHttp");

const GENEROS = {
  pop: 132, rap: 116, hiphop: 116, rock: 152, dance: 113, rnb: 165,
  electro: 106, reggaeton: 122, latin: 197, alternative: 85, metal: 464,
  jazz: 129, clasica: 98, country: 84, blues: 153, reggae: 144, soul: 169,
};

const trackDTO = (t) => ({
  id: t.id, titulo: t.title, artista: t.artist?.name, artistaId: t.artist?.id,
  album: t.album?.title, portada: t.album?.cover_medium, preview: t.preview, duracion: t.duration,
});

const artistaDTO = (a) => ({
  id: a.id, nombre: a.name, imagen: a.picture_medium, fans: a.nb_fan,
});

const mezclar = (a) => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(x => x[1]);
const unicos = (a) => [...new Map(a.map(t => [t.id, t])).values()];

async function buscarArtistas(q) {
  const { data } = await deezer("/search/artist", { q, limit: 20 });
  return data.map(artistaDTO);
}

async function artistasPorGenero(generos) {
  const res = await Promise.all(generos.map(async g => {
    const id = GENEROS[g.toLowerCase()];
    if (!id) return [];
    const { data } = await deezer(`/genre/${id}/artists`);
    return data.map(artistaDTO);
  }));
  return unicos(res.flat());
}

async function topArtista(id) {
  const { data } = await deezer(`/artist/${id}/top`, { limit: 20 });
  return data.filter(t => t.preview).map(trackDTO);
}

async function buscarCanciones(q) {
  const { data } = await deezer("/search", { q, limit: 25 });
  return data.filter(t => t.preview).map(trackDTO);
}

async function cancionFresca(id) {
  const t = await deezer(`/track/${id}`);
  return trackDTO(t);
}

const CUADRANTES = {
  "alta-pos": { generos: ["dance", "pop", "reggaeton"], queries: ["party hits", "summer hits"] },
  "alta-neg": { generos: ["rock", "metal", "rap"],        queries: ["angry rock", "hard rap"] },
  "baja-pos": { generos: ["pop", "latin", "reggae"],      queries: ["chill good vibes", "acoustic happy"] },
  "baja-neg": { generos: ["blues", "jazz", "alternative"], queries: ["sad songs", "melancholy"] },
};

async function porEmocion(animo, energia) {
  const c = CUADRANTES[`${energia >= 50 ? "alta" : "baja"}-${animo >= 50 ? "pos" : "neg"}`];
  const graf = await Promise.all(c.generos.map(async g => {
    const { data } = await deezer(`/chart/${GENEROS[g]}/tracks`, { limit: 30 });
    return data;
  }));
  const busq = await Promise.all(c.queries.map(q => deezer("/search", { q, limit: 20 }).then(r => r.data)));
  return mezclar(unicos([...graf.flat(), ...busq.flat()]).filter(t => t.preview))
    .slice(0, 25)
    .map(trackDTO);
}

module.exports = {
  GENEROS, trackDTO, artistaDTO,
  buscarArtistas, artistasPorGenero, topArtista,
  buscarCanciones, cancionFresca, porEmocion,
};