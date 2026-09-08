# Pixel Tools — Context

**What it is:** Browser-based image utilities — compression, target-file-size processing, batch processing, and others. Full tool inventory not yet documented.

**Production:** https://usepixeltools.com · **Repo:** `alexsulpizio-stack/pixel-tools`

See `AGENTS.md` for working conventions.

---

## Business objective

Operate this as a production product, not a utility collection. The goal is sustainable AdSense revenue via:

> Google Search → useful tool page → successful tool use → further engagement → legitimate ad impressions → repeat visits

Optimize **organic visitors × useful engagement × revenue per visitor**, not ad density. More ads degrade UX, which hurts engagement and performance, which hurts SEO. Traffic growth is a far bigger multiplier than RPM tuning. The tool stays the focus of every page; advertising is subordinate to it.

**Traction:** Cloudflare reported the first 10,000+ pageview month on September 5, 2026 (site created June 12, 2026). A figure of 18,447 pageviews also appeared — the period it covers is unknown, don't assume monthly.

---

## ⚠️ AdSense: not approved

Site ownership is verified. Status is **"Needs attention — your site isn't ready to show ads,"** cited as **low value content**. Ownership is not the bottleneck; content is.

**Do not request another review until the site has materially changed.**

### What actually unblocks approval

1. **Depth on core tool pages.** Each should be a genuinely useful resource for its task — what the tool does, format-specific behavior, quality/size tradeoffs, recommended settings for common cases, how images are handled, limitations, troubleshooting, FAQs, related tools.
2. **Thin-content audit.** Inventory every indexable route; for each decide improve / consolidate / redirect / noindex / remove. Watch for duplicates, obsolete and test routes, unfinished pages, parameter-generated pages. Not started.
3. **Trust layer.** About, Contact, Privacy Policy, Terms, navigation, footer, clear branding, and an explicit disclosure of how uploaded images are processed. Current quality unverified.

Then let Google recrawl before resubmitting.

### Explicitly ruled out as a fix

Generic SEO filler. Hundreds of AI-generated articles. Dozens of near-identical target-size pages (`/compress-image-to-100kb`, `/compress-image-to-200kb`, …). Keyword variations with no independent value. A dedicated page has to solve a distinct problem.

**Let Search Console drive expansion instead** — find queries already earning impressions, near-page-one rankings, or poor CTR despite good position. Those are the real opportunities.

---

## Known bugs

| Where | Problem |
|---|---|
| `src/pages/CompressorPage.tsx` (~line 57) | Clearing a running batch leaves "Processing…" stuck — cancellation doesn't reset busy state |
| `src/pages/TargetSizePage.tsx` (~line 33) | Switching target-size pages mid-process lets the old operation finish and render results for the wrong target |
| `index.html` (~line 20) | AdSense script loads unconditionally, so the advertising-off setting doesn't actually disable ads |

The third is a consent and correctness problem independent of approval — fix it on its own track. The rule should be `adsEnabled = consent && configuration && eligiblePage`. Also check for duplicate initialization, dev/staging behavior, layout shift from ad slots, accidental-click risk, and ads inside tool interaction areas.

---

## Build quality

At last inspection: production build passed, lint reported **51 errors**, no automated test suite, no full browser interaction testing. The 51 are a maintainability signal, not 51 runtime bugs — triage them, prioritizing React lifecycle, async state, stale state, correctness, and resource cleanup.

---

## Reliability target

A normal user should never hit a permanently stuck processing state, results from a different operation, a blank app because one component threw, or a silent failure.

Work: make long operations cancellable or invalidated so stale async results can't update current state; global error boundary; graceful handling of corrupt files and unsupported formats; release object URLs and large buffers; consider Sentry and uptime monitoring.

**Testing:** Playwright, covering upload → process → result → download for every tool. Regression cases: cancel mid-process, clear mid-process, navigate mid-process, change target mid-process, corrupt input, unsupported input, repeat processing, multiple files, failure recovery.

---

## Analytics

Needs to explain behavior, not just count pageviews. Stack: Search Console (queries, impressions, CTR, position), GA4 (in-product behavior), AdSense (post-approval), Cloudflare (independent traffic and performance view).

Funnel events: `tool_view`, `file_selected`, `processing_started`, `processing_completed`, `download_clicked`, plus `processing_failed`, `processing_cancelled`, `related_tool_clicked`. These should yield completion rate per tool and answer: which tools draw visitors but fail to produce downloads?

**Privacy constraint:** never send filenames, image contents, file paths, user content, image metadata, or anything extracted from uploaded images. Events describe product behavior only (`processing_completed`, `tool = compressor`).

---

## SEO and performance

Every important tool page should work as a search landing page: unique title and meta description, clear H1, canonical URL, OG/social metadata, structured data where justified, internal linking, crawlability, page-specific content. Site-wide: sitemap, robots.txt, proper 404s, canonical consistency, mobile usability.

Performance: route-level code splitting, lazy-load tool code and advertising, keep AdSense out of the critical rendering path, Web Workers for CPU-heavy processing, avoid unnecessary image copies, aggressive Cloudflare static caching, Brotli, long-lived caching for hashed assets. Watch LCP, INP, CLS. **Processing must never freeze the interface.**

---

## Unverified — check before assuming

GA4, Google Tag Manager, Search Console verification, consent management, Cloudflare analytics, existing custom events, and SEO metadata coverage were all discussed but never audited. The only confirmed AdSense finding in the repo is the unconditional script in `index.html`.

---

## Next steps

1. Confirm current `main`; inventory all routes and tools.
2. Fix the three known defects.
3. Re-run lint and triage the errors.
4. Audit what analytics/SEO/AdSense/consent code actually exists.
5. Inventory indexable URLs and their current content.
6. Ship the content, thin-page, and trust work in small releases rather than one large one.
7. Browser QA on desktop and mobile.
8. Let Google recrawl, then resubmit to AdSense.

Note: at ~10K monthly pageviews, approval is worth roughly $30/month. It's a gate to clear, not income. Traffic growth is where the leverage is.
