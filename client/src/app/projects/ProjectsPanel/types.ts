// types.ts

export interface Project {
  id: string;
  name: string;
  custom_description?: string;
  tech_stack?: string[];
  languages?: string[];
  topics?: string[];
  html_url: string;
  demo_url?: string;
  individual?: boolean;
  highlight?: boolean;
}

export interface ProjectsConfig {
  highlightBadge?: string;
  techStackLabel?: string;
  noDescription?: string;
  empty?: {
    description: string;
  };
  featured_projects: Project[];
}
