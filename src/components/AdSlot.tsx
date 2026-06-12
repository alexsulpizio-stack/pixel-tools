interface AdSlotProps {
  variant: "banner" | "box";
}

/**
 * Placeholder ad container. Once approved for an ad network (e.g. AdSense),
 * replace the inner placeholder with the network's snippet. Keeping fixed
 * dimensions prevents layout shift, which ad networks score you on.
 */
export function AdSlot({ variant }: AdSlotProps) {
  return (
    <div className={`adslot adslot--${variant}`} aria-hidden="true">
      <span>Ad</span>
    </div>
  );
}
