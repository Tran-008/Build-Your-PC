# Build Your PC – Web

Zero-dependency static site. No build step. Works in any browser.

## Structure

```
web/
  index.html        ← entire site (one file, no framework needed)
  vercel.json       ← SPA + API routing rules
  data/
    gpus.js         ← 9 RTX 50-series GPUs
    cpus.js         ← 20 CPUs (Intel 13/14th Gen + AMD Ryzen 9000/8000)
    ram.js          ← 21 RAM kits (DDR4 + DDR5)
    ssds.js         ← 21 SSDs (Samsung, WD, Crucial, Kingston) — ASINs need filling
  api/
    price.js        ← Vercel function: saved price, or fresh ZenRows check when refreshed
    prices.js       ← Vercel function: all saved prices (loaded on every visit)
  lib/
    store.js        ← shared price database (Redis, via REDIS_URL)
package.json        ← lists the `redis` package; Vercel installs it on deploy
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

## Prices (ZenRows)

Price fetching is wired up. To activate it:

1. Go to **zenrows.com** → sign up and copy your API key from the dashboard.
3. Go to **Vercel** → your project → **Settings → Environment Variables**.
4. Add: `ZENROWS_API_KEY` = `your_key_here` (Production)
5. Click **Redeploy** (top of Deployments tab).

Once deployed, every part (CPU, GPU, RAM, SSD) has a **↻ PRICE** button, and the
cart has **↻ REFRESH ALL PRICES**. Prices are fetched only when you ask and are
labeled "checked [date]". Never say "live" or "updated daily" — credits are limited.

Status messages tell you what is wrong:
- "Price service not set up" → `ZENROWS_API_KEY` is missing in Vercel (or you did not redeploy).
- "Prices only work on the deployed site" → you opened `index.html` straight from disk; `/api` only exists on Vercel.
- "No Amazon ASIN yet" → fill in that part's `asin` in `data/*.js`.

**Cost**: each price check uses 10 credits. Free plan = 1,000 checks/month.

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
https://www.amazon.in/gp/aws/cart/add.html?AssociateTag=buildurpc-21&ASIN.1=B0...&Quantity.1=1&...
```
This is the standard Amazon multi-item cart URL.
- `AssociateTag` is optional but recommended. Set it to your Amazon Associates tag
  in `index.html` (search `buildurpc-21`) to earn referral fees.
- Items without an ASIN are automatically skipped.

## SSD ASINs

All SSD ASINs in `data/ssds.js` are currently **blank** because the original
spreadsheet had a placeholder ASIN for all 21 items. You must fill in the real
ones. For each SSD:
1. Search: `amazon.in/s?k=Samsung+990+PRO+1TB` (adjust name/capacity).
2. Click the exact product page.
3. Copy the 10-character ASIN from the URL (`/dp/XXXXXXXXXX`).
4. Paste it into `data/ssds.js` for that item's `asin:` field.

## ASINs

All GPU ASINs are **Unverified**. CPU and RAM ASINs are from your sheets.
Before launch, open each `amazon.in/dp/<ASIN>` and confirm exact model.

## Shared price database (saves ZenRows credits)

Prices are saved in a Redis database, so every device and browser shows the same
numbers without fetching again.

1. Vercel → build-ur-pc → **Storage** → add a **Redis** database and connect it to
   this project. Vercel adds `REDIS_URL` for you. Use the free plan if offered.
2. Redeploy Production.
3. Click ↻ PRICE once. From then on, every device loads saved prices instantly.

How it works:
- Opening the site reads saved prices only. No ZenRows credits are used.
- ↻ PRICE and ↻ REFRESH ALL PRICES fetch a new price from ZenRows.
- Each product can be fetched at most once every 10 minutes, so repeated clicks
  cannot burn credits.
- Without the database the site still works, but nothing is saved between devices.
