import { useEffect, useState } from "react";
import { CONSENT_STORAGE_KEY, type ConsentChoice } from "../lib/integrations";
export function ConsentBanner() {
  const [choice, setChoice] = useState<ConsentChoice | null>(() => { try { return (localStorage.getItem(CONSENT_STORAGE_KEY) as ConsentChoice | null) ?? null; } catch { return null; } });
  useEffect(() => { if (choice) window.dispatchEvent(new CustomEvent("pixeltools:consent", { detail: choice })); }, [choice]);
  if (choice) return null;
  const save = (value: ConsentChoice) => { try { localStorage.setItem(CONSENT_STORAGE_KEY, value); } catch { /* private browsing */ } setChoice(value); };
  return <aside className="consent-banner" role="dialog" aria-label="Privacy choices"><p>We use optional analytics and advertising cookies to keep PixelTools free. Your files are always processed locally.</p><div><button className="btn btn--primary btn--sm" onClick={() => save("accepted")}>Accept</button><button className="btn btn--ghost btn--sm" onClick={() => save("declined")}>Decline</button></div></aside>;
}
