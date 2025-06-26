// index.tsx

"use client";

import { useState } from 'react';
import { projectsConfig } from './config';

// styles/glass.ts
export const glassPanelColor = `
  bg-white/10 
  backdrop-blur-md 
  border border-white/20 
  shadow-xl 
  transition-all duration-300 
`;


const ProjectsPanel = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterTech, setFilterTech] = useState('all');
  const [filterLang, setFilterLang] = useState('all');

  const allTechs = Array.from(new Set(projectsConfig.featured_projects.flatMap(p => p.tech_stack || [])));
  const allLangs = Array.from(new Set(projectsConfig.featured_projects.flatMap(p => p.languages || [])));

  const filteredProjects = projectsConfig.featured_projects.filter(project => {
    if (filterType !== 'all') {
      if (filterType === 'individual' && !project.individual) return false;
      if (filterType === 'team' && project.individual) return false;
    }
    if (filterTech !== 'all' && !(project.tech_stack || []).includes(filterTech)) return false;
    if (filterLang !== 'all' && !(project.languages || []).includes(filterLang)) return false;
    return true;
  });

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
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

  const uniqueLanguages = Array.from(new Set(projectsConfig.featured_projects.flatMap(p => p.languages || [])));

  return (
    <div className="relative text-white font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
      {[{
        value: filterType, setter: setFilterType, label: '🔎 All Types', options: ['individual', 'team'], ring: 'blue'
      }, {
        value: filterTech, setter: setFilterTech, label: '⚙️ All Tech', options: allTechs, ring: 'green'
      }, {
        value: filterLang, setter: setFilterLang, label: '🌐 All Languages', options: allLangs, ring: 'purple'
      }].map(({ value, setter, label, options, ring }, i) => (
        <div key={i}>
        <select
          className={`w-full max-w-xs px-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white shadow-sm focus:ring-2 focus:ring-${ring}-400 focus:border-${ring}-400`}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { count: projectsConfig.featured_projects.length, label: 'Projects', color: 'blue' },
          { count: allTechs.length, label: 'Technologies Used', color: 'green' },
          { count: uniqueLanguages.length, label: 'Languages Used', color: 'purple' }
        ].map(({ count, label, color }, i) => (
          <div key={i} className={`rounded-2xl p-6 text-center ${glassPanelColor}`}>

            <div className={`text-3xl font-bold text-${color}-400 mb-2`}>{count}</div>
            <div className="text-gray-300">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map(project => (
          <div
  key={project.id || project.name}
  className={`rounded-2xl overflow-hidden group flex flex-col ${glassPanelColor} ${
    project.highlight ? 'ring-2 ring-blue-400/30' : ''
  }`}
>

            {project.highlight && (
              <div className="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-xs font-bold px-3 py-1 text-center">
                {projectsConfig?.highlightBadge || '⭐ FEATURED PROJECT'}
              </div>
            )}

            <div className="p-6 pb-4 flex-grow flex flex-col">
              <h3 className="text-xl font-bold text-white transition-colors mb-2">
                {project.name}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow">
                {project.custom_description || projectsConfig?.noDescription || 'No description available'}
              </p>
              {(Array.isArray(project.tech_stack) && project.tech_stack.length > 0) && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-400 mb-2">
                    {projectsConfig?.techStackLabel || 'Tech Stack:'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.tech_stack!.map(tech => (
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
            </div>

            <div className="px-6 pb-6">
              <div className="flex space-x-3">
                <a
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium"
                >
                  View Code
                </a>
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium"
                  >
                    Demo
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
          <h3 className="text-2xl font-bold text-red-400 mb-4">
            404
          </h3>
          <p className="text-gray-300 mb-6">
            No projects found matching your filters.
          </p>
          <a
            href={`https://github.com/${projectsConfig.githubUsername}`}
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full hover:scale-105"
          >
            Visit My GitHub
          </a>
        </div>
      )}

    </div>
  );
};

export default ProjectsPanel;
