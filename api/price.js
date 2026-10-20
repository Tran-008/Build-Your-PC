// GET /api/price?asin=BXXXXXXXXX            → saved price if we have one (no credits used)
// GET /api/price?asin=BXXXXXXXXX&refresh=1  → fetch a fresh price from ZenRows and save it
//                                            (at most once every 10 minutes per product)
import { getOne, setOne, claimFetch } from '../lib/store.js';

const INR = s => {
  const n = Number(String(s).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};

// Read only the product's own main price block (no whole-page fallback).
function extractPrice(html) {
  if (html.includes('id="outOfStock"')) return 'unavailable';
  for (const id of ['corePrice_feature_div', 'corePriceDisplay_desktop_feature_div']) {
    const start = html.indexOf(`id="${id}"`);
    if (start < 0) continue;
    const m = html.slice(start, start + 6000).match(/class="a-offscreen">\s*₹\s*([\d,]+(?:\.\d+)?)/);
    if (m) return INR(m[1]);
  }
  return null;
}

async function fetchFromZenRows(asin, apiKey) {
  const params = new URLSearchParams({
    apikey: apiKey,
    url: `https://www.amazon.in/dp/${asin}`,
    js_render: 'true',
    premium_proxy: 'true',
    proxy_country: 'in'
  });
  const response = await fetch(`https://api.zenrows.com/v1/?${params}`, { signal: AbortSignal.timeout(25000) });
  const html = await response.text();
  if (!response.ok) {
    console.error('ZenRows error:', response.status, html.slice(0, 300));
    return { upstreamStatus: response.status };
  }
  if (/Enter the characters you see below|api-services-support@amazon/i.test(html)) return { error: 'Amazon bot check' };
  const price = extractPrice(html);
  if (price === 'unavailable') return { unavailable: true };
  if (price) return { price };
  return { error: 'Price not found on page' };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const { asin, refresh } = req.query;
  if (!asin || !/^[A-Z0-9]{10}$/.test(asin)) return res.status(400).json({ error: 'Invalid ASIN' });

  try {
    const saved = await getOne(asin);
    if (saved && refresh !== '1') return res.status(200).json({ ...saved, cached: true });

    // About to spend credits: allow only one ZenRows call per product per 10 minutes.
    const allowed = await claimFetch(asin, 600);
    if (!allowed) {
      if (saved) return res.status(200).json({ ...saved, cached: true, cooldown: true });
      return res.status(429).json({ error: 'Price was checked a moment ago. Try again in a few minutes.' });
    }

    const apiKey = process.env.ZENROWS_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'Price service not configured' });

    const result = await fetchFromZenRows(asin, apiKey);
    const checkedAt = new Date().toISOString();

    if (result.upstreamStatus) {
      return res.status(502).json({ error: 'Price provider request failed', upstreamStatus: result.upstreamStatus, checkedAt });
    }
    if (result.price) {
      const value = { price: result.price, checkedAt };
      await setOne(asin, value);
      return res.status(200).json({ ...value, cached: false });
    }
    if (result.unavailable) {
      const value = { unavailable: true, checkedAt };
      await setOne(asin, value);
      return res.status(200).json({ ...value, cached: false });
    }
    return res.status(200).json({ error: result.error, checkedAt });
  } catch (err) {
    console.error('Price handler error:', err.message);
    return res.status(500).json({ error: 'Price fetch error: ' + err.message });
  }
}
