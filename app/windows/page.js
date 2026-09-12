import { DeviceHub } from "../components/DeviceHub";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "PDF tools for Windows",
  path: "/windows",
  noIndex: true,
});

export default function WindowsPage() {
  return <DeviceHub slug="windows" />;
}
