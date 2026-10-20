// Vercel Serverless Function — /api/price?asin=BXXXXXXXXX
// Fetches the current price of an Amazon India product via ScrapingAnt.
//
// Setup (Vercel → Settings → Environment Variables):
//   SCRAPINGANT_API_KEY = <token copied from the ScrapingAnt dashboard>
//   Set it for Production, then redeploy. The key is NEVER stored in code.
//
// Same request settings as scripts/test-price.mjs, which worked from the command line:
//   browser=true, proxy_type=datacenter, proxy_country=IN

const INR = s => {
  const n = Number(String(s).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};

// Only read the product's own main price block (no whole-page fallback,
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

  const apiKey = process.env.SCRAPINGANT_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Price service not configured', unavailable: false });
  }

  const params = new URLSearchParams({
    url: `https://www.amazon.in/dp/${asin}`,
    'x-api-key': apiKey,
    browser: 'true',
    proxy_type: 'datacenter',
    proxy_country: 'IN'
  });

  try {
    const response = await fetch(`https://api.scrapingant.com/v2/general?${params}`, {
      signal: AbortSignal.timeout(25000)
    });
    const html = await response.text();
    const checkedAt = new Date().toISOString();

    if (!response.ok) {
      console.error('ScrapingAnt error:', response.status, html.slice(0, 300));
      return res.status(502).json({ error: 'ScrapingAnt request failed', upstreamStatus: response.status, checkedAt });
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
