"use client";

import { useEffect, useState } from "react";
import FileUploader from "./FileUploader";
import SignatureWorkspace from "./SignatureWorkspace";
import ToolProgress from "./ToolProgress";
import ToolResult from "./ToolResult";
import { takePendingFiles } from "@/lib/pending-files";
import { runTool } from "@/lib/pdf/run";
import { downloadBlob, revokeUrl } from "@/lib/pdf/download";

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
  const [percent, setPercent] = useState(0);
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

  const minFiles = Number(tool.minFiles || (tool.multiple ? 2 : 1));
  const canRun = files.length >= minFiles;

  function resetAll() {
    if (result?.url) revokeUrl(result.url);
    setFiles([]);
    setResult(null);
    setError(null);
    setStatus("");
    setPercent(0);
    setBusy(false);
    setOptions(defaultOptions);
  }

  function onProgress(message, meta = {}) {
    if (message) setStatus(message);
    if (Number.isFinite(meta.percent)) setPercent(meta.percent);
  }

  async function processFiles() {
    if (!canRun || busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setPercent(3);
    setStatus("Starting…");
    try {
      const output = await runTool(tool.slug, files, options, onProgress);
      setPercent(100);
      const url = URL.createObjectURL(output.blob);
      setResult({ ...output, url });
      setStatus("");
    } catch (err) {
      const message = String(err?.message || "");
      const looksLikeStack = /\n\s+at\s+/.test(message);
      setError({
        code: err.code || "CONVERSION_FAILED",
        title: looksLikeStack || !message ? "Something went wrong while processing this file." : message,
        hint: err.hint || "Check the file and try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  if (tool.slug === "sign-pdf") {
    return (
      <div className="workspace">
        {busy ? <ToolProgress percent={percent} status={status} tool={tool} /> : null}
        {!busy && result ? (
          <ToolResult
            tool={tool}
            result={result}
            onDownload={() => downloadBlob(result.blob, result.filename)}
            onReset={resetAll}
          />
        ) : null}
        {!busy && !result && !files.length ? (
          <FileUploader files={files} onFiles={setFiles} onError={setError} />
        ) : null}
        {!busy && !result && files.length ? (
          <SignatureWorkspace
            file={files[0]}
            password={options.password}
            onCancel={resetAll}
            onProgress={onProgress}
            onBusy={setBusy}
            onComplete={(output) => {
              const url = URL.createObjectURL(output.blob);
              setPercent(100);
              setBusy(false);
              setResult({ ...output, url });
            }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="workspace">
      {busy ? <ToolProgress percent={percent} status={status} tool={tool} /> : null}

      {!busy && result ? (
        <ToolResult
          tool={tool}
          result={result}
          onDownload={() => downloadBlob(result.blob, result.filename)}
          onReset={resetAll}
        />
      ) : null}

      {!busy && !result ? (
        <>
          <h2 style={{ marginTop: 0 }}>{tool.cta}</h2>
          <p className="help">{tool.afterUpload}</p>
          {(tool.slug === "pdf-to-word" || tool.slug === "pdf-to-excel" || tool.slug === "pdf-to-ebook") && (
            <div className="alert alert-info">
              <strong>Scanned pages</strong>
              If a page has little or no embedded text, OCR reads the page image in your browser. Printed English works best. Check the download.
            </div>
          )}

          <FileUploader
            files={files}
            onFiles={(next) => {
              setFiles(next);
              setResult(null);
              setError(null);
            }}
            onError={setError}
            multiple={tool.multiple}
            accept={tool.accept}
            label={tool.chooseLabel || (tool.multiple ? "Add files" : "Choose file")}
            dropTitle={tool.dropTitle}
            hint={tool.pickerHint}
          />

          {canRun ? (
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
          ) : null}

          {error ? (
            <div className="alert alert-error" role="alert">
              <strong>{error.title}</strong>
              <span>{error.hint}</span>
            </div>
          ) : null}

          {canRun ? (
            <div className="sticky-actions">
              <button type="button" className="btn btn-primary btn-full" onClick={processFiles}>
                {tool.cta}
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function OptionsPanel({ tool, options, setOptions }) {
  const set = (key, value) => setOptions((current) => ({ ...current, [key]: value }));

  if (tool.slug === "pdf-to-jpg" || tool.slug === "pdf-to-png") {
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
          <span className="help">
            High keeps more detail. Recommended is the default. Smaller file makes a lighter image.
          </span>
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
          <span className="help">
            Extract keeps the chosen pages in one PDF. Ranges makes one PDF per range. Every page makes one PDF per sheet.
          </span>
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
        {options.level !== "strong" && (
          <span className="help">Recommended is the usual starting point. Low keeps more quality. The new size is shown after you run it.</span>
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
