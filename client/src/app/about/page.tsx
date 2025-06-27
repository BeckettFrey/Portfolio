import { CorePage } from '@layout';
import AboutContent from "./AboutContent";
import { aboutConfig } from "./config";

export const metadata = {
  title: "About | Beckett Frey",
  description: "Learn more about Beckett Frey and his journey as a developer.",
};

export default function AboutPage() {
  return (
    <CorePage header="About">
      <AboutContent  config={aboutConfig}/>
    </CorePage>
  );
}
  
