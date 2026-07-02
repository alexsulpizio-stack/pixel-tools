import { useCallback, useRef, useState } from "react";
import { ACCEPTED_TYPES } from "../lib/imageProcessor";

interface DropzoneProps {
  onFiles: (files: File[]) => void;
  busy?: boolean;
}

export function Dropzone({ onFiles, busy = false }: DropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list) return;
      const images = Array.from(list).filter((f) => ACCEPTED_TYPES.includes(f.type));
      if (images.length > 0) onFiles(images);
    },
    [onFiles]
  );

  return (
    <div
      className={`dropzone ${dragging ? "dropzone--active" : ""} ${busy ? "dropzone--busy" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="dropzone__icon">{busy ? "⏳" : "🖼️"}</div>
      <p className="dropzone__title">{busy ? "Processing…" : "Drop images here or click to browse"}</p>
      <p className="dropzone__hint">JPG · PNG · WebP · GIF · BMP · AVIF — processed locally, never uploaded</p>
    </div>
  );
}
