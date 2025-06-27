import ProjectsPanel from "@/app/projects/ProjectsPanel";
import { CorePage } from "@layout";
import { projectsConfig } from "./config";

export const revalidate = 86400; // Revalidate every 24 hours

export const metadata = {
  title: "Projects | Beckett Frey",
  description: "Explore my projects and contributions to various open-source initiatives."
};

const Page = () => {
  return (
    <CorePage header="Projects">
      <ProjectsPanel config={projectsConfig} />
    </CorePage>
  );
};

export default Page;