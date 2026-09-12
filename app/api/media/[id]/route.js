import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request, { params }) {
  const { id } = await params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media?.data) {
    if (media?.url && /^https?:\/\//i.test(media.url)) {
      return NextResponse.redirect(media.url);
    }
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(Buffer.from(media.data), {
    headers: {
      "Content-Type": media.mimeType,
      "Cache-Control": "public, max-age=86400",
      "Content-Disposition": `inline; filename="${media.filename.replace(/"/g, "")}"`,
    },
  });
}
