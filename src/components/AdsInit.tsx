import { useEffect } from "react";
import { ADS_PROVIDER, EZOIC_PRIVACY_ID } from "../lib/adsConfig";

declare global {
  interface Window {
    ezstandalone?: { cmd: unknown[] };
  }
}

/**
 * Loads the active ad network's bootstrap scripts on the client only.
 * Keep ADS_PROVIDER = "none" until a network is approved.
 *
 * Ezoic: after signup, paste your privacy-script ID into EZOIC_PRIVACY_ID and
 * set ADS_PROVIDER to "ezoic". Also remove the AdSense <script> from index.html
 * (don't run both without guidance). Then add placeholder IDs from Ad Tester.
 */
export function AdsInit() {
  useEffect(() => {
    if (ADS_PROVIDER !== "ezoic") return;

    // Privacy / CMP script ID comes from the Ezoic dashboard (Integration).
    if (EZOIC_PRIVACY_ID) {
      const privacy = document.createElement("script");
      privacy.src = `//www.ezoic.com/ezoicprivacyjs.php?id=${encodeURIComponent(EZOIC_PRIVACY_ID)}`;
      privacy.async = true;
      document.head.appendChild(privacy);
    }

    window.ezstandalone = window.ezstandalone || { cmd: [] };
    window.ezstandalone.cmd = window.ezstandalone.cmd || [];

    const sa = document.createElement("script");
    sa.src = "//www.ezojs.com/ezoic/sa.min.js";
    sa.async = true;
    document.head.appendChild(sa);
  }, []);

  return null;
}
