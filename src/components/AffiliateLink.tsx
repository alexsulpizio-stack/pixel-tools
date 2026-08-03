import type { ReactNode } from "react";
import { affiliateHref, type AffiliateId } from "../lib/affiliates";

interface AffiliateLinkProps {
  id: AffiliateId;
  children: ReactNode;
  className?: string;
}

/** External affiliate (or plain) link with required sponsored disclosure rel. */
export function AffiliateLink({ id, children, className }: AffiliateLinkProps) {
  return (
    <a
      href={affiliateHref(id)}
      className={className}
      target="_blank"
      rel="sponsored noopener noreferrer"
    >
      {children}
    </a>
  );
}
