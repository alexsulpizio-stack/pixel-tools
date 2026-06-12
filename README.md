# PixelTools

Free, private, browser-based image tools: **compress**, **resize**, and **convert** images (JPG / PNG / WebP) with batch processing and ZIP download. All processing happens client-side via the Canvas API — no server, no uploads, no storage costs.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

## Stack

- Vite + React + TypeScript
- Canvas API for all image processing (zero backend)
- JSZip for "Download all" batch export

## Monetization playbook

The app is designed for the **ads + zero-cost hosting** model:

1. **Host for free** — deploy `dist/` to Cloudflare Pages, Netlify, or Vercel. Since there's no backend, hosting costs stay at $0 regardless of traffic.
2. **Buy a domain** (~$10/yr) — short, keyword-friendly (e.g. contains "image", "compress", or "pixel"). Update the `canonical` URL in `index.html`.
3. **Apply for an ad network** once you have a live domain with some content:
   - Google AdSense is the standard starting point.
   - Replace the placeholders in `src/components/AdSlot.tsx` with the network snippet. Slots are pre-sized (728×90 banner, 336×280 box) to avoid layout shift.
4. **SEO is the traffic engine**:
   - Meta tags and FAQ content are already in place; FAQs target long-tail searches.
   - Add more tool pages over time (crop, rotate, favicon generator, image-to-PDF) — each new tool is a new set of keywords.
   - Submit the sitemap to Google Search Console on day one.
5. **Optional later**: a one-time "Pro" unlock (e.g. ad-free + presets) via a payment link, and a Buy Me a Coffee link (placeholder already in the header).

### Realistic expectations

Tool sites earn roughly $1–10 RPM (per 1,000 pageviews) from ads. Traffic compounds slowly through SEO over months — the win is that costs are zero and maintenance is minimal, so anything it earns is profit. Shipping more small tools on the same domain is the main growth lever.

## Roadmap ideas

- [ ] More tools: crop, rotate/flip, favicon generator, image → PDF
- [ ] Per-file format/quality overrides
- [ ] Target-file-size mode ("compress to under 200 KB")
- [ ] PWA support for offline use
- [ ] Sitemap + per-tool landing pages for SEO
