import { formatBytes, savingsPercent, type ProcessedImage } from "../lib/imageProcessor";

interface ResultCardProps {
  image: ProcessedImage;
  onRemove: (id: string) => void;
}

export function ResultCard({ image, onRemove }: ResultCardProps) {
  const savings = savingsPercent(image.originalSize, image.outputSize);
  const grew = savings < 0;

  const download = () => {
    const a = document.createElement("a");
    a.href = image.previewUrl;
    a.download = image.outputName;
    a.click();
  };

  return (
    <div className="card">
      <img className="card__thumb" src={image.previewUrl} alt={image.outputName} loading="lazy" />
      <div className="card__body">
        <p className="card__name" title={image.outputName}>
          {image.outputName}
        </p>
        <p className="card__meta">
          {image.outputWidth}×{image.outputHeight} · {formatBytes(image.originalSize)} →{" "}
          <strong>{formatBytes(image.outputSize)}</strong>
        </p>
        <span className={`badge ${grew ? "badge--bad" : "badge--good"}`}>
          {grew ? `+${Math.abs(savings)}% larger` : `−${savings}% smaller`}
        </span>
      </div>
      <div className="card__actions">
        <button className="btn btn--primary btn--sm" onClick={download}>
          Download
        </button>
        <button className="btn btn--ghost btn--sm" onClick={() => onRemove(image.id)} aria-label="Remove">
          ✕
        </button>
      </div>
    </div>
  );
}
