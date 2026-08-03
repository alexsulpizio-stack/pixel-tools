import type { ReactNode } from "react";
import { AFFILIATE_DISCLOSURE } from "../lib/affiliates";

interface AffiliateNoteProps {
  children: ReactNode;
}

/** Quiet inline callout for a single relevant affiliate suggestion. */
export function AffiliateNote({ children }: AffiliateNoteProps) {
  return (
    <aside className="affiliate-note">
      <p className="affiliate-note__body">{children}</p>
      <p className="affiliate-note__disclosure">{AFFILIATE_DISCLOSURE}</p>
    </aside>
  );
}
