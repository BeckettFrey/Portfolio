export const ABOUT_PAGE_CONTENT = {
  // Header Section
  header: {
    title: "About Me"
  },

  // Profile Section
  profile: {
    greeting: "Hey there! 👋",
    name: "Beckett",
    introduction: "I'm {name}, a passionate senior developer from Milwaukee, Wisconsin, with a BS in Computer Science from UW-Milwaukee. I thrive on creating innovative solutions and pushing the boundaries of what's possible with code.",
    quickStats: {
      education: {
        title: "BS Graduate",
        subtitle: "UW-Milwaukee"
      },
      role: {
        title: "Developer",
        subtitle: "Full Stack"
      }
    }
  },

  // Technical Interests
  technicalInterests: {
    title: "Technical Interests",
    items: [
      {
        icon: "FaCode",
        text: "Web & App Development",
        color: "blue"
      },
      {
        icon: "FaBrain",
        text: "AI & Neural Networks",
        color: "purple"
      },
      {
        icon: "FaAtom",
        text: "Quantum Computing",
        color: "green"
      }
    ]
  },

  // Personal Interests
  personalInterests: {
    title: "Beyond Code",
    items: [
      {
        icon: "FaUtensils",
        text: "Cooking & Culinary Arts",
        color: "orange"
      },
      {
        icon: "FaDumbbell",
        text: "Fitness & Active Lifestyle",
        color: "red"
      },
      {
        icon: "FaBook",
        text: "Philosophy & Deep Thinking",
        color: "yellow"
      }
    ]
  },

  // Call to Action Section
  callToAction: {
    title: "Let's Work Together!",
    description: "I'm actively seeking freelance opportunities and always eager to expand my skills. Have a project in mind or just want to connect?",
    socialLinks: [
      {
        platform: "GitHub",
        url: "https://github.com/BeckettFrey",
        icon: "FaGithub",
        iconColor: "black"
      },
      {
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/beckettfrey",
        icon: "FaLinkedin",
        iconColor: "blue-700"
      }
    ]
  },

  // Footer
  footer: {
    credits: "Icons by React Icons",
    creditsUrl: "https://react-icons.github.io/react-icons/"
  },

  // Theme/Styling Constants
  theme: {
    colors: {
      primary: "blue-600",
      secondary: "purple-600",
      gradientFrom: "blue-600", // Fixed typo from blue-60
      gradientTo: "purple-600"
    },
    images: {
      profileImage: "../assets/profile.png"
    }
  }
};

// Helper function to replace placeholders in text
export const processText = (text, replacements = {}) => {
  let processedText = text;
  for (const [key, value] of Object.entries(replacements)) {
    processedText = processedText.replace(new RegExp(`{${key}}`, 'g'), value);
  }
  return processedText;
};

// Color mapping for consistent styling
export const COLOR_CLASSES = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: "text-blue-600"
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    icon: "text-purple-600"
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-600",
    icon: "text-green-600"
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    icon: "text-orange-600"
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-600",
    icon: "text-red-600"
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    icon: "text-yellow-600"
  }
};

export default ABOUT_PAGE_CONTENT;