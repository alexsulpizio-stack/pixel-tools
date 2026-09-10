import { Link, type LinkProps } from "react-router-dom";
import { trackEvent } from "../lib/integrations";

type TrackedToolLinkProps = LinkProps & {
  fromTool: string;
  toTool: string;
  destinationSlug: string;
};

export function TrackedToolLink({
  fromTool,
  toTool,
  destinationSlug,
  onClick,
  ...props
}: TrackedToolLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackEvent("related_tool_clicked", {
          from_tool: fromTool,
          to_tool: toTool,
          destination_slug: destinationSlug,
        });
        onClick?.(event);
      }}
    />
  );
}
