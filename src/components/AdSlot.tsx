import { ADS_SLOTS_ENABLED } from "../lib/adsConfig";

interface AdSlotProps {
  variant: "banner" | "box";
}

/**
 * Manual ad containers. Hidden while ADS_SLOTS_ENABLED is false so reviewers
 * never see empty "Ad" boxes. Ezoic/AdSense auto placements usually don't need
 * these; turn on and drop in unit markup when you want fixed slots.
 */
export function AdSlot({ variant }: AdSlotProps) {
  if (!ADS_SLOTS_ENABLED) return null;
  return <div className={`adslot adslot--${variant}`} aria-hidden="true" />;
}
