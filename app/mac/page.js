import { DeviceHub } from "../components/DeviceHub";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "PDF tools for Mac",
  path: "/mac",
  noIndex: true,
});

export default function MacPage() {
  return <DeviceHub slug="mac" />;
}
