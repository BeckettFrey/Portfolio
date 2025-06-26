import ProjectsPanel from "@/components/ProjectsPanel";
import { CorePage } from "@layout";

export const metadata = {
  title: "Projects | Beckett Frey",
  description: "Explore my projects and contributions to various open-source initiatives."
};

const ProjectsPage = () => {
  return (
    <CorePage header="Projects">
      <ProjectsPanel />
    </CorePage>
  );
};

export default ProjectsPage;