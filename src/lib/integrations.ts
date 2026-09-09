export const GSC_VERIFICATION = "";
export const GA4_MEASUREMENT_ID = "G-YCF479SQGQ";
export const CLOUDFLARE_ANALYTICS_TOKEN = "";
export const CONSENT_STORAGE_KEY = "pixeltools-consent-v1";
export type ConsentChoice = "accepted" | "declined";
export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
  if (window.gtag) window.gtag("event", name, params);
  window.dispatchEvent(new CustomEvent("pixeltools:event", { detail: { name, params } }));
}
