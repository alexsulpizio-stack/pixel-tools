import { useEffect } from "react";

export function usePageMeta(title: string, description: string, noindex = false) {
  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://usepixeltools.com${location.pathname}`);
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noindex && !robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    if (robots) {
      if (noindex) robots.content = "noindex,follow";
      else robots.remove();
    }
  }, [title, description, noindex]);
}
