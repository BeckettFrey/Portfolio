export const PROJECTS_PAGE_CONTENT = {
  // Header Section
  header: {
    title: "My Projects",
    description: "A curated collection of projects I've built and contributed to. Each represents a unique challenge and learning experience."
  },

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

  // Stats Section
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
    liveDemoButton: "Live Demo"
  },

  // Empty State
  empty: {
    emoji: "🚀",
    title: "No projects configured yet",
    description: "Set up your portfolio configuration to showcase your best work!",
    githubButton: "Visit My GitHub",
    githubUrl: "https://github.com/BeckettFrey"
  },

  // Setup Instructions
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

  // Footer
  footer: {
    text: "Projects dynamically loaded from GitHub",
    githubLinkText: "profile",
    githubUrl: "https://github.com/BeckettFrey"
  },

  // Theme (for consistency with other pages)
  theme: {
    colors: {
      primary: "blue-600",
      secondary: "purple-600",
      gradientFrom: "blue-600",
      gradientTo: "purple-600"
    }
  }
};

export default PROJECTS_PAGE_CONTENT;