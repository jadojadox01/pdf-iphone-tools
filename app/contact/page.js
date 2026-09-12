import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import ContactForm from "./ContactForm";

export const metadata = pageMetadata({
  title: `Contact ${SITE_NAME}`,
  description: `Contact ${SITE_NAME} about support, privacy, or product questions.`,
  path: "/contact",
});

export default function ContactPage() {
  return <ContactForm />;
}
