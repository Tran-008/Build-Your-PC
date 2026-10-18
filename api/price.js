// Vercel Serverless Function — /api/price?asin=BXXXXXXXXX
// Fetches the current price of an Amazon India product via ScrapingAnt.
//
// Setup:
//   1. Go to Vercel → your project → Settings → Environment Variables
//   2. Add: SCRAPINGANT_API_KEY = <your key from scrapingant.com>
//   3. Redeploy. The key is NEVER stored in code.
//
// Free ScrapingAnt plan: 10,000 credits/month. One request = 10 credits.
// So you get ~1,000 price lookups per month for free.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { asin } = req.query;

  if (!asin || !/^[A-Z0-9]{10}$/.test(asin)) {
    return res.status(400).json({ error: 'Invalid ASIN' });
  }

  const apiKey = process.env.SCRAPINGANT_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Price service not configured', unavailable: true });
  }

  const targetUrl = 'https://www.amazon.in/dp/' + asin;
  const scrapingUrl = new URL('https://api.scrapingant.com/v2/general');
  scrapingUrl.searchParams.set('url', targetUrl);
  scrapingUrl.searchParams.set('x-api-key', apiKey);
  scrapingUrl.searchParams.set('browser', 'true');
  scrapingUrl.searchParams.set('proxy_country', 'IN');

  try {
    const response = await fetch(scrapingUrl.toString(), {
      headers: { 'x-api-key': apiKey },
      signal: AbortSignal.timeout(25000)
    });

    if (!response.ok) {
      console.error('ScrapingAnt error:', response.status, await response.text());
      return res.status(502).json({ error: 'Scraping failed', unavailable: true });
    }

    const html = await response.text();

    let price = null;

    // Pattern 1: <span class="a-price-whole">1,23,456</span>
    const wholeMatch = html.match(/class="a-price-whole"[^>]*>([\d,]+)/);
    if (wholeMatch) {
      price = parseInt(wholeMatch[1].replace(/,/g, ''), 10);
    }

    // Pattern 2: "priceAmount":123456 in JSON
    if (!price) {
      const jsonMatch = html.match(/"priceAmount"\s*:\s*([\d.]+)/);
      if (jsonMatch) price = Math.round(parseFloat(jsonMatch[1]));
    }

    // Pattern 3: displayPrice in JSON block
    if (!price) {
      const coreMatch = html.match(/"displayPrice"\s*:\s*"₹([\d,]+)"/);
      if (coreMatch) price = parseInt(coreMatch[1].replace(/,/g, ''), 10);
    }

    const checkedAt = new Date().toISOString();

    if (price && price > 0) {
      return res.status(200).json({ price, checkedAt });
    }

    if (html.includes('Currently unavailable') || html.includes('currently unavailable')) {
      return res.status(200).json({ unavailable: true, checkedAt });
    }

    return res.status(200).json({ error: 'Price not found on page', checkedAt });

  } catch (err) {
    console.error('Price fetch error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
