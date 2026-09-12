import { serveMedia } from "@/lib/media-store";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;
  return serveMedia(id);
}
