import { useState, useEffect } from 'react';
import { PROJECTS_PAGE_CONTENT } from './constants/projectsPageConstants';

const ProjectsPage = () => {
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const content = PROJECTS_PAGE_CONTENT;

  useEffect(() => {
    const fetchPortfolioProjects = async () => {
      try {
        setLoading(true);
        
        // Fetch the portfolio configuration
        const configResponse = await fetch('https://api.github.com/repos/BeckettFrey/portfolio-config/contents/projects.json');
        
        if (!configResponse.ok) {
          throw new Error('Portfolio configuration not found. Please create a "portfolio-config" repository with a "projects.json" file.');
        }
        
        const configData = await configResponse.json();
        const configContent = JSON.parse(atob(configData.content));
        
        // Fetch detailed information for each featured project
        const projectPromises = configContent.featured_projects.map(async (project) => {
          try {
            const repoResponse = await fetch(`https://api.github.com/repos/BeckettFrey/${project.repo_name}`);
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
              order: project.order || 0
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
        
        setPortfolioProjects(validProjects);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching portfolio projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioProjects();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: 'bg-yellow-100 text-yellow-800',
      Python: 'bg-green-100 text-green-800',
      Java: 'bg-red-100 text-red-800',
      TypeScript: 'bg-blue-100 text-blue-800',
      HTML: 'bg-orange-100 text-orange-800',
      CSS: 'bg-purple-100 text-purple-800',
      React: 'bg-cyan-100 text-cyan-800',
      'C++': 'bg-indigo-100 text-indigo-800',
      C: 'bg-gray-100 text-gray-800',
      Swift: 'bg-pink-100 text-pink-800',
      Kotlin: 'bg-violet-100 text-violet-800',
    };
    return colors[language] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">{content.loading.message}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-xl p-8 max-w-md">
          <div className="text-6xl mb-4">{content.error.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{content.error.title}</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">{error}</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-700 mb-2">To set up your portfolio:</p>
            <ol className="text-xs text-gray-600 space-y-1">
              {content.error.instructions.map((step, index) => (
                <li key={index}>{`${index + 1}. ${step}`}</li>
              ))}
            </ol>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            {content.error.tryAgainButton}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      {/* Close Button */}
      <div className="fixed top-6 left-6 z-50">
        <a 
          href="/" 
          className="flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <span className="text-xl">×</span>
        </a>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className={`text-6xl font-bold bg-gradient-to-r from-${content.theme.colors.gradientFrom} to-${content.theme.colors.gradientTo} bg-clip-text text-transparent mb-6`}>
            {content.header.title}
          </h1>
          <div className={`w-24 h-1 bg-gradient-to-r from-${content.theme.colors.gradientFrom} to-${content.theme.colors.gradientTo} mx-auto rounded-full mb-6`}></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {content.header.description}
          </p>
        </div>

        {/* Stats Section */}
        {portfolioProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">{portfolioProjects.length}</div>
              <div className="text-gray-600">{content.stats.projects.title}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {new Set(portfolioProjects.map(repo => repo.language).filter(Boolean)).size}
              </div>
              <div className="text-gray-600">{content.stats.languages.title}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {portfolioProjects.filter(project => project.highlight).length}
              </div>
              <div className="text-gray-600">{content.stats.highlighted.title}</div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioProjects.map((project) => (
            <div 
              key={project.id} 
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border overflow-hidden group ${
                project.highlight ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-100'
              }`}
            >
              {/* Highlight Badge */}
              {project.highlight && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 text-center">
                  {content.projects.highlightBadge}
                </div>
              )}

              {/* Project Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm">
                    <span className="mr-1">⭐</span>
                    {project.stargazers_count}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {project.custom_description || content.projects.noDescription}
                </p>

                {/* Tech Stack (if provided) */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">{content.projects.techStackLabel}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack.map((tech) => (
                        <span key={tech} className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Language and Topics */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.language && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLanguageColor(project.language)}`}>
                      {project.language}
                    </span>
                  )}
                  {project.topics && project.topics.slice(0, 2).map((topic) => (
                    <span key={topic} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <span className="mr-1">🍴</span>
                      {project.forks_count}
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1">👁️</span>
                      {project.watchers_count}
                    </span>
                  </div>
                  <div className="text-xs">
                    Updated {formatDate(project.updated_at)}
                  </div>
                </div>
              </div>

              {/* Project Footer */}
              <div className="px-6 pb-6">
                <div className="flex space-x-3">
                  <a 
                    href={project.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                  >
                    {content.projects.viewCodeButton}
                  </a>
                  {project.demo_url && (
                    <a 
                      href={project.demo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                    >
                      {content.projects.liveDemoButton}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {portfolioProjects.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">{content.empty.emoji}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{content.empty.title}</h3>
            <p className="text-gray-600 mb-6">
              {content.empty.description}
            </p>
            <a 
              href={content.empty.githubUrl} 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              {content.empty.githubButton}
            </a>
          </div>
        )}

        {/* Setup Instructions */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{content.setup.title}</h3>
          <div className="text-sm text-gray-600 space-y-2">
            {content.setup.instructions.map((step, index) => (
              <p key={index}>
                {index + 1}. {step.text}{' '}
                {step.code && (
                  <code className="bg-gray-100 px-2 py-1 rounded">{step.code}</code>
                )}{' '}
                {step.afterText}
              </p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>
            {content.footer.text} • 
            Visit my <a href={content.footer.githubUrl} className="text-blue-600 hover:underline">{content.footer.githubLinkText}</a> for all repositories
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;