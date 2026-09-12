import GuideForm from "../../../components/admin/GuideForm";

export const metadata = { title: "New guide", robots: { index: false, follow: false } };

export default function NewGuidePage() {
  return (
    <div className="admin-page">
      <h1>Create guide</h1>
      <p className="help">
        Title, keywords, and intent at the top. Write only the sections this problem needs. Publish stays locked until the quality checklist is complete.
      </p>
      <GuideForm />
    </div>
  );
}
