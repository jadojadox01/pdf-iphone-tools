"use client";

import { useRef, useState } from "react";
import { formatBytes, MAX_FILE_BYTES } from "@/lib/site";

export default function FileUploader({
  files,
  onFiles,
  onError,
  multiple = false,
  accept = "application/pdf,.pdf",
  label = "Choose PDF",
  dropTitle,
  hint,
}) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const help =
    hint || "Files up to 25 MB. Processed in your browser — nothing is uploaded to our servers.";

  function addFiles(list) {
    const incoming = Array.from(list || []);
    if (!incoming.length) return;
    const empty = incoming.find((file) => file.size <= 0);
    if (empty) {
      onError?.({
        code: "INVALID_FILE",
        title: "The selected file is empty.",
        hint: "Choose a different file.",
      });
      return;
    }
    const tooLarge = incoming.find((file) => file.size > MAX_FILE_BYTES);
    if (tooLarge) {
      onError?.({
        code: "TOO_LARGE",
        title: `${tooLarge.name} is over the ${formatBytes(MAX_FILE_BYTES)} limit.`,
        hint: "Choose a smaller file, or compress it first.",
      });
      return;
    }
    onError?.(null);
    if (multiple) {
      onFiles([...(files || []), ...incoming]);
    } else {
      onFiles(incoming.slice(0, 1));
    }
  }

  return (
    <div>
      <div
        className={`uploader${drag ? " drag" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDrag(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        <p style={{ fontWeight: 800, margin: "0 0 6px" }}>
          {dropTitle || (multiple ? "Add files" : "Drop a file here or tap to choose")}
        </p>
        <p className="help" style={{ margin: "0 0 16px" }}>
          {help}
        </p>
        <button type="button" className="btn btn-primary" onClick={() => inputRef.current?.click()}>
          {label}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <p className="help" style={{ marginTop: 12 }}>
          Max {formatBytes(MAX_FILE_BYTES)} per file. On iPhone, use Files, iCloud Drive, or another app.
        </p>
      </div>

      {!!files?.length && (
        <div className="file-list">
          {files.map((file, index) => (
            <div className="file-chip" key={`${file.name}-${index}`}>
              <div>
                <strong>{file.name}</strong>
                <div className="help">{formatBytes(file.size)}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {multiple && (
                  <>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      aria-label={`Move ${file.name} up`}
                      disabled={index === 0}
                      onClick={() => {
                        const next = [...files];
                        const [item] = next.splice(index, 1);
                        next.splice(index - 1, 0, item);
                        onFiles(next);
                      }}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      aria-label={`Move ${file.name} down`}
                      disabled={index === files.length - 1}
                      onClick={() => {
                        const next = [...files];
                        const [item] = next.splice(index, 1);
                        next.splice(index + 1, 0, item);
                        onFiles(next);
                      }}
                    >
                      Down
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => onFiles(files.filter((_, itemIndex) => itemIndex !== index))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {!multiple && (
            <button type="button" className="btn btn-ghost" onClick={() => inputRef.current?.click()}>
              Replace file
            </button>
          )}
        </div>
      )}
    </div>
  );
}
