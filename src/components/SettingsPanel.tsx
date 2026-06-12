import type { OutputFormat, ProcessSettings } from "../lib/imageProcessor";

interface SettingsPanelProps {
  settings: ProcessSettings;
  onChange: (settings: ProcessSettings) => void;
}

const FORMATS: { value: OutputFormat; label: string }[] = [
  { value: "original", label: "Keep format" },
  { value: "webp", label: "WebP" },
  { value: "jpeg", label: "JPEG" },
  { value: "png", label: "PNG" },
];

const SIZE_PRESETS: { value: number; label: string }[] = [
  { value: 0, label: "Original" },
  { value: 2560, label: "2560px" },
  { value: 1920, label: "1920px" },
  { value: 1280, label: "1280px" },
  { value: 800, label: "800px" },
];

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const qualityDisabled = settings.format === "png";

  return (
    <div className="settings">
      <div className="settings__group">
        <span className="settings__label">Output format</span>
        <div className="segmented">
          {FORMATS.map((f) => (
            <button
              key={f.value}
              className={`segmented__btn ${settings.format === f.value ? "segmented__btn--on" : ""}`}
              onClick={() => onChange({ ...settings, format: f.value })}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`settings__group ${qualityDisabled ? "settings__group--disabled" : ""}`}>
        <span className="settings__label">
          Quality <strong>{Math.round(settings.quality * 100)}%</strong>
        </span>
        <input
          type="range"
          min={10}
          max={100}
          value={Math.round(settings.quality * 100)}
          disabled={qualityDisabled}
          onChange={(e) => onChange({ ...settings, quality: Number(e.target.value) / 100 })}
        />
        {qualityDisabled && <span className="settings__note">PNG is lossless — quality doesn't apply</span>}
      </div>

      <div className="settings__group">
        <span className="settings__label">Max dimension</span>
        <div className="segmented">
          {SIZE_PRESETS.map((s) => (
            <button
              key={s.value}
              className={`segmented__btn ${settings.maxDimension === s.value ? "segmented__btn--on" : ""}`}
              onClick={() => onChange({ ...settings, maxDimension: s.value })}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
