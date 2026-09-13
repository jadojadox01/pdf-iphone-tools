"use client";

export default function ToolProgress({ percent = 0, status, tool }) {
  const value = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));
  const label = status || "Processing…";

  return (
    <div className="tool-progress" aria-live="polite" aria-busy="true">
      <div className="tool-progress-ring" style={{ "--progress": value }}>
        <svg viewBox="0 0 120 120" width="132" height="132" aria-hidden="true">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#e7edf6" strokeWidth="8" />
          <circle
            className="tool-progress-fill"
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={Math.max(0, 100 - value)}
          />
        </svg>
        <strong>{value}%</strong>
      </div>
      <h2>{tool?.cta || "Working on your file"}</h2>
      <p className="tool-progress-status">{label}</p>
      <div className="tool-progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label={label}>
        <span style={{ width: `${value}%` }} />
      </div>
      <p className="help">Keep this tab open until the file is ready. Processing stays in your browser.</p>
    </div>
  );
}
