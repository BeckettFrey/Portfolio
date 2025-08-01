import { ProjectsConfig } from '@/app/projects/ProjectsPanel/types';

export const projectsConfig: ProjectsConfig = {
  highlightBadge: '🌟 FEATURED PROJECT',
  techStackLabel: 'Tech Stack:',
  noDescription: 'No description provided.',
  empty: {
    description:
      "Set up your portfolio configuration to showcase your best work!",
  },
  featured_projects: [
       {
      id: 'chesslink',
      name: 'ChessLink',
      custom_description: 'A real-time WebSocket chess API I built to explore backend architecture, game state management, and TypeScript patterns. It was a deep dive into multiplayer logic, reconnection handling, and deploying a TypeScript backend with Docker.',
      highlight: true,
      demo_url: 'https://chess-link-client.vercel.app',
      html_url: 'https://github.com/BeckettFrey/ChessLink',
      tech_stack: ['Node', 'Express', 'Jest', 'Docker'],
      languages: ['TypeScript'],
      individual: true,
    },
    {
      id: 'rodRoyale',
      name: 'RodRoyale',
      custom_description: 'A mobile fishing app that lets anglers share their catches, mark fishing spots on maps, and connect with other fishing enthusiasts. Built with React Native for iOS and Android, featuring photo uploads, location tracking, and community leaderboards.',
      highlight: true,
      demo_url: 'https://www.youtube.com/watch?v=6ZqDfPWTeqM',
      html_url: 'https://github.com/BeckettFrey/RodRoyale',
      tech_stack: ['React Native', 'FastAPI', 'MongoDB', 'Docker'],
      languages: ['Python', 'TypeScript'],
      individual: true,
    },
    {
      id: 'uplant',
      name: 'UPlant',
      custom_description:
        'A plant care app that helps you keep track of your plants\' needs and schedules. The biggest takeaway was navigating the complexities of a team project, from initial design to near deployment. It was a great experience working with a team of 4 to build this from the ground up.',
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
      highlight: true,
      demo_url: '',
      html_url: 'https://github.com/BeckettFrey/CodeLibre',
      tech_stack: ['LangGraph', 'Pytest'],
      languages: ['Python'],
      individual: true,
    },
    {
      id: 'headerizer',
      name: 'Headerizer',
      custom_description:
        'A tool for generating headers for various document types. I learned about creating a cli using python with PEP adherence.',
      highlight: false,
      demo_url: '',
      tech_stack: ['Unittest'],
      languages: ['Python'],
      individual: true,
      html_url: 'https://github.com/BeckettFrey/Headerizer',
    },
    {
      id: 'bonsai',
      name: 'Bonsai',
      custom_description:
        'A minimalist `ls`-like CLI that prints beautiful directory trees while respecting `.gitignore`. I built this to help visualize project structures more easily.',
      highlight: false,
      demo_url: '',
      tech_stack: ['Unittest'],
      languages: ['Python'],
      individual: true,
      html_url: 'https://github.com/BeckettFrey/Bonsai',
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
      html_url: 'https://github.com/BeckettFrey/TA-Scheduling-App',
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      custom_description:
        "My take on a portfolio—showcasing both my personality and skills. I learned a lot about web deployment and Next.js, and filled in several gaps in my frontend development knowledge. (You're currently viewing it!)",
      highlight: false,
      demo_url: 'https://beckettfrey.com',
      languages: ['TypeScript'],
      tech_stack: ['Next', 'Vercel', 'Tailwind'],
      individual: true,
      html_url: 'https://github.com/beckettfrey/portfolio',
    },
    {
      id: 'fourlakes',
      name: 'FourLakes',
      custom_description:
        'A sleek one-page React site I built for my brother and his friends who dreamed up a boat detailing business summer-2025. It features responsive design, clean branding, and lives as a standalone route (/FourLakes) in this domain.',
      highlight: false,
      demo_url: 'https://beckettfrey.com/FourLakes',
      languages: ['JavaScript', 'HTML5'],
      tech_stack: ['React', 'Vite', 'Tailwind'],
      individual: true,
      html_url: 'https://github.com/BeckettFrey/FourLakes',
    },
  ],
};
