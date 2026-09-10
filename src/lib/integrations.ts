export const GSC_VERIFICATION = "";
export const GA4_MEASUREMENT_ID = "G-WFQ4KMBMRP";
export const CLOUDFLARE_ANALYTICS_TOKEN = "";
export const CONSENT_STORAGE_KEY = "pixeltools-consent-v1";
export type ConsentChoice = "accepted" | "declined";

type AnalyticsParams = Record<string, string | number | boolean>;
type PendingEvent = { name: string; params: AnalyticsParams };

const pendingEvents: PendingEvent[] = [];

function hasAnalyticsConsent() {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === "accepted";
  } catch {
    return false;
  }
}

function sendEvent(name: string, params: AnalyticsParams) {
  if (!window.gtag) return false;
  window.gtag("event", name, params);
  window.dispatchEvent(new CustomEvent("pixeltools:event", { detail: { name, params } }));
  return true;
}

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;

  const consented = hasAnalyticsConsent();

  // A tool_view can fire before the consent banner is answered or before GA4
  // finishes initializing. Keep it only in memory and send it if consent is
  // granted; nothing leaves the device before consent.
  if (!consented) {
    if (name === "tool_view") pendingEvents.push({ name, params });
    return;
  }

  if (!sendEvent(name, params)) pendingEvents.push({ name, params });
}

export function flushPendingAnalyticsEvents() {
  if (typeof window === "undefined" || !hasAnalyticsConsent() || !window.gtag) return;
  const queued = pendingEvents.splice(0, pendingEvents.length);
  queued.forEach(({ name, params }) => sendEvent(name, params));
}

export function clearPendingAnalyticsEvents() {
  pendingEvents.length = 0;
}
