"use client";

import { useEffect, useState } from "react";
import FileUploader from "./FileUploader";
import SignatureWorkspace from "./SignatureWorkspace";
import { takePendingFiles } from "@/lib/pending-files";
import { runTool } from "@/lib/pdf/run";
import { downloadBlob, revokeUrl } from "@/lib/pdf/download";
import { formatBytes } from "@/lib/site";

const defaultOptions = {
  quality: "recommended",
  pageMode: "all",
  pageRange: "",
  mode: "extract",
  level: "recommended",
  angle: 90,
  password: "",
  confirm: "",
  splitEachRange: true,
};

export default function ToolWorkspace({ tool }) {
  const [files, setFiles] = useState([]);
  const [options, setOptions] = useState(defaultOptions);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const pending = takePendingFiles(tool.slug);
    if (pending.length) setFiles(pending);
  }, [tool.slug]);

  useEffect(() => {
    return () => {
      if (result?.url) revokeUrl(result.url);
    };
  }, [result]);

  const canRun = tool.multiple ? files.length >= 2 : files.length === 1;

  function resetAll() {
    if (result?.url) revokeUrl(result.url);
    setFiles([]);
    setResult(null);
    setError(null);
    setStatus("");
    setBusy(false);
    setOptions(defaultOptions);
  }

  async function processFiles() {
    if (!canRun || busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setStatus("Starting…");
    try {
      const output = await runTool(tool.slug, files, options, setStatus);
      const url = URL.createObjectURL(output.blob);
      setResult({ ...output, url });
      setStatus("");
    } catch (err) {
      setError({
        code: err.code || "CONVERSION_FAILED",
        title: err.message || "Processing failed",
        hint: err.hint || "Check the file and try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  if (tool.slug === "sign-pdf") {
    return (
      <div className="workspace">
        {!files.length || result ? (
          <>
            <FileUploader files={files} onFiles={setFiles} />
            {result && (
              <ResultPanel
                result={result}
                onDownload={() => downloadBlob(result.blob, result.filename)}
                onReset={resetAll}
              />
            )}
          </>
        ) : (
          <SignatureWorkspace
            file={files[0]}
            password={options.password}
            onCancel={resetAll}
            onComplete={(output) => {
              const url = URL.createObjectURL(output.blob);
              setResult({ ...output, url });
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="workspace">
      <h2 style={{ marginTop: 0 }}>{tool.cta}</h2>
      <p className="help">{tool.afterUpload}</p>

      <FileUploader
        files={files}
        onFiles={(next) => {
          setFiles(next);
          setResult(null);
          setError(null);
        }}
        multiple={tool.multiple}
        label={tool.multiple ? "Add PDFs" : "Choose PDF"}
      />

      {canRun && !result && (
        <>
          <OptionsPanel tool={tool} options={options} setOptions={setOptions} />
          {(error?.code === "PASSWORD_REQUIRED" || error?.code === "INCORRECT_PASSWORD") && (
            <label className="field">
              PDF password
              <input
                type="password"
                autoComplete="current-password"
                value={options.password}
                onChange={(event) => setOptions((current) => ({ ...current, password: event.target.value }))}
              />
            </label>
          )}
        </>
      )}

      {error && (
        <div className="alert alert-error" role="alert">
          <strong>{error.title}</strong>
          <span>{error.hint}</span>
        </div>
      )}

      {busy && (
        <div className="status-panel" aria-live="polite">
          <div className="spinner" aria-hidden="true" />
          <strong>{status || "Processing PDF…"}</strong>
          <p className="help">Keep this page open until the file is ready.</p>
        </div>
      )}

      {result && !busy && (
        <ResultPanel
          result={result}
          onDownload={() => downloadBlob(result.blob, result.filename)}
          onReset={resetAll}
        />
      )}

      {canRun && !busy && !result && (
        <div className="sticky-actions">
          <button type="button" className="btn btn-primary btn-full" onClick={processFiles}>
            {tool.cta}
          </button>
        </div>
      )}
    </div>
  );
}

function OptionsPanel({ tool, options, setOptions }) {
  const set = (key, value) => setOptions((current) => ({ ...current, [key]: value }));

  if (tool.slug === "pdf-to-jpg") {
    return (
      <div>
        <fieldset className="field">
          <legend>Pages</legend>
          <label>
            <input
              type="radio"
              name="pageMode"
              checked={options.pageMode === "all"}
              onChange={() => set("pageMode", "all")}
            />{" "}
            All pages
          </label>
          <label>
            <input
              type="radio"
              name="pageMode"
              checked={options.pageMode === "selected"}
              onChange={() => set("pageMode", "selected")}
            />{" "}
            Selected pages
          </label>
          {options.pageMode === "selected" && (
            <input
              value={options.pageRange}
              onChange={(event) => set("pageRange", event.target.value)}
              placeholder="1-3, 5, 8-10"
              aria-label="Page range"
            />
          )}
        </fieldset>
        <label className="field">
          Image quality
          <select value={options.quality} onChange={(event) => set("quality", event.target.value)}>
            <option value="high">High</option>
            <option value="recommended">Recommended</option>
            <option value="small">Smaller file</option>
          </select>
        </label>
      </div>
    );
  }

  if (tool.slug === "pdf-to-ppt") {
    return (
      <div className="alert alert-info">
        <strong>How this conversion works</strong>
        Each PDF page is placed on a PowerPoint slide as an image so the layout stays intact. Text will not be independently editable.
      </div>
    );
  }

  if (tool.slug === "split-pdf") {
    return (
      <div>
        <label className="field">
          Split mode
          <select value={options.mode} onChange={(event) => set("mode", event.target.value)}>
            <option value="extract">Extract selected pages into one PDF</option>
            <option value="ranges">Split by page ranges</option>
            <option value="every">Split every page into its own PDF</option>
          </select>
        </label>
        {options.mode !== "every" && (
          <label className="field">
            Pages
            <input
              value={options.pageRange}
              onChange={(event) => set("pageRange", event.target.value)}
              placeholder="1-3, 5, 8-10"
            />
            <span className="help">Example: 1-3, 5, 8-10</span>
          </label>
        )}
      </div>
    );
  }

  if (tool.slug === "compress-pdf") {
    return (
      <label className="field">
        Compression level
        <select value={options.level} onChange={(event) => set("level", event.target.value)}>
          <option value="low">Low compression / high quality</option>
          <option value="recommended">Recommended</option>
          <option value="strong">Strong compression / smaller file</option>
        </select>
        {options.level === "strong" && (
          <span className="help">
            Strong compression rebuilds pages as images. Text may no longer be selectable.
          </span>
        )}
      </label>
    );
  }

  if (tool.slug === "rotate-pdf") {
    return (
      <div>
        <label className="field">
          Rotation
          <select value={options.angle} onChange={(event) => set("angle", Number(event.target.value))}>
            <option value={90}>90°</option>
            <option value={180}>180°</option>
            <option value={270}>270°</option>
          </select>
        </label>
        <fieldset className="field">
          <legend>Pages</legend>
          <label>
            <input
              type="radio"
              name="rotatePages"
              checked={options.pageMode === "all"}
              onChange={() => set("pageMode", "all")}
            />{" "}
            All pages
          </label>
          <label>
            <input
              type="radio"
              name="rotatePages"
              checked={options.pageMode === "selected"}
              onChange={() => set("pageMode", "selected")}
            />{" "}
            Selected pages
          </label>
          {options.pageMode === "selected" && (
            <input
              value={options.pageRange}
              onChange={(event) => set("pageRange", event.target.value)}
              placeholder="1, 3-4"
            />
          )}
        </fieldset>
      </div>
    );
  }

  if (tool.slug === "protect-pdf") {
    return (
      <div>
        <label className="field">
          Password
          <input
            type="password"
            autoComplete="new-password"
            value={options.password}
            onChange={(event) => set("password", event.target.value)}
          />
        </label>
        <label className="field">
          Confirm password
          <input
            type="password"
            autoComplete="new-password"
            value={options.confirm}
            onChange={(event) => set("confirm", event.target.value)}
          />
        </label>
        <p className="help">The password stays on this device. If you lose it, the file cannot be recovered here.</p>
      </div>
    );
  }

  if (tool.slug === "unlock-pdf") {
    return (
      <label className="field">
        Current password
        <input
          type="password"
          autoComplete="current-password"
          value={options.password}
          onChange={(event) => set("password", event.target.value)}
        />
        <span className="help">Required. This tool does not bypass encryption.</span>
      </label>
    );
  }

  return null;
}

function ResultPanel({ result, onDownload, onReset }) {
  const meta = result.meta || {};
  let sizeNote = null;
  if (typeof meta.originalSize === "number") {
    sizeNote = meta.increased
      ? `Compression did not reduce the file. Original ${formatBytes(meta.originalSize)} → ${formatBytes(meta.compressedSize)}.`
      : `Original ${formatBytes(meta.originalSize)} → ${formatBytes(meta.compressedSize)} (${meta.reduction}% smaller).`;
  }

  return (
    <div className="alert alert-ok">
      <strong>Your file is ready</strong>
      <p style={{ margin: "8px 0" }}>
        {result.filename}
        <br />
        {result.blob?.type || result.mime} · {formatBytes(result.blob.size)}
      </p>
      {sizeNote && <p>{sizeNote}</p>}
      {meta.note && <p>{meta.note}</p>}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        <button type="button" className="btn btn-primary" onClick={onDownload}>
          {meta.bundled ? "Download ZIP" : "Download"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          Process another file
        </button>
      </div>
    </div>
  );
}
