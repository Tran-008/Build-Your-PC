// GET /api/prices → every cached price, so each device loads the same numbers without spending credits.
import { getAll, storeEnabled } from '../lib/store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  try {
    res.status(200).json({ prices: await getAll(), storeEnabled });
  } catch (err) {
    console.error('Store read error:', err.message);
    res.status(500).json({ error: 'Could not read saved prices' });
  }
}
