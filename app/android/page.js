import { DeviceHub } from "../components/DeviceHub";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "PDF tools for Android",
  path: "/android",
  noIndex: true,
});

export default function AndroidPage() {
  return <DeviceHub slug="android" />;
}
