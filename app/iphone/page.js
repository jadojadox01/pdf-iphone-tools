import { DeviceHub } from "../components/DeviceHub";
import { deviceHubMetadata, requirePublishedDevice } from "@/lib/device-page";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return deviceHubMetadata("iphone", "PDF tools for iPhone and iPad");
}

export default async function IphonePage() {
  await requirePublishedDevice("iphone");
  return <DeviceHub slug="iphone" />;
}
