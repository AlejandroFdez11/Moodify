const BASE = "https://api.deezer.com";
const cache = new Map();
const TTL = 5 * 60 * 1000; // 5 minutos

async function deezer(path, params = {}) {
  const url = new URL(BASE + path);          // 👈 URL, no Url
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  });

  const key = url.toString();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < TTL) return hit.d;

  const r = await fetch(url, {
    headers: { "User-Agent": "Moodify/1.0" },
  });

  if (!r.ok) throw new Error(`Deezer HTTP ${r.status}`);

  const d = await r.json();
  if (d && d.error) {
    throw new Error(d.error.message || d.error.type || "Error de Deezer");
  }

  cache.set(key, { t: Date.now(), d });
  return d;
}

const sinCache = (path) => {
  cache.delete(BASE + path);
};

module.exports = { deezer, sinCache };        // 👈 CommonJS