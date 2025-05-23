import { GITHUB_USERNAME, LINKEDIN_URL } from "./userInfo";

export const CONTACT_PAGE_CONFIG = {
  // Header Section
  header: {
    title: "Contact"
  },

  // Form Configuration (simplified for Formspree React)
  form: {
    fields: {
      name: {
        label: "Full Name",
        placeholder: "First and Last",
        type: "text",
        name: "name",
        id: "full-name",
        required: true
      },
      email: {
        label: "Email Address",
        placeholder: "***@domain",
        type: "email",
        name: "email",
        id: "email-address",
        required: true
      },
      message: {
        label: "Message",
        placeholder: "Tell me what's on your mind...",
        type: "textarea",
        name: "message",
        id: "message",
        rows: 5,
        required: true
      }
    },
    hiddenFields: {
      subject: {
        name: "_subject",
        id: "email-subject",
        value: "Contact Form Submission"
      }
    },
    submitButton: {
      value: "Send Message"
    }
  },

  // Social Links
  socialLinks: [
    {
      platform: "GitHub",
      url: `https://github.com/${GITHUB_USERNAME}`,
      icon: "FaGithub",
      backgroundColor: "bg-gray-800",
      hoverColor: "hover:bg-gray-900",
      textColor: "text-white"
    },
    {
      platform: "LinkedIn",
      url: LINKEDIN_URL,
      icon: "FaLinkedin",
      backgroundColor: "bg-blue-700",
      hoverColor: "hover:bg-blue-800",
      textColor: "text-white"
    }
  ],

  // Theme Configuration
  theme: {
    colors: {
      primary: "blue-600",
      secondary: "purple-600",
      gradientFrom: "blue-600",
      gradientTo: "purple-600",
      focusRing: "focus:ring-blue-600"
    },
    background: "bg-gradient-to-br from-slate-50 to-slate-100"
  }
};

// Helper function to get form configuration
export const getFormConfig = () => {
  return CONTACT_PAGE_CONFIG.form;
};

// Helper function to get social links
export const getSocialLinks = () => {
  return CONTACT_PAGE_CONFIG.socialLinks;
};

export default CONTACT_PAGE_CONFIG;