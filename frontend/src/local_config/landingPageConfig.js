export const LANDING_PAGE_CONFIG = {
  // Desktop Folders
  folders: [
    {
      label: "About",
      url: "/about"
    },
    {
      label: "Projects",
      url: "/projects"
    },
    {
      label: "Contact",
      url: "/contact"
    }
  ],

  // Popup Quotes
  popups: {
    battery: {
      quote: "I'd put my money on the sun and solar energy. What a source of power! I hope we don't have to wait until oil and coal run out before we tackle that.",
      author: "Thomas Edison"
    },
    wifi: {
      quote: "Consider frequently the connection of all things in the universe and their relation to one another.",
      author: "Marcus Aurelius"
    },
    magnify: {
      quote: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
      author: "Steve Jobs"
    }
  },

  // Theme Configuration
  theme: {
    colors: {
      primary: "yellow-600",
      text: "text-black",
      icon: "text-white",
      iconHover: "hover:text-gray-300",
      barBackground: "bg-black bg-opacity-50"
    },
  }
};

export default LANDING_PAGE_CONFIG;