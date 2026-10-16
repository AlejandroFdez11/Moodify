// Acepta array plano o cualquier envoltorio tipo { data: [...] }, { playlists: [...] }, etc.
export const asArray = (x, ...keys) => {
  if (Array.isArray(x)) return x;
  if (x && typeof x === "object") {
    for (const k of keys) {
      if (Array.isArray(x[k])) return x[k];
    }
    // Fallback: primer array que encuentre dentro del objeto
    for (const v of Object.values(x)) {
      if (Array.isArray(v)) return v;
    }
  }
  return [];
};