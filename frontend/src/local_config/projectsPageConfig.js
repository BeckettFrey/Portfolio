import { GITHUB_USERNAME } from "./userInfo.js";

const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;

export const PROJECTS_PAGE_CONFIG = {
  // Loading State
  loading: {
    message: "Loading portfolio projects..."
  },

  // Error State
  error: {
    title: "Setup Required",
    emoji: "⚙️",
    instructions: [
      "Create a repository named \"portfolio-config\"",
      "Add a \"projects.json\" file",
      "List your featured projects"
    ],
    tryAgainButton: "Try Again"
  },

  // Projects Section
  projects: {
    highlightBadge: "⭐ FEATURED PROJECT",
    techStackLabel: "Tech Stack:",
    noDescription: "No description available",
    viewCodeButton: "View Code",
    liveDemoButton: "Live Demo",
    stats: {
      projects: {
        title: "Featured Projects"
      },
      technologies: {
        title: "Technologies Used"
      },
      highlighted: {
        title: "Highlighted"
      }
    }
  },

  // Empty State
  empty: {
    emoji: "🚀",
    title: "No projects configured yet",
    description: "Set up your portfolio configuration to showcase your best work!",
    githubButton: "Visit My GitHub",
    githubUrl: GITHUB_URL
  },
  
  // Footer
  footer: {
    text: "Projects dynamically loaded from GitHub",
    githubLinkText: "profile",
    githubUrl: GITHUB_URL
  }
};

export default PROJECTS_PAGE_CONFIG;