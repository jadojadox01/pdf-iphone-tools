import { DeviceHub } from "../components/DeviceHub";
import { deviceHubMetadata, requirePublishedDevice } from "@/lib/device-page";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return deviceHubMetadata("windows", "PDF tools for Windows");
}

export default async function WindowsPage() {
  await requirePublishedDevice("windows");
  return <DeviceHub slug="windows" />;
}
