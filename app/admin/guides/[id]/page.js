import GuideForm from "../../../components/admin/GuideForm";

export const metadata = { title: "Edit guide", robots: { index: false, follow: false } };

export default async function EditGuidePage({ params }) {
  const { id } = await params;
  return (
    <div className="admin-page">
      <h1>Edit guide</h1>
      <GuideForm guideId={id} />
    </div>
  );
}
