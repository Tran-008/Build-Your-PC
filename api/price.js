// Vercel Serverless Function — /api/price?asin=BXXXXXXXXX
// Fetches the current price of an Amazon India product via ZenRows.
//
// Setup (Vercel → Settings → Environment Variables):
//   Name:  ZENROWS_API_KEY
//   Value: <your ZenRows API key>   (Production, then redeploy)
// The key is NEVER stored in code.

const INR = s => {
  const n = Number(String(s).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};

// Read only the product's own main price block (no whole-page fallback,
// which can pick up prices of related products or ads).
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { asin } = req.query;
  if (!asin || !/^[A-Z0-9]{10}$/.test(asin)) {
    return res.status(400).json({ error: 'Invalid ASIN' });
  }

  const apiKey = process.env.ZENROWS_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Price service not configured' });
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    url: `https://www.amazon.in/dp/${asin}`,
    js_render: 'true',        // load the page like a browser
    premium_proxy: 'true',    // needed for Amazon
    proxy_country: 'in'       // Indian IP
  });

  try {
    const response = await fetch(`https://api.zenrows.com/v1/?${params}`, {
      signal: AbortSignal.timeout(25000)
    });
    const html = await response.text();
    const checkedAt = new Date().toISOString();

    if (!response.ok) {
      console.error('ZenRows error:', response.status, html.slice(0, 300));
      return res.status(502).json({ error: 'Price provider request failed', upstreamStatus: response.status, checkedAt });
    }

    if (/Enter the characters you see below|api-services-support@amazon/i.test(html)) {
      return res.status(200).json({ error: 'Amazon bot check', checkedAt });
    }

    const price = extractPrice(html);
    if (price === 'unavailable') return res.status(200).json({ unavailable: true, checkedAt });
    if (price) return res.status(200).json({ price, checkedAt });
    return res.status(200).json({ error: 'Price not found on page', checkedAt });
  } catch (err) {
    console.error('Price fetch error:', err.message);
    return res.status(500).json({ error: 'Price fetch error: ' + err.message });
  }
}
