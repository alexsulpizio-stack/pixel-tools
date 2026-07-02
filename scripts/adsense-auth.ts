/**
 * ONE-TIME local authorization to obtain an AdSense refresh token.
 *
 * AdSense's Management API does not allow service accounts, so we need an
 * OAuth refresh token for the Google account that owns the AdSense account.
 * This script runs a loopback OAuth flow, opens the consent screen in your
 * browser, and prints REFRESH_TOKEN=... which is then stored as a GitHub secret.
 *
 * Prereqs:
 *   - An OAuth 2.0 Client ID of type "Desktop app" created in Google Cloud.
 *   - Its downloaded JSON saved as oauth-client.json in the project root
 *     (gitignored), OR set OAUTH_CLIENT_FILE to its path.
 *   - The AdSense Management API enabled, and adsense.readonly on the consent screen.
 *
 * Run:  npx tsx scripts/adsense-auth.ts
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { exec } from "node:child_process";
import { OAuth2Client } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/adsense.readonly"];
const PORT = 5858;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

function loadClient(): { clientId: string; clientSecret: string } {
  const path = process.env.OAUTH_CLIENT_FILE || "oauth-client.json";
  const json = JSON.parse(readFileSync(path, "utf8"));
  const c = json.installed ?? json.web ?? json;
  if (!c.client_id || !c.client_secret) {
    throw new Error(`Could not find client_id/client_secret in ${path}.`);
  }
  return { clientId: c.client_id, clientSecret: c.client_secret };
}

const { clientId, clientSecret } = loadClient();
const oauth = new OAuth2Client({ clientId, clientSecret, redirectUri: REDIRECT_URI });

const authUrl = oauth.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: SCOPES,
});

const server = createServer(async (req, res) => {
  if (!req.url || !req.url.startsWith("/oauth2callback")) {
    res.statusCode = 404;
    res.end();
    return;
  }
  const code = new URL(req.url, REDIRECT_URI).searchParams.get("code");
  res.setHeader("Content-Type", "text/html");
  res.end(
    "<h2>Authorization complete.</h2><p>You can close this tab and return to Cursor.</p>"
  );
  server.close();

  if (!code) {
    console.error("No authorization code received.");
    process.exit(1);
  }
  try {
    const { tokens } = await oauth.getToken(code);
    if (!tokens.refresh_token) {
      console.error(
        "No refresh token returned. Revoke prior access at https://myaccount.google.com/permissions and rerun."
      );
      process.exit(1);
    }
    console.log("\n=== SUCCESS ===");
    console.log("REFRESH_TOKEN=" + tokens.refresh_token);
  } catch (err) {
    console.error("Token exchange failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log(`Listening on ${REDIRECT_URI}`);
  console.log("Opening the Google consent screen in your browser...\n");
  console.log(authUrl + "\n");
  // Best-effort auto-open on Windows; if it doesn't open, paste the URL above.
  exec(`start "" "${authUrl}"`, () => {});
});
