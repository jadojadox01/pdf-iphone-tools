import GuideForm from "../../../components/admin/GuideForm";

export const metadata = { title: "New guide", robots: { index: false, follow: false } };

export default function NewGuidePage() {
  return (
    <div className="admin-page">
      <h1>Create guide</h1>
      <GuideForm />
    </div>
  );
}
