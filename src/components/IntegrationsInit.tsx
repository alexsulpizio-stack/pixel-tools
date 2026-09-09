import { useEffect } from "react";
import { CONSENT_STORAGE_KEY, GA4_MEASUREMENT_ID, GSC_VERIFICATION, CLOUDFLARE_ANALYTICS_TOKEN } from "../lib/integrations";

function addScript(id: string, src: string, attrs: Record<string, string> = {}) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.async = true;
  Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value));
  document.head.appendChild(script);
}

export function IntegrationsInit() {
  useEffect(() => {
    if (GSC_VERIFICATION && !document.querySelector('meta[name="google-site-verification"]')) {
      const meta = document.createElement("meta");
      meta.name = "google-site-verification";
      meta.content = GSC_VERIFICATION;
      document.head.appendChild(meta);
    }

    let gaInitialized = false;

    const load = () => {
      if (GA4_MEASUREMENT_ID && !gaInitialized) {
        gaInitialized = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function (..._args: unknown[]) {
          window.dataLayer!.push(arguments);
        };
        window.gtag("js", new Date());
        window.gtag("config", GA4_MEASUREMENT_ID, { send_page_view: true });
        addScript("pixeltools-ga4", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_MEASUREMENT_ID)}`);
      }

      if (CLOUDFLARE_ANALYTICS_TOKEN) {
        addScript("pixeltools-cloudflare", "https://static.cloudflareinsights.com/beacon.min.js", {
          "data-cf-beacon": JSON.stringify({ token: CLOUDFLARE_ANALYTICS_TOKEN }),
        });
      }
    };

    if (localStorage.getItem(CONSENT_STORAGE_KEY) === "accepted") load();

    const onConsent = (event: Event) => {
      if ((event as CustomEvent).detail === "accepted") load();
    };

    window.addEventListener("pixeltools:consent", onConsent);
    return () => window.removeEventListener("pixeltools:consent", onConsent);
  }, []);

  return null;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
