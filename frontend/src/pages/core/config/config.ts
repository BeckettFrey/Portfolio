export interface PortfolioConfig {
  projects: {
    header: {
      title: string;
      description: string;
    };
    featured_projects: {
      name: string;
      custom_description: string;
      highlight: boolean;
      demo_url: string;
      languages: string[];
      tech_stack: string[];
      individual: boolean;
      html_url: string;
    }[];
  };
  about: {
    greeting: string;
    name: string;
    introduction: string;
    education: {
      title: string;
      subtitle: string;
    };
    role: {
      title: string;
      subtitle: string;
    };
    location: {
      city: string;
      state: string;
      country: string;
    };
    technicalInterests: {
      icon: string;
      text: string;
      color: string;
    }[];
    personalInterests: {
      title: string;
      items: {
        icon: string;
        text: string;
        color: string;
      }[];
    };
    callToAction: {
      title: string;
      description: string;
    };
  };
  photos: {
    id: number;
    url: string;
    caption: string;
  }[];
}
