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
            <span>Free</span>
            <span>•</span>
            <span>No installation</span>
            <span>•</span>
            <span>Works on iPhone</span>
          </div>
          <h1>Free PDF Tools for iPhone</h1>
          <p className="lede">
            Convert, merge, compress, split, sign, and manage PDFs directly from your browser — no app required.
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
          <p className="help">
            Files are processed in your browser and are not uploaded to our servers. Also works on iPad, Android, Windows, macOS, and Linux.
          </p>
        </div>
      </div>
    </section>
  );
}
