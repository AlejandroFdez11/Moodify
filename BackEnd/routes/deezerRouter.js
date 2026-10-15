import { Router } from 'express';
import * as s from './deezerService.js';

const r = Router();
const ok = (fn) => async (req, res) => {
  try { res.json(await fn(req)); }
  catch (e) { console.error(e); res.status(502).json({ error: e.message }); }
};

r.get('/artistas', ok(q => q.query.q ? s.buscarArtistas(q.query.q)
  : s.artistasPorGenero((q.query.genres || 'pop').split(','))));
r.get('/artistas/:id/top', ok(q => s.topArtista(q.params.id)));
r.get('/canciones', ok(q => s.buscarCanciones(q.query.q)));
r.get('/cancion/:id', ok(q => s.cancionFresca(q.params.id)));
r.get('/emocion', ok(q => s.porEmocion(+q.query.animo || 50, +q.query.energia || 50)));
export default r;