/**
 * Ad network switch. Keep ADS_PROVIDER on "none" until a network is approved
 * and you've pasted their snippets. Then:
 *   - "adsense" — Google AdSense auto-ads (script already in index.html)
 *   - "ezoic"   — set EZOIC_PRIVACY_ID from your Ezoic dashboard, flip AdSlot on
 *
 * Do not enable two networks at once without their guidance (policy conflict).
 */
export type AdsProvider = "none" | "adsense" | "ezoic";

export const ADS_PROVIDER: AdsProvider = "none";

/** From Ezoic → EzoicAds → Ad Tester / privacy scripts (e.g. "########"). */
export const EZOIC_PRIVACY_ID = "";

/** Show manual AdSlot placeholders (wire network unit IDs inside AdSlot). */
export const ADS_SLOTS_ENABLED = false;
