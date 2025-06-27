import ContactForm from "@/app/contact/ContactForm";
import { CorePage } from "@layout";
import { FORMSPREE_CODE } from "@/globals/config/identity";

export const metadata = {
  title: "Contact | Beckett Frey",
  description: "Get in touch with Beckett Frey — developer, designer, and creator."
};

const Page = () => {
  return (
    <CorePage header="Contact">
      <ContactForm formspreeCode={FORMSPREE_CODE} />
    </CorePage>
  );
};

export default Page;
