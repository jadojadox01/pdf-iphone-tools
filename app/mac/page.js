import { DeviceHub } from "../components/DeviceHub";
import { deviceHubMetadata, requirePublishedDevice } from "@/lib/device-page";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return deviceHubMetadata("mac", "PDF tools for Mac");
}

export default async function MacPage() {
  await requirePublishedDevice("mac");
  return <DeviceHub slug="mac" />;
}
