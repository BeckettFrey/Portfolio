import { createContext, useContext, useState, useEffect } from 'react';
import { GITHUB_USERNAME, PORTFOLIO_CONFIG_REPO } from '../local_config/userInfo';

// Create the context
const PortfolioConfigContext = createContext();

// Custom hook to use the context
export const usePortfolioConfig = () => {
  const context = useContext(PortfolioConfigContext);
  if (!context) {
    throw new Error('usePortfolioConfig must be used within a PortfolioConfigProvider');
  }
  return context;
};

// Provider component
export const PortfolioConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      console.log("fetching config...")
      try {
        setLoading(true);
        setError(null);

        // Fetch the unified config.json file
        const configResponse = await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${PORTFOLIO_CONFIG_REPO}/contents/config.json`
        );

        if (!configResponse.ok) {
          throw new Error('Portfolio configuration not found. Please create a "portfolio-config" repository with a "config.json" file.');
        }

        const configData = await configResponse.json();
        const parsedConfig = JSON.parse(atob(configData.content));

        // Validate that the config has the expected structure
        if (!parsedConfig.projects && !parsedConfig.about) {
          throw new Error('Invalid configuration structure. Expected "projects" and/or "about" fields in config.json');
        }

        setConfig(parsedConfig);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching portfolio configuration:', err);
      } finally {
        setLoading(false);
        console.log("success")
      }
    };

    fetchConfig();
  }, []);

  // Fetch detailed project information from GitHub API
  const fetchProjectDetails = async (featuredProjects) => {
    if (!featuredProjects || !Array.isArray(featuredProjects)) {
      return [];
    }

    const projectPromises = featuredProjects.map(async (project) => {
      try {
        const repoResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${project.repo_name}`);
        if (!repoResponse.ok) {
          console.warn(`Repository ${project.repo_name} not found`);
          return null;
        }
        const repoData = await repoResponse.json();

        return {
          ...repoData,
          custom_description: project.custom_description || repoData.description,
          highlight: project.highlight || false,
          demo_url: project.demo_url || repoData.homepage,
          tech_stack: project.tech_stack || [],
          order: project.order || 0,
          languages: project.languages
        };
      } catch (err) {
        console.warn(`Error fetching ${project.repo_name}:`, err);
        return null;
      }
    });

    const projects = await Promise.all(projectPromises);
    const validProjects = projects.filter(project => project !== null);

    // Sort by order (if specified) or by highlight status, then by stars
    validProjects.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      if (a.highlight !== b.highlight) return b.highlight - a.highlight;
      return b.stargazers_count - a.stargazers_count;
    });

    return validProjects;
  };

  const value = {
    // Configuration data
    config,
    projectsConfig: config?.projects,
    aboutConfig: config?.about,
    
    // Loading and error states
    loading,
    error,
    
    // Helper function to fetch detailed project data
    fetchProjectDetails,
    
    // Utility functions
    getProjectsConfig: () => config?.projects || {},
    getAboutConfig: () => config?.about || {},
    
    // Refresh function to reload config
    refreshConfig: () => {
      setLoading(true);
      setError(null);
      // Trigger re-fetch by updating a dependency or calling fetchConfig again
      window.location.reload(); 
    }
  };

  return (
    <PortfolioConfigContext.Provider value={value}>
      {children}
    </PortfolioConfigContext.Provider>
  );
};

// HOC to wrap components that need config
export const WithPortfolioConfig = (Component) => {
  return function WrappedComponent(props) {
    return (
      <PortfolioConfigProvider>
        <Component {...props} />
      </PortfolioConfigProvider>
    );
  };
};