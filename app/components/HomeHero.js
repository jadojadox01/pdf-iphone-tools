"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getTools } from "@/lib/tools";
import { setPendingFiles } from "@/lib/pending-files";

export default function HomeHero() {
  const inputRef = useRef(null);
  const router = useRouter();
  const [file, setFile] = useState(null);
  const tools = getTools();

  function chooseTool(slug) {
    if (file) setPendingFiles([file], slug);
    router.push(`/${slug}`);
  }

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-card">
          <div className="kicker">
            <span>No install</span>
            <span>•</span>
            <span>Files stay in your browser</span>
          </div>
          <h1>Simple PDF tools for every device</h1>
          <p className="lede">
            Convert, merge, split, and compress PDFs in your browser. Open a tool, choose a file, download the result.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => inputRef.current?.click()}>
              Choose a PDF
            </button>
            <a className="btn btn-secondary" href="#tools">
              Browse tools
            </a>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            hidden
            onChange={(event) => {
              const next = event.target.files?.[0];
              setFile(next || null);
              event.target.value = "";
            }}
          />
          {file && (
            <div className="chooser">
              <p>
                <strong>{file.name}</strong> is ready. What do you want to do?
              </p>
              {tools.map((tool) => (
                <button
                  key={tool.slug}
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => chooseTool(tool.slug)}
                >
                  {tool.name}
                </button>
              ))}
            </div>
          )}
          <p className="help">Your file is processed locally in your browser and is not uploaded to PDFFlow&apos;s servers for normal tool processing.</p>
        </div>
      </div>
    </section>
  );
}
