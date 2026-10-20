// Shared price store on Upstash Redis (free tier), via its REST API — no npm packages.
// Vercel env vars (added automatically when you connect Upstash from the Vercel Storage tab):
//   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN   (or KV_REST_API_URL / KV_REST_API_TOKEN)
// If these are missing the site still works, it just does not cache.

const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
export const storeEnabled = Boolean(URL_ && TOKEN);
const HASH = 'byp:prices';

async function cmd(command) {
  const r = await fetch(URL_, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command)
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

// { [asin]: { price | unavailable, checkedAt } }
export async function getAll() {
  if (!storeEnabled) return {};
  const flat = await cmd(['HGETALL', HASH]) || [];
  const out = {};
  for (let i = 0; i < flat.length; i += 2) out[flat[i]] = JSON.parse(flat[i + 1]);
  return out;
}

export async function getOne(asin) {
  if (!storeEnabled) return null;
  const v = await cmd(['HGET', HASH, asin]);
  return v ? JSON.parse(v) : null;
}

export async function setOne(asin, value) {
  if (!storeEnabled) return;
  await cmd(['HSET', HASH, asin, JSON.stringify(value)]);
}

// Returns true if this request may call ZenRows now (no fetch in the last `seconds`).
export async function claimFetch(asin, seconds = 600) {
  if (!storeEnabled) return true;
  const ok = await cmd(['SET', `byp:lock:${asin}`, '1', 'NX', 'EX', String(seconds)]);
  return ok === 'OK';
}
