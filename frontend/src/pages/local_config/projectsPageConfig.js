import { GITHUB_USERNAME } from "./userConfig.js";

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
      "Create a repository named portfolio-config",
      "Add a projects.json file",
      "List your featured projects"
    ],
    tryAgainButton: "Try Again"
  },

  setup: {
    title: "💡 How to Update Your Projects",
    instructions: [
      {
        text: "Go to your",
        code: "portfolio-config",
        afterText: "repository"
      },
      {
        text: "Edit the",
        code: "projects.json",
        afterText: "file"
      },
      {
        text: "Add, remove, or reorder your featured projects"
      },
      {
        text: "Changes will appear automatically on your website!"
      }
    ]
  },

  // Header Section
  stats: {
    projects: {
      title: "Featured Projects"
    },
    languages: {
      title: "Languages Used"
    },
    highlighted: {
      title: "Highlighted"
    }
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