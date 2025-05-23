import { useEffect, useState } from 'react';
import { usePortfolioConfig } from '../context/PortfolioConfigProvider';
import { PROJECTS_PAGE_CONFIG } from '../local_config/projectsPageConfig';
import { GITHUB_USERNAME } from '../local_config/userInfo';

const ProjectsPage = () => {
  const { projectsConfig, loading, error, fetchProjectDetails } = usePortfolioConfig();
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [uiContent, setUiContent] = useState(PROJECTS_PAGE_CONFIG);

  // Fetch project details when projectsConfig changes
  useEffect(() => {
    const loadProjects = async () => {
      if (projectsConfig?.featured_projects) {
        // Update uiContent with projectsConfig
        setUiContent(prevState => ({
          ...prevState,
          ...projectsConfig
        }));

        // Fetch detailed project data using context's fetchProjectDetails
        const projects = await fetchProjectDetails(projectsConfig.featured_projects);
        setPortfolioProjects(projects);
      }
    };

    loadProjects();
  }, [projectsConfig, fetchProjectDetails]);

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
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-xl p-8 max-w-md">
          <div className="text-6xl mb-4">{uiContent.error?.emoji || '⚙️'}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{uiContent.error?.title || 'Setup Required'}</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">{error}</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-700 mb-2">To set up your portfolio:</p>
            <ol className="text-xs text-gray-600 space-y-1">
              {(uiContent.error?.instructions || []).map((step, index) => (
                <li key={index}>{`${index + 1}. ${step}`}</li>
              )) || (
                <>
                  <li>1. Create a repository named "portfolio-config" on GitHub.</li>
                  <li>2. Add a config.json file with the required structure.</li>
                  <li>3. Ensure GITHUB_USERNAME and PORTFOLIO_CONFIG_REPO are set in your configuration.</li>
                </>
              )}
            </ol>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            {uiContent.error?.tryAgainButton || 'Try Again'}
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
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 pb-2 leading-tight">
            {uiContent.header?.title || 'My Projects'}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {uiContent.header?.description || 'A curated collection of projects I\'ve built and contributed to.'}
          </p>
        </div>

        {/* Stats Section */}
        {portfolioProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">{portfolioProjects.length}</div>
              <div className="text-gray-600">{uiContent?.stats?.projects?.title || 'Featured Projects'}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Array.from(
                  new Set(
                    portfolioProjects.flatMap(repo => repo.tech_stack || [])
                  )
                ).length}
              </div>
              <div className="text-gray-600">{uiContent?.stats?.technologies?.title || 'Technologies Used'}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {portfolioProjects.filter(project => project.highlight).length}
              </div>
              <div className="text-gray-600">{uiContent?.stats?.highlighted?.title || 'Highlighted'}</div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioProjects.map((project) => (
            <div 
              key={project.id} 
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border overflow-hidden group flex flex-col ${
                project.highlight ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-100'
              }`}
            >
              {/* Highlight Badge */}
              {project.highlight && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 text-center">
                  {uiContent?.highlightBadge || '⭐ FEATURED PROJECT'}
                </div>
              )}

              {/* Project Header */}
              <div className="p-6 pb-4 flex-grow">
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
                  {project.custom_description || uiContent?.noDescription || 'No description available'}
                </p>

                {/* Tech Stack */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      {uiContent?.techStackLabel || 'Tech Stack:'}
                    </p>
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
              <div className="px-6 pb-6 mt-auto">
                <div className="flex space-x-3">
                  <a 
                    href={project.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                  >
                    {uiContent?.viewCodeButton || 'View Code'}
                  </a>
                  {project.demo_url && (
                    <a 
                      href={project.demo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                    >
                      {uiContent?.liveDemoButton || 'Live Demo'}
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
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {uiContent.empty?.title || 'No projects configured yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {uiContent.empty?.description || 'Set up your portfolio configuration to showcase your best work!'}
            </p>
            <a 
              href={`https://github.com/${GITHUB_USERNAME}`} 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              {uiContent.empty?.githubButton || 'Visit My GitHub'}
            </a>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>
            {uiContent.footer?.text || 'Projects dynamically loaded from GitHub'} • 
            Visit my <a href={`https://github.com/${GITHUB_USERNAME}`} className="text-blue-600 hover:underline">
              {uiContent.footer?.githubLinkText || 'profile'}
            </a> for all repositories
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;