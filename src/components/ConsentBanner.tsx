import { useEffect, useState } from "react";
import { CONSENT_STORAGE_KEY, type ConsentChoice } from "../lib/integrations";

export function ConsentBanner() {
  // Keep the server render and the browser's first render identical. Reading
  // localStorage during useState initialization made returning visitors render
  // no banner in the browser while the prerendered HTML still contained one,
  // which triggered React hydration error #418.
  const [choice, setChoice] = useState<ConsentChoice | null | undefined>(undefined);

  useEffect(() => {
    try {
      setChoice((localStorage.getItem(CONSENT_STORAGE_KEY) as ConsentChoice | null) ?? null);
    } catch {
      setChoice(null);
    }
  }, []);

  useEffect(() => {
    if (choice) {
      window.dispatchEvent(new CustomEvent("pixeltools:consent", { detail: choice }));
    }
  }, [choice]);

  const save = (value: ConsentChoice) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, value);
    } catch {
      // Storage can be unavailable in private browsing; the in-memory choice
      // still applies for the current page load.
    }
    setChoice(value);
  };

  // undefined means the browser has not checked stored consent yet. Rendering
  // nothing here matches the server output and prevents a flash for returning
  // visitors who already made a choice.
  if (choice === undefined || choice) return null;

  return (
    <aside className="consent-banner" role="dialog" aria-label="Privacy choices">
      <p>We use optional analytics and advertising cookies to keep PixelTools free. Your files are always processed locally.</p>
      <div>
        <button className="btn btn--primary btn--sm" onClick={() => save("accepted")}>Accept</button>
        <button className="btn btn--ghost btn--sm" onClick={() => save("declined")}>Decline</button>
      </div>
    </aside>
  );
}
