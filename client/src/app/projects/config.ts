import { ProjectsConfig } from '@/app/projects/ProjectsPanel/types';

export const projectsConfig: ProjectsConfig = {
  githubUsername: 'beckettfrey',
  highlightBadge: '🌟 FEATURED PROJECT',
  techStackLabel: 'Tech Stack:',
  noDescription: 'No description provided.',
  empty: {
    description:
      "Set up your portfolio configuration to showcase your best work!",
  },
  featured_projects: [
    {
      id: 'portfolio',
      name: 'Portfolio',
      custom_description:
        "My take on a portfolio—showcasing both my personality and skills. I learned a lot about web deployment and Next.js, and filled in several gaps in my frontend development knowledge. (You're currently viewing it!)",
      highlight: true,
      demo_url: '',
      languages: ['TypeScript'],
      tech_stack: ['Next.js', 'Tailwind CSS'],
      individual: true,
      html_url: 'https://github.com/beckettfrey/MyWebsite',
    },
    {
      id: 'uplant',
      name: 'UPlant',
      custom_description:
        'A plant care app that helps you keep track of your plants\' needs and schedules. The biggest takeaway was navigating the complexities of a team project, from initial design to final deployment. It was a great experience working with a team of 4 to build this from the ground up.',
      highlight: true,
      demo_url: '',
      languages: ['JavaScript', 'TypeScript', 'Python', 'HTML5', 'CSS'],
      tech_stack: ['React', 'Django', 'MySQL'],
      individual: false,
      html_url: 'https://github.com/beckettfrey/UPlant',
    },
    {
      id: 'hyprchs',
      name: 'Hyprchs',
      custom_description:
        'Collaborative AI chess tutor, designed to help players improve their skills through interactive lessons and analysis. It uses advanced machine learning techniques to provide personalized feedback and strategies. I am lucky enough to contribute to the ML side of this underneath a now friend and mentor.',
      highlight: true,
      demo_url: 'https://hyprchs.com',
      tech_stack: ['Modal', 'LangGraph', 'ML'],
      languages: ['Python'],
      individual: false,
      html_url: 'https://github.com/hyprchs',
    },
    {
      id: 'codelibre',
      name: 'CodeLibre',
      custom_description:
        'Git-integrated, open-source CLI assistant built with LangGraph — a lower-cost, local-first alternative to Codex, Claude Code, and similar tools. Starts with commit automation and expands into full RAG-powered code assistance.',
      highlight: false,
      demo_url: '',
      html_url: 'https://github.com/BeckettFrey/CodeLibre',
      tech_stack: ['LangGraph', 'pytest'],
      languages: ['Python', 'Shell'],
      individual: true,
    },
    {
      id: 'ta-scheduling-app',
      name: 'TA-Scheduling-App',
      custom_description:
        'Efficient scheduling system for teaching assistants. This was my first full fledged Django project, designed to streamline the process of assigning TAs to classes and managing their schedules. Worked in scrum with a team of 4, and learned a ton about Django and web development in the process.',
      highlight: false,
      demo_url: '',
      tech_stack: ['Django'],
      languages: ['Python', 'HTML5'],
      individual: false,
      html_url: 'https://github.com/beckettfrey/TA-Scheduling-App',
    },
    {
      id: 'fourlakes',
      name: 'FourLakes',
      custom_description:
        'A sleek one-page React site I built for my brother and his friends who dreamed up a boat detailing business summer-2025. It features responsive design, clean branding, and lives as a standalone route (/FourLakes) in this domain.',
      highlight: false,
      demo_url: 'https://beckettfrey.com/FourLakes',
      languages: ['JavaScript', 'HTML5'],
      tech_stack: ['React', 'Vite', 'Tailwind CSS'],
      individual: true,
      html_url: 'https://github.com/beckettfrey/FourLakes',
    },
  ],
};
