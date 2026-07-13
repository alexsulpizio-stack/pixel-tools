interface AdSlotProps {
  variant: "banner" | "box";
}

/**
 * Ad container. While the site is pending ad-network approval this renders
 * nothing, so no empty "Ad" placeholders are shown to reviewers or visitors.
 * AdSense auto-ads (and networks like Ezoic) place their own units, so no
 * manual slot markup is required here yet. Flip ADS_ENABLED to true and drop
 * in the network snippet once a manual placement is wanted.
 */
const ADS_ENABLED = false;

export function AdSlot({ variant }: AdSlotProps) {
  if (!ADS_ENABLED) return null;
  return <div className={`adslot adslot--${variant}`} aria-hidden="true" />;
}
