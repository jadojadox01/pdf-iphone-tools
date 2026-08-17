import { pageMetadata } from "@/lib/seo";
import ContactForm from "./ContactForm";

export const metadata = pageMetadata({
  title: "Contact PDF iPhone Tools",
  description: "Contact PDF iPhone Tools about support, privacy, or product questions.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactForm />;
}
