/**
 * Affiliate partners used in guide CTAs.
 *
 * To start earning: join each program, then paste your tracking URL into
 * `affiliateUrl`. While `affiliateUrl` is empty, links go to the normal site
 * (still useful for readers; just no commission).
 *
 * Namecheap → Impact / Namecheap Affiliate
 * Canva → Canva Affiliate / Creator program
 */
export interface AffiliatePartner {
  id: string;
  name: string;
  /** Public landing page (used when affiliateUrl is empty). */
  destinationUrl: string;
  /** Your tracking link from the affiliate dashboard. */
  affiliateUrl: string;
}

export const AFFILIATE_PARTNERS = {
  namecheap: {
    id: "namecheap",
    name: "Namecheap",
    destinationUrl: "https://www.namecheap.com/",
    affiliateUrl: "",
  },
  canva: {
    id: "canva",
    name: "Canva",
    destinationUrl: "https://www.canva.com/",
    affiliateUrl: "",
  },
} as const satisfies Record<string, AffiliatePartner>;

export type AffiliateId = keyof typeof AFFILIATE_PARTNERS;

export function affiliateHref(id: AffiliateId): string {
  const p = AFFILIATE_PARTNERS[id];
  return p.affiliateUrl.trim() || p.destinationUrl;
}

/** Shown near affiliate CTAs (FTC). */
export const AFFILIATE_DISCLOSURE =
  "Some links may earn us a commission at no extra cost to you.";
