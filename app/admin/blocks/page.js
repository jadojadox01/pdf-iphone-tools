import { BLOCK_GROUPS, RIBBON_VARIANTS } from "@/lib/cms/blocks";

export const metadata = { title: "Reusable blocks", robots: { index: false, follow: false } };

export default function AdminBlocksPage() {
  return (
    <div className="admin-page">
      <h1>Reusable blocks</h1>
      <p className="help">
        Guides are built from these blocks in the editor. Use only the ones that help the reader. Ribbons stay visually
        consistent across the site — do not invent a one-off style for a single article.
      </p>
      <section className="section">
        <h2>Ribbons</h2>
        {RIBBON_VARIANTS.map((variant) => (
          <aside className={`ribbon ribbon-${variant}`} key={variant}>
            <strong>{variant}</strong>
            <p>Use this when that kind of note actually helps. Delete it when it does not.</p>
          </aside>
        ))}
      </section>
      {BLOCK_GROUPS.map((group) => (
        <section className="section" key={group.id}>
          <h2>{group.label}</h2>
          <ul>
            {group.types.map((type) => (
              <li key={type}>{type}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
