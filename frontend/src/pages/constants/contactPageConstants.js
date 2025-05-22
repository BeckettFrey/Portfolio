export const CONTACT_PAGE_CONTENT = {
  // Header Section
  header: {
    title: "Contact"
  },

  // Form Configuration
  form: {
    action: import.meta.env.VITE_FORMSPREE_ENDPOINT || "https://formspree.io/f/mknawbpy",
    method: "POST",
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
        name: "_replyto",
        id: "email-address",
        required: true
      },
      message: {
        label: "Message",
        placeholder: "",
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
      value: "Submit"
    }
  },

  // Social Links
  socialLinks: [
    {
      platform: "GitHub",
      url: import.meta.env.VITE_GITHUB_URL || "https://github.com/BeckettFrey",
      icon: "FaGithub",
      backgroundColor: "bg-gray-800",
      hoverColor: "hover:bg-gray-900",
      textColor: "text-white"
    },
    {
      platform: "LinkedIn",
      url: import.meta.env.VITE_LINKEDIN_URL || "https://www.linkedin.com/in/beckettfrey",
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

// Helper function to get form configuration with environment variables
export const getFormConfig = () => {
  return {
    ...CONTACT_PAGE_CONTENT.form,
    action: import.meta.env.VITE_FORMSPREE_ENDPOINT || CONTACT_PAGE_CONTENT.form.action
  };
};

// Helper function to get social links with environment overrides
export const getSocialLinks = () => {
  return CONTACT_PAGE_CONTENT.socialLinks.map(link => ({
    ...link,
    url: import.meta.env[`VITE_${link.platform.toUpperCase()}_URL`] || link.url
  }));
};

// Environment variable validation helper
export const validateEnvironmentConfig = () => {
  const warnings = [];
  
  if (!import.meta.env.VITE_FORMSPREE_ENDPOINT) {
    warnings.push('VITE_FORMSPREE_ENDPOINT not set - using default form endpoint');
  }
  
  if (!import.meta.env.VITE_GITHUB_URL) {
    warnings.push('VITE_GITHUB_URL not set - using default GitHub URL');
  }
  
  if (!import.meta.env.VITE_LINKEDIN_URL) {
    warnings.push('VITE_LINKEDIN_URL not set - using default LinkedIn URL');
  }

  return warnings;
};

export default CONTACT_PAGE_CONTENT;