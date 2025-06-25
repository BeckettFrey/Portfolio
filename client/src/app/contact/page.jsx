import ContactForm from "@/components/ContactForm";
import { CorePage } from "@layout";

export const metadata = {
  title: "Contact | Beckett Frey",
  description: "Get in touch with Beckett Frey — developer, designer, and creator."
};

const Page = () => {
  return (
    <CorePage header="Contact">
      <ContactForm />
    </CorePage>
  );
};

export default Page;
