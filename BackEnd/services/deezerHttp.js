const BASE = "https://api.deezer.com";
const cache = new Map();
const TTL = 5 * 60 * 1000;

export async function deezer(path, params = {}) {
  const url = new Url(BASE + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const key = url.toString();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < TTL) return hit.d;

  const r = await fetch(url);
  const d = await r.json();
  if (d.error) throw new Error(d.error.message || "Error de Deezer");
  cache.set(key, { t: Date.now(), d });
  return d;
}

export const sinCache = (path) =>{cache.delete(BASE + path);}
