import { DeviceHub } from "../components/DeviceHub";
import { deviceHubMetadata, requirePublishedDevice } from "@/lib/device-page";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return deviceHubMetadata("android", "PDF tools for Android");
}

export default async function AndroidPage() {
  await requirePublishedDevice("android");
  return <DeviceHub slug="android" />;
}
