/**
 * Pulls Google Search Console performance data and writes a markdown report.
 *
 * Auth: a Google service account that has been added as a user on the
 * Search Console property. Provide its key via ONE of:
 *   - GSC_SA_KEY   = the full service-account JSON (used in CI via a secret)
 *   - GSC_KEY_FILE = path to a local service-account JSON file (local runs)
 *
 * Optional:
 *   - GSC_SITE_URL = "https://usepixeltools.com/"  (URL-prefix property, default)
 *                    or "sc-domain:usepixeltools.com" (Domain property)
 *
 * Output: reports/search-console-<end-date>.md and reports/latest.md
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { JWT, OAuth2Client } from "google-auth-library";

const SITE = process.env.GSC_SITE_URL ?? "https://usepixeltools.com/";
const REPORTS_DIR = "reports";

interface Row {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface QueryResult {
  rows?: Row[];
}

function loadCredentials(): { client_email: string; private_key: string } {
  const raw = process.env.GSC_SA_KEY;
  if (raw && raw.trim()) return JSON.parse(raw);
  const file = process.env.GSC_KEY_FILE;
  if (file && file.trim()) return JSON.parse(readFileSync(file, "utf8"));
  throw new Error(
    "No credentials. Set GSC_SA_KEY (service-account JSON) or GSC_KEY_FILE (path to JSON)."
  );
}

function utcDate(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function pos(n: number): string {
  return n.toFixed(1);
}

function num(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

const ADSENSE_STATE_LABELS: Record<string, string> = {
  READY: "✅ Ready — approved, ads can serve",
  GETTING_READY: "⏳ Getting ready — in review",
  REQUIRES_REVIEW: "📝 Requires review — request a review in AdSense",
  NEEDS_ATTENTION: "⚠️ Needs attention — a policy issue needs fixing",
  STATE_UNSPECIFIED: "Unknown",
};

/**
 * Fetches AdSense site approval status via the AdSense Management API.
 * Uses an OAuth refresh token (service accounts are not supported by AdSense).
 * Returns null when AdSense credentials are not configured, and a short list
 * of human-readable lines otherwise (including a friendly error on failure).
 */
async function fetchAdSenseStatus(): Promise<string[] | null> {
  const clientId = process.env.ADSENSE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.ADSENSE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.ADSENSE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  try {
    const oauth = new OAuth2Client({ clientId, clientSecret });
    oauth.setCredentials({ refresh_token: refreshToken });

    const accountsRes = await oauth.request<{ accounts?: { name: string }[] }>({
      url: "https://adsense.googleapis.com/v2/accounts",
    });
    const account = accountsRes.data.accounts?.[0]?.name;
    if (!account) return ["No AdSense account found for these credentials."];

    const sitesRes = await oauth.request<{
      sites?: { domain?: string; state?: string; autoAdsEnabled?: boolean }[];
    }>({ url: `https://adsense.googleapis.com/v2/${account}/sites?pageSize=50` });

    const sites = sitesRes.data.sites ?? [];
    if (sites.length === 0) return ["No sites are attached to this AdSense account yet."];

    return sites.map((s) => {
      const label = ADSENSE_STATE_LABELS[s.state ?? "STATE_UNSPECIFIED"] ?? s.state ?? "Unknown";
      return `**${s.domain ?? "(unknown domain)"}** — ${label}`;
    });
  } catch (err) {
    const e = err as { message?: string };
    return [`Could not read AdSense status (${e.message ?? "unknown error"}).`];
  }
}

interface SitemapEntry {
  path: string;
  lastSubmitted?: string;
  lastDownloaded?: string;
  errors?: string | number;
  warnings?: string | number;
  contents?: { submitted?: string | number; indexed?: string | number }[];
}

/** Days after which a sitemap that Google hasn't re-downloaded is flagged stale. */
const SITEMAP_STALE_DAYS = 14;

/**
 * Reports sitemap discovery health. A stale lastDownloaded means Google hasn't
 * re-read the sitemap, so newly added pages stay invisible — the exact failure
 * that once left most of the site undiscovered. Flags that loudly.
 */
async function fetchSitemapHealth(client: JWT): Promise<string[]> {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    SITE
  )}/sitemaps`;
  try {
    const res = await client.request<{ sitemap?: SitemapEntry[] }>({ url });
    const sitemaps = res.data.sitemap ?? [];
    if (sitemaps.length === 0) {
      return [
        "⚠️ **No sitemap submitted.** Submit `sitemap.xml` in Search Console so Google can discover your pages.",
      ];
    }
    return sitemaps.map((s) => {
      const submitted = s.contents?.[0]?.submitted ?? "—";
      let flag = "✅";
      let note: string;
      if (!s.lastDownloaded) {
        flag = "⚠️";
        note = "never downloaded by Google yet";
      } else {
        const days = Math.floor((Date.now() - new Date(s.lastDownloaded).getTime()) / 86_400_000);
        if (days > SITEMAP_STALE_DAYS) {
          flag = "⚠️";
          note = `last downloaded ${days} days ago — **stale, resubmit it in Search Console**`;
        } else {
          note = `last downloaded ${days} day${days === 1 ? "" : "s"} ago`;
        }
      }
      const errs = Number(s.errors ?? 0);
      const errNote = errs > 0 ? ` · ${errs} error(s)` : "";
      return `${flag} \`${s.path}\` — ${submitted} URLs submitted · ${note}${errNote}`;
    });
  } catch (err) {
    const e = err as { message?: string };
    return [`Could not read sitemap status (${e.message ?? "unknown error"}).`];
  }
}

async function main() {
  const creds = loadCredentials();
  const client = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });

  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    SITE
  )}/searchAnalytics/query`;

  async function query(body: Record<string, unknown>): Promise<Row[]> {
    try {
      const res = await client.request<QueryResult>({ url, method: "POST", data: body });
      return res.data.rows ?? [];
    } catch (err: unknown) {
      const e = err as { response?: { status?: number }; message?: string };
      const status = e.response?.status;
      if (status === 403) {
        throw new Error(
          `403 Forbidden for site "${SITE}". Add the service account email ` +
            `(${creds.client_email}) as a user on this Search Console property, ` +
            `and confirm GSC_SITE_URL matches the property type (URL-prefix vs sc-domain).`
        );
      }
      throw new Error(`Search Console API error${status ? ` (${status})` : ""}: ${e.message ?? err}`);
    }
  }

  // GSC data lags ~2-3 days; end the window a few days back for complete data.
  const end = utcDate(3);
  const start28 = utcDate(30);
  const start7 = utcDate(9);

  const [queries28, pages28, totals28, totals7] = await Promise.all([
    query({ startDate: start28, endDate: end, dimensions: ["query"], rowLimit: 250 }),
    query({ startDate: start28, endDate: end, dimensions: ["page"], rowLimit: 250 }),
    query({ startDate: start28, endDate: end, rowLimit: 1 }),
    query({ startDate: start7, endDate: end, rowLimit: 1 }),
  ]);

  const byImpr = (a: Row, b: Row) => b.impressions - a.impressions;

  const topQueries = [...queries28].sort(byImpr).slice(0, 25);
  const topPages = [...pages28].sort(byImpr).slice(0, 25);

  // "Almost ranking" opportunities: visible but not yet on page 1.
  const opportunities = [...queries28]
    .filter((r) => r.position >= 6 && r.position <= 25 && r.impressions >= 5)
    .sort(byImpr)
    .slice(0, 15);

  const t28 = totals28[0];
  const t7 = totals7[0];

  const adsense = await fetchAdSenseStatus();
  const sitemap = await fetchSitemapHealth(client);

  const lines: string[] = [];
  lines.push(`# Search Console report — ${end}`);
  lines.push("");
  lines.push(`Property: \`${SITE}\``);
  lines.push("");

  if (adsense) {
    lines.push("## AdSense approval status");
    lines.push("");
    for (const line of adsense) lines.push(`- ${line}`);
    lines.push("");
  }

  lines.push("## Sitemap health");
  lines.push("");
  for (const line of sitemap) lines.push(`- ${line}`);
  lines.push("");

  lines.push("## Totals");
  lines.push("");
  lines.push("| Window | Clicks | Impressions | CTR | Avg position |");
  lines.push("| --- | ---: | ---: | ---: | ---: |");
  lines.push(
    `| Last 7 days | ${t7 ? num(t7.clicks) : 0} | ${t7 ? num(t7.impressions) : 0} | ${
      t7 ? pct(t7.ctr) : "—"
    } | ${t7 ? pos(t7.position) : "—"} |`
  );
  lines.push(
    `| Last 28 days | ${t28 ? num(t28.clicks) : 0} | ${t28 ? num(t28.impressions) : 0} | ${
      t28 ? pct(t28.ctr) : "—"
    } | ${t28 ? pos(t28.position) : "—"} |`
  );
  lines.push("");

  if (topQueries.length === 0) {
    lines.push("_No query data in the last 28 days yet. This is normal for a new site — check back next week._");
    lines.push("");
  } else {
    lines.push("## Top queries (last 28 days, by impressions)");
    lines.push("");
    lines.push("| Query | Impr. | Clicks | CTR | Avg pos |");
    lines.push("| --- | ---: | ---: | ---: | ---: |");
    for (const r of topQueries) {
      lines.push(
        `| ${r.keys[0]} | ${num(r.impressions)} | ${num(r.clicks)} | ${pct(r.ctr)} | ${pos(r.position)} |`
      );
    }
    lines.push("");

    lines.push("## Top pages (last 28 days, by impressions)");
    lines.push("");
    lines.push("| Page | Impr. | Clicks | CTR | Avg pos |");
    lines.push("| --- | ---: | ---: | ---: | ---: |");
    for (const r of topPages) {
      const path = r.keys[0].replace(/^https?:\/\/[^/]+/, "") || "/";
      lines.push(
        `| ${path} | ${num(r.impressions)} | ${num(r.clicks)} | ${pct(r.ctr)} | ${pos(r.position)} |`
      );
    }
    lines.push("");

    lines.push("## Opportunities — almost ranking (position 6–25)");
    lines.push("");
    if (opportunities.length === 0) {
      lines.push("_Nothing in the page-2 sweet spot yet._");
    } else {
      lines.push(
        "These queries already show your site but sit just below page 1. A dedicated or sharpened landing page targeting them could win clicks:"
      );
      lines.push("");
      lines.push("| Query | Impr. | Avg pos | CTR |");
      lines.push("| --- | ---: | ---: | ---: |");
      for (const r of opportunities) {
        lines.push(`| ${r.keys[0]} | ${num(r.impressions)} | ${pos(r.position)} | ${pct(r.ctr)} |`);
      }
    }
    lines.push("");
  }

  lines.push("---");
  lines.push(`_Generated ${new Date().toISOString()} • window ${start28} → ${end} (data lags ~3 days)._`);
  lines.push("");

  const report = lines.join("\n");
  mkdirSync(REPORTS_DIR, { recursive: true });
  writeFileSync(join(REPORTS_DIR, `search-console-${end}.md`), report);
  writeFileSync(join(REPORTS_DIR, "latest.md"), report);

  console.log(report);
  console.log(
    `\nWrote reports/latest.md and reports/search-console-${end}.md` +
      `\n28d totals — clicks: ${t28 ? num(t28.clicks) : 0}, impressions: ${t28 ? num(t28.impressions) : 0}`
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
