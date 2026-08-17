"use client";

import { useEffect, useRef, useState } from "react";
import { openPdfDocument, renderPageToCanvas } from "@/lib/pdf/pdfjs";
import { readFileBytes } from "@/lib/pdf/validate";
import { signPdf } from "@/lib/pdf/sign";
import { toToolError } from "@/lib/pdf/errors";

export default function SignatureWorkspace({ file, password = "", onComplete, onCancel }) {
  const [pageCount, setPageCount] = useState(1);
  const [pageIndex, setPageIndex] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const [pageSize, setPageSize] = useState({ width: 612, height: 792 });
  const [mode, setMode] = useState("draw");
  const [typed, setTyped] = useState("Jane Doe");
  const [signatureUrl, setSignatureUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [pdfPassword, setPdfPassword] = useState(password);
  const [box, setBox] = useState({ x: 8, y: 78, w: 34, h: 12 });
  const drawRef = useRef(null);
  const drawing = useRef(false);
  const previewRef = useRef(null);
  const drag = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const bytes = await readFileBytes(file);
        const pdf = await openPdfDocument(bytes, pdfPassword);
        if (cancelled) return;
        setPageCount(pdf.numPages);
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        setPageSize({ width: viewport.width, height: viewport.height });
        const rendered = await renderPageToCanvas(page, 1.3);
        if (!cancelled) setPreviewUrl(rendered.canvas.toDataURL("image/jpeg", 0.82));
      } catch (err) {
        const converted = toToolError(err);
        setError({ title: converted.message, hint: converted.hint });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file, pdfPassword]);

  useEffect(() => {
    if (!file || pageIndex < 0) return;
    let cancelled = false;
    (async () => {
      const bytes = await readFileBytes(file);
        const pdf = await openPdfDocument(bytes, pdfPassword);
      const page = await pdf.getPage(pageIndex + 1);
      const viewport = page.getViewport({ scale: 1 });
      setPageSize({ width: viewport.width, height: viewport.height });
      const rendered = await renderPageToCanvas(page, 1.3);
      if (!cancelled) setPreviewUrl(rendered.canvas.toDataURL("image/jpeg", 0.82));
    })();
    return () => {
      cancelled = true;
    };
  }, [file, pdfPassword, pageIndex]);

  useEffect(() => {
    const canvas = drawRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [mode]);

  function pointerPos(event, target) {
    const rect = target.getBoundingClientRect();
    const point = "touches" in event ? event.touches[0] : event;
    return {
      x: point.clientX - rect.left,
      y: point.clientY - rect.top,
    };
  }

  function startDraw(event) {
    drawing.current = true;
    const canvas = drawRef.current;
    const ctx = canvas.getContext("2d");
    const pos = pointerPos(event, canvas);
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function moveDraw(event) {
    if (!drawing.current) return;
    event.preventDefault();
    const canvas = drawRef.current;
    const ctx = canvas.getContext("2d");
    const pos = pointerPos(event, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function endDraw() {
    drawing.current = false;
  }

  function useDrawnSignature() {
    const canvas = drawRef.current;
    setSignatureUrl(canvas.toDataURL("image/png"));
  }

  function useTypedSignature() {
    const canvas = document.createElement("canvas");
    canvas.width = 700;
    canvas.height = 220;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111";
    ctx.font = "72px 'Snell Roundhand', 'Segoe Script', 'Bradley Hand', cursive";
    ctx.textBaseline = "middle";
    ctx.fillText(typed || "Signature", 24, canvas.height / 2);
    setSignatureUrl(canvas.toDataURL("image/png"));
  }

  async function handleUploadedSignature(fileList) {
    const image = fileList?.[0];
    if (!image) return;
    const url = URL.createObjectURL(image);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      setSignatureUrl(canvas.toDataURL("image/png"));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function startMove(event) {
    const pos = pointerPos(event, previewRef.current);
    drag.current = { x: pos.x, y: pos.y, box: { ...box } };
  }

  function moveBox(event) {
    if (!drag.current || !previewRef.current) return;
    event.preventDefault();
    const rect = previewRef.current.getBoundingClientRect();
    const pos = pointerPos(event, previewRef.current);
    const dx = ((pos.x - drag.current.x) / rect.width) * 100;
    const dy = ((pos.y - drag.current.y) / rect.height) * 100;
    setBox({
      ...drag.current.box,
      x: clamp(drag.current.box.x + dx, 0, 100 - drag.current.box.w),
      y: clamp(drag.current.box.y + dy, 0, 100 - drag.current.box.h),
    });
  }

  function endMove() {
    drag.current = null;
  }

  async function saveSigned() {
    if (!signatureUrl) {
      setError({ title: "Create a signature first.", hint: "Draw, type, or upload a signature image." });
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const png = await fetch(signatureUrl).then((res) => res.arrayBuffer());
      const output = await signPdf(
        file,
        {
          password: pdfPassword,
          pageIndex,
          signaturePng: new Uint8Array(png),
          x: (box.x / 100) * pageSize.width,
          y: ((100 - box.y - box.h) / 100) * pageSize.height,
          width: (box.w / 100) * pageSize.width,
          height: (box.h / 100) * pageSize.height,
        },
        setStatus,
      );
      onComplete(output);
    } catch (err) {
      const converted = toToolError(err);
      setError({ title: converted.message, hint: converted.hint });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>Place your signature</h2>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Start over
        </button>
      </div>

      <label className="field">
        PDF password if the file is locked
        <input
          type="password"
          autoComplete="current-password"
          value={pdfPassword}
          onChange={(event) => setPdfPassword(event.target.value)}
        />
      </label>

      <div className="field">
        <span>Signature source</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" className={`btn ${mode === "draw" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("draw")}>
            Draw
          </button>
          <button type="button" className={`btn ${mode === "type" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("type")}>
            Type
          </button>
          <button type="button" className={`btn ${mode === "upload" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("upload")}>
            Upload image
          </button>
        </div>
      </div>

      {mode === "draw" && (
        <div className="field">
          <span>Draw with your finger or mouse</span>
          <canvas
            ref={drawRef}
            className="draw-pad"
            width={640}
            height={180}
            onMouseDown={startDraw}
            onMouseMove={moveDraw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={moveDraw}
            onTouchEnd={endDraw}
          />
          <button type="button" className="btn btn-secondary" onClick={useDrawnSignature}>
            Use this drawing
          </button>
        </div>
      )}

      {mode === "type" && (
        <div className="field">
          <label>
            Typed signature
            <input value={typed} onChange={(event) => setTyped(event.target.value)} />
          </label>
          <button type="button" className="btn btn-secondary" onClick={useTypedSignature}>
            Use typed signature
          </button>
        </div>
      )}

      {mode === "upload" && (
        <label className="field">
          Signature image
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleUploadedSignature(event.target.files)} />
        </label>
      )}

      <div className="field">
        <span>Page {pageIndex + 1} of {pageCount}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="btn btn-secondary" disabled={pageIndex === 0} onClick={() => setPageIndex((value) => value - 1)}>
            Previous page
          </button>
          <button type="button" className="btn btn-secondary" disabled={pageIndex >= pageCount - 1} onClick={() => setPageIndex((value) => value + 1)}>
            Next page
          </button>
        </div>
      </div>

      <div
        className="sign-preview"
        ref={previewRef}
        onMouseMove={moveBox}
        onMouseUp={endMove}
        onMouseLeave={endMove}
        onTouchMove={moveBox}
        onTouchEnd={endMove}
      >
        {/* PDF previews are generated in the browser and cannot use next/image */}
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt={`PDF page ${pageIndex + 1}`} />
        ) : (
          <p className="help">Loading page preview…</p>
        )}
        {signatureUrl && (
          <button
            type="button"
            className="sign-box"
            aria-label="Move signature"
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.w}%`,
              height: `${box.h}%`,
              backgroundImage: `url(${signatureUrl})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            onMouseDown={startMove}
            onTouchStart={startMove}
          />
        )}
      </div>

      <label className="field">
        Signature size
        <input
          type="range"
          min="12"
          max="60"
          value={box.w}
          onChange={(event) => {
            const w = Number(event.target.value);
            const h = Math.max(8, w * 0.35);
            setBox((current) => ({
              ...current,
              w,
              h,
              x: clamp(current.x, 0, 100 - w),
              y: clamp(current.y, 0, 100 - h),
            }));
          }}
        />
      </label>

      {error && (
        <div className="alert alert-error" role="alert">
          <strong>{error.title}</strong>
          {error.hint}
        </div>
      )}

      {busy && (
        <div className="status-panel">
          <div className="spinner" />
          <strong>{status || "Embedding signature…"}</strong>
        </div>
      )}

      <div className="sticky-actions">
        <button type="button" className="btn btn-primary btn-full" onClick={saveSigned} disabled={busy || !signatureUrl}>
          Save signed PDF
        </button>
      </div>
    </div>
  );
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
