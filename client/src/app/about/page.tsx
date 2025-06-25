import AboutContent from "@/components/AboutContent";
import { CorePage } from '@layout';

export const metadata = {
  title: "About | Beckett Frey",
  description: "Learn more about Beckett Frey and his journey as a developer.",
};

export default function AboutPage() {
  return (
    <CorePage header="About">
      <AboutContent />
    </CorePage>
  );
}
  
