import { pageMetadata } from "@/lib/seo";
import { DeviceHub } from "../components/DeviceHub";
import { getPublishedDevice } from "@/lib/cms/guides";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const device = await getPublishedDevice("iphone").catch(() => null);
  if (!device) return pageMetadata({ title: "PDF tools for iPhone", path: "/iphone" });
  return pageMetadata({
    title: device.seoTitle || device.name,
    description: device.seoDescription || device.description,
    path: "/iphone",
  });
}

export default function IphonePage() {
  return <DeviceHub slug="iphone" />;
}
