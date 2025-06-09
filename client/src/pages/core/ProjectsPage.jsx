import { useState } from 'react';
import { projectsConfig } from './config';
import { FaTimes } from 'react-icons/fa';

const ProjectsPage = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterTech, setFilterTech] = useState('all');
  const [filterLang, setFilterLang] = useState('all');

  const allTechs = Array.from(
    new Set(projectsConfig.featured_projects.flatMap(p => p.tech_stack || []))
  )

  const allLangs = Array.from(
    new Set(projectsConfig.featured_projects.flatMap(p => p.languages || []))
  );

  const filteredProjects = projectsConfig.featured_projects.filter(project => {
    if (filterType !== 'all') {
      if (filterType === 'individual' && !project.individual) return false;
      if (filterType === 'team' && project.individual) return false;
    }
    if (filterTech !== 'all' && !(project.tech_stack || []).includes(filterTech)) {
      return false;
    }
    if (filterLang !== 'all' && !(project.languages || []).includes(filterLang)) {
      return false;
    }
    return true;
  });
  
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

  const uniqueLanguages = Array.from(
    new Set(projectsConfig.featured_projects.flatMap(p => p.languages || []))
  );

  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden">
      <style jsx>{`
        .content-container {
          transition: opacity 0.2s ease-in-out;
        }
        .close-button {
          transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
        }
        .project-card {
          transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .stat-card {
          transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
        }
        .filter-select {
          transition: border-color 0.2s ease-in-out, ring-color 0.2s ease-in-out;
        }
        .action-button {
          transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
        }
        @media (max-width: 767px) {
          .container {
            padding-left: 8px;
            padding-right: 8px;
            padding-top: 8px;
            padding-bottom: 8px;
          }
        }
      `}</style>

      {/* Close Button */}
      <div className="absolute top-2 left-2 z-50">
        <a
          href="/"
          className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg close-button hover:scale-110"
          onTouchStart={(e) => {
            e.stopPropagation();
            e.preventDefault();
            window.location.href = '/';
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            window.location.href = '/';
          }}
        >
          <FaTimes className="text-lg" />
        </a>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-6xl z-10 relative content-container">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 pb-2 leading-tight">
            My Projects
          </h1>
      
          <div className="text-center w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full mb-6"></div>
          <div className="flex justify-center mb-16">
            <p className="text-xl text-gray-300 w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-md text-left">
              {projectsConfig.header?.description}
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[{
            value: filterType, setter: setFilterType, label: 'All Types', options: ['individual', 'team'], ring: 'blue'
          }, {
            value: filterTech, setter: setFilterTech, label: 'Full Stack', options: allTechs, ring: 'green'
          }, {
            value: filterLang, setter: setFilterLang, label: 'All Languages', options: allLangs, ring: 'purple'
          }].map(({ value, setter, label, options, ring }, i) => (
            <div key={i} className="flex justify-center">
              <select
                className={`w-full max-w-xs px-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white shadow-sm focus:ring-2 focus:ring-${ring}-400 focus:border-${ring}-400 filter-select`}
                value={value}
                onChange={e => setter(e.target.value)}
              >
                <option value="all" className="text-gray-800">{label}</option>
                {options.map(option => (
                  <option key={option} value={option} className="text-gray-800">{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Stats */}
        {projectsConfig.featured_projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { count: projectsConfig.featured_projects.length, label: 'Projects', color: 'blue' },
              {
                count: allTechs.length,
                label: 'Technologies Used', color: 'green'
              },
              { count: uniqueLanguages.length, label: 'Languages Used', color: 'purple' }
            ].map(({ count, label, color }, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 text-center border border-white/10 stat-card hover:scale-[1.02]">
                <div className={`text-3xl font-bold text-${color}-400 mb-2`}>{count}</div>
                <div className="text-gray-300">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div
              key={project.id || project.name}
              className={`bg-white/10 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl project-card border overflow-hidden group flex flex-col hover:bg-white/20 hover:scale-[1.02] ${
                project.highlight ? 'border-blue-400/50 ring-2 ring-blue-400/30' : 'border-white/10'
              }`}
            >
              {project.highlight && (
                <div className="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-xs font-bold px-3 py-1 text-center">
                  {projectsConfig?.highlightBadge || '⭐ FEATURED PROJECT'}
                </div>
              )}

              <div className="p-6 pb-4 flex-grow flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h3>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow">
                  {project.custom_description || projectsConfig?.noDescription || 'No description available'}
                </p>

                {project.tech_stack?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-400 mb-2">
                      {projectsConfig?.techStackLabel || 'Tech Stack:'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack.map(tech => (
                        <span key={tech} className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.languages?.map(lang => (
                    <span
                      key={lang}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getLanguageColor(lang)}`}
                    >
                      {lang}
                    </span>
                  ))}
                  {project.topics?.slice(0, 2).map(topic => (
                    <span key={topic} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30">
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="flex space-x-3">
                  <a
                    href={project.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-lg action-button text-sm font-medium hover:scale-105"
                  >
                    View Code
                  </a>
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg action-button text-sm font-medium hover:scale-105"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No projects configured yet
            </h3>
            <p className="text-gray-300 mb-6">
              {projectsConfig.empty?.description || 'Set up your portfolio configuration to showcase your best work!'}
            </p>
            <a
              href={`https://github.com/${projectsConfig.githubUsername}`}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full action-button hover:scale-105"
            >
              Visit My GitHub
            </a>
          </div>
        )}

        <div className="mt-16 text-center text-sm text-gray-400">
          <p>Reps build results—consistency beats intensity every time.</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;