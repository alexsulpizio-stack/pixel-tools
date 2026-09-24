import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ADS_PROVIDER, ADSENSE_CLIENT, EZOIC_PRIVACY_ID } from "../lib/adsConfig";
import { CONSENT_STORAGE_KEY } from "../lib/integrations";
import { TARGET_PAGES } from "../lib/targetPages";
import { TOOLS_META } from "../content/tools";
import { GUIDES_META } from "../content/guides";

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
 * set ADS_PROVIDER to "ezoic". Then add placeholder IDs from Ad Tester.
 */
export function AdsInit() {
  const { pathname } = useLocation();

  useEffect(() => {
    const eligiblePaths = new Set([
      "/",
      "/tools",
      "/guides",
      ...TOOLS_META.map((tool) => tool.path),
      ...GUIDES_META.map((guide) => `/guides/${guide.slug}`),
      ...TARGET_PAGES.filter((page) => page.indexable).map((page) => `/${page.slug}`),
    ]);
    const configured =
      (ADS_PROVIDER === "adsense" && Boolean(ADSENSE_CLIENT)) ||
      (ADS_PROVIDER === "ezoic" && Boolean(EZOIC_PRIVACY_ID));
    const productionHost = ["usepixeltools.com", "www.usepixeltools.com"].includes(window.location.hostname);

    const load = () => {
      if (!configured || !productionHost || !eligiblePaths.has(pathname)) return;
      try {
        if (localStorage.getItem(CONSENT_STORAGE_KEY) !== "accepted") return;
      } catch {
        return;
      }

      if (ADS_PROVIDER === "adsense") {
        if (!document.getElementById("pixeltools-adsense")) {
          const script = document.createElement("script");
          script.id = "pixeltools-adsense";
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT)}`;
          script.async = true;
          script.crossOrigin = "anonymous";
          document.head.appendChild(script);
        }
        return;
      }
      if (ADS_PROVIDER !== "ezoic") return;

      // Privacy / CMP script ID comes from the Ezoic dashboard (Integration).
      if (EZOIC_PRIVACY_ID && !document.getElementById("pixeltools-ezoic-privacy")) {
        const privacy = document.createElement("script");
        privacy.id = "pixeltools-ezoic-privacy";
        privacy.src = `//www.ezoic.com/ezoicprivacyjs.php?id=${encodeURIComponent(EZOIC_PRIVACY_ID)}`;
        privacy.async = true;
        document.head.appendChild(privacy);
      }

      window.ezstandalone = window.ezstandalone || { cmd: [] };
      window.ezstandalone.cmd = window.ezstandalone.cmd || [];

      if (document.getElementById("pixeltools-ezoic")) return;
      const sa = document.createElement("script");
      sa.id = "pixeltools-ezoic";
      sa.src = "//www.ezojs.com/ezoic/sa.min.js";
      sa.async = true;
      document.head.appendChild(sa);
    };
    load();
    const onConsent = (event: Event) => {
      if ((event as CustomEvent).detail === "accepted") load();
    };
    window.addEventListener("pixeltools:consent", onConsent);
    return () => window.removeEventListener("pixeltools:consent", onConsent);
  }, [pathname]);

  return null;
}
