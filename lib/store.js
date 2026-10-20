// Shared price store on Redis. Vercel adds REDIS_URL when you connect a Redis database
// (Storage tab). If REDIS_URL is missing the site still works, it just does not cache.
import { createClient } from 'redis';

export const storeEnabled = Boolean(process.env.REDIS_URL);
const HASH = 'byp:prices';

let client = null;
async function db() {
  if (!storeEnabled) return null;
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    client.on('error', err => console.error('Redis error:', err.message));
    await client.connect();
  }
  return client;
}

// { [asin]: { price | unavailable, checkedAt } }
export async function getAll() {
  const c = await db();
  if (!c) return {};
  const raw = await c.hGetAll(HASH);
  const out = {};
  for (const [asin, v] of Object.entries(raw)) out[asin] = JSON.parse(v);
  return out;
}

export async function getOne(asin) {
  const c = await db();
  if (!c) return null;
  const v = await c.hGet(HASH, asin);
  return v ? JSON.parse(v) : null;
}

export async function setOne(asin, value) {
  const c = await db();
  if (!c) return;
  await c.hSet(HASH, asin, JSON.stringify(value));
}

// true if this request may call ZenRows now (no call for this product in the last `seconds`)
export async function claimFetch(asin, seconds = 600) {
  const c = await db();
  if (!c) return true;
  const ok = await c.set(`byp:lock:${asin}`, '1', { NX: true, EX: seconds });
  return ok === 'OK';
}
