"use client";

import { BLOCK_GROUPS, BLOCK_LABELS, emptyBlock, starterOutline, RIBBON_VARIANTS } from "@/lib/cms/blocks";

export default function BlockEditor({ value, onChange }) {
  const blocks = Array.isArray(value) ? value : [];

  function setBlocks(next) {
    onChange(next);
  }

  function update(index, data) {
    setBlocks(blocks.map((block, i) => (i === index ? { ...block, data: { ...block.data, ...data } } : block)));
  }

  function move(index, dir) {
    const next = [...blocks];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setBlocks(next);
  }

  return (
    <div className="block-editor">
      <p className="help">
        Add a block only if it helps a real person finish the task. Empty placeholders make the page worse, not more complete.
      </p>
      <div className="hero-actions" style={{ marginBottom: 12, flexWrap: "wrap" }}>
        <select
          defaultValue=""
          aria-label="Add block"
          onChange={(event) => {
            if (!event.target.value) return;
            setBlocks([...blocks, emptyBlock(event.target.value)]);
            event.target.value = "";
          }}
        >
          <option value="">Add block</option>
          {BLOCK_GROUPS.map((group) => (
            <optgroup key={group.id} label={group.label}>
              {group.types.map((type) => (
                <option key={type} value={type}>
                  {BLOCK_LABELS[type]}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <select
          defaultValue=""
          aria-label="Insert outline"
          onChange={(event) => {
            if (!event.target.value) return;
            if (blocks.length && !window.confirm("Replace the current blocks with this outline? Only headings and empty instruction blocks are inserted — you still have to write them.")) {
              event.target.value = "";
              return;
            }
            setBlocks(starterOutline(event.target.value));
            event.target.value = "";
          }}
        >
          <option value="">Insert outline (optional)</option>
          <option value="HOW_TO">How-to outline</option>
          <option value="TROUBLESHOOTING">Troubleshooting outline</option>
          <option value="EXPLAINER">Explainer outline</option>
          <option value="COMPARISON">Comparison outline</option>
        </select>
      </div>
      {blocks.map((block, index) => (
        <div className="workspace" key={block.id || index} style={{ marginBottom: 12 }}>
          <div className="admin-header">
            <strong>{BLOCK_LABELS[block.type] || block.type}</strong>
            <div className="row-actions">
              <button type="button" onClick={() => move(index, -1)}>
                Up
              </button>
              <button type="button" onClick={() => move(index, 1)}>
                Down
              </button>
              <button type="button" onClick={() => setBlocks(blocks.filter((_, i) => i !== index))}>
                Remove
              </button>
            </div>
          </div>
          <BlockFields block={block} onChange={(data) => update(index, data)} />
        </div>
      ))}
    </div>
  );
}

function BlockFields({ block, onChange }) {
  const data = block.data || {};
  switch (block.type) {
    case "hero":
      return (
        <>
          <label className="field">Title<input value={data.title || ""} onChange={(e) => onChange({ title: e.target.value })} /></label>
          <label className="field">Summary<textarea value={data.summary || ""} onChange={(e) => onChange({ summary: e.target.value })} /></label>
        </>
      );
    case "heading":
      return (
        <>
          <label className="field">
            Level
            <select value={data.level || 2} onChange={(e) => onChange({ level: Number(e.target.value) })}>
              <option value={2}>H2</option>
              <option value={3}>H3</option>
            </select>
          </label>
          <label className="field">Text<input value={data.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></label>
        </>
      );
    case "ribbon":
      return (
        <>
          <label className="field">
            Variant
            <select value={data.variant || "tip"} onChange={(e) => onChange({ variant: e.target.value })}>
              {RIBBON_VARIANTS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="field">Title<input value={data.title || ""} onChange={(e) => onChange({ title: e.target.value })} /></label>
          <label className="field">Text<textarea value={data.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></label>
          <label className="field">Optional link<input value={data.href || ""} onChange={(e) => onChange({ href: e.target.value })} /></label>
          <label className="field">Link label<input value={data.cta || ""} onChange={(e) => onChange({ cta: e.target.value })} /></label>
        </>
      );
    case "steps":
      return (
        <Repeater
          items={data.items || []}
          onChange={(items) => onChange({ items })}
          fields={["title", "text", "ribbonVariant", "ribbonTitle", "ribbonText"]}
        />
      );
    case "example":
      return (
        <>
          <label className="field">Title<input value={data.title || ""} onChange={(e) => onChange({ title: e.target.value })} /></label>
          <label className="field">Situation<textarea value={data.situation || ""} onChange={(e) => onChange({ situation: e.target.value })} /></label>
          <label className="field">What you do / result<textarea value={data.result || ""} onChange={(e) => onChange({ result: e.target.value })} /></label>
          <label className="field">Notes<textarea value={data.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></label>
        </>
      );
    case "howItWorks":
      return (
        <>
          <label className="field">Title<input value={data.title || ""} onChange={(e) => onChange({ title: e.target.value })} /></label>
          <label className="field">Explanation<textarea value={data.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></label>
        </>
      );
    case "options":
      return (
        <>
          <label className="field">Title<input value={data.title || ""} onChange={(e) => onChange({ title: e.target.value })} /></label>
          <Repeater items={data.items || []} onChange={(items) => onChange({ items })} fields={["name", "text"]} />
        </>
      );
    case "faq":
      return <Repeater items={data.items || []} onChange={(items) => onChange({ items })} fields={["q", "a"]} />;
    case "troubleshooting":
      return <Repeater items={data.items || []} onChange={(items) => onChange({ items })} fields={["problem", "cause", "solution"]} />;
    case "comparison":
      return <ComparisonFields data={data} onChange={onChange} />;
    case "list":
    case "orderedList":
    case "checklist":
      return (
        <label className="field">
          Items (one per line)
          <textarea value={(data.items || []).join("\n")} onChange={(e) => onChange({ items: e.target.value.split("\n") })} />
        </label>
      );
    case "toolCta":
      return (
        <>
          <label className="field">Tool slug<input value={data.toolSlug || ""} onChange={(e) => onChange({ toolSlug: e.target.value })} /></label>
          <label className="field">Title<input value={data.title || ""} onChange={(e) => onChange({ title: e.target.value })} /></label>
          <label className="field">Text<textarea value={data.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></label>
        </>
      );
    case "cta":
      return (
        <>
          <label className="field">Label<input value={data.label || ""} onChange={(e) => onChange({ label: e.target.value })} /></label>
          <label className="field">URL<input value={data.href || ""} onChange={(e) => onChange({ href: e.target.value })} /></label>
          <label className="field">Text<textarea value={data.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></label>
        </>
      );
    case "image":
      return (
        <>
          <label className="field">Image URL<input value={data.url || ""} onChange={(e) => onChange({ url: e.target.value })} /></label>
          <label className="field">Alt text<input value={data.alt || ""} onChange={(e) => onChange({ alt: e.target.value })} /></label>
          <label className="field">Caption<input value={data.caption || ""} onChange={(e) => onChange({ caption: e.target.value })} /></label>
        </>
      );
    case "prosCons":
      return (
        <>
          <label className="field">Pros (one per line)<textarea value={(data.pros || []).join("\n")} onChange={(e) => onChange({ pros: e.target.value.split("\n") })} /></label>
          <label className="field">Cons (one per line)<textarea value={(data.cons || []).join("\n")} onChange={(e) => onChange({ cons: e.target.value.split("\n") })} /></label>
        </>
      );
    case "divider":
    case "toc":
    case "relatedTools":
    case "relatedGuides":
      return <p className="help">Filled from headings or related items you attach on the Related tab. Leave it out if those links would be padding.</p>;
    default:
      return (
        <label className="field">
          Text
          <textarea value={data.text || data.summary || ""} onChange={(e) => onChange({ text: e.target.value })} />
        </label>
      );
  }
}

function ComparisonFields({ data, onChange }) {
  const headers = data.headers || ["Option", "Best for"];
  const rows = data.rows || [["", ""]];
  return (
    <div>
      <label className="field">
        Column headers (comma separated)
        <input value={headers.join(", ")} onChange={(e) => onChange({ headers: e.target.value.split(",").map((item) => item.trim()) })} />
      </label>
      {rows.map((row, index) => (
        <label className="field" key={index}>
          Row {index + 1} (use | between cells)
          <input
            value={row.join(" | ")}
            onChange={(e) => {
              const next = rows.map((item, i) => (i === index ? e.target.value.split("|").map((cell) => cell.trim()) : item));
              onChange({ rows: next });
            }}
          />
        </label>
      ))}
      <button type="button" className="btn btn-secondary" onClick={() => onChange({ rows: [...rows, headers.map(() => "")] })}>
        Add row
      </button>
    </div>
  );
}

function Repeater({ items, onChange, fields }) {
  return (
    <div>
      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: 8 }}>
          {fields.map((field) => (
            <label className="field" key={field}>
              {field}
              <textarea
                value={item[field] || ""}
                onChange={(event) => {
                  const next = items.map((row, i) => (i === index ? { ...row, [field]: event.target.value } : row));
                  onChange(next);
                }}
              />
            </label>
          ))}
          <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))}>
            Remove item
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => onChange([...items, Object.fromEntries(fields.map((field) => [field, ""]))])}
      >
        Add item
      </button>
    </div>
  );
}
