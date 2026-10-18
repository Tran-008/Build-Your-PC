# Build Your PC – Web

Zero-dependency static site. No build step. Works in any browser.

## Structure

```
web/
  index.html        ← entire site (one file, no framework needed)
  data/
    gpus.js         ← 9 RTX 50-series GPUs
    cpus.js         ← 20 CPUs (Intel 13/14th Gen + AMD Ryzen 9000/8000)
    ram.js          ← 21 RAM kits (DDR4 + DDR5)
```

## Run locally

Just open `index.html` in a browser. Or:

```bash
npx serve .
# then open http://localhost:3000
```

## Deploy to Vercel (free)

1. Push this `web/` folder to GitHub.
2. Go to vercel.com → New Project → import your repo.
3. Set root directory to `web` (or leave blank if you push the whole repo).
4. Framework preset: **Other** (or Static).
5. Deploy. Vercel gives you a free `.vercel.app` domain.
6. Later: add your Hostinger domain in Vercel's domain settings and update DNS.

## Adding prices (ScrapingAnt)

Prices are not in the site yet. To add them:

1. Run `scripts/test-price.mjs` from the project root to test ScrapingAnt.
2. When ready, call your API route (or a Vercel Edge Function) to fetch the
   latest price for an ASIN, and inject it into the card.
3. Show: "Price checked on [date]". Never say "live" or "updated daily".

## Updating parts data

Edit the JS files in `data/`. Each object in the array is one part.
Set `image: "https://..."` when you have an image URL.
Set `cardLength`, `slotWidth`, `powerConnector` on GPUs for the
compatibility engine (case/GPU length warning).

## Compatibility rules implemented

- AM5 CPU + DDR4 RAM → error warning
- CPU memorySupport does not include chosen RAM type → error warning
- High power draw (>850 W estimated) → caution warning

More rules to add later:
- GPU card length vs case max GPU length
- Cooler height vs case max CPU cooler height
- Motherboard socket vs CPU socket (needs motherboard data)
- Motherboard form factor vs case (needs case data)

## Amazon cart import

The "Import to Amazon Cart" button builds this URL:
```
https://www.amazon.in/gp/aws/cart/add.html?ASIN.1=B0...&Quantity.1=1&ASIN.2=B0...&Quantity.2=1
```
This is Amazon's standard multi-item cart URL and does NOT require an
Associates account to function. Open it and check all items landed.

## ASINs

All GPU ASINs are **Unverified**. CPU and RAM ASINs are from your sheets.
Before launch, open each `amazon.in/dp/<ASIN>` and confirm exact model.
