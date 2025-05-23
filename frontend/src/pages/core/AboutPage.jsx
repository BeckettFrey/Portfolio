import { usePortfolioConfig } from '../../context/PortfolioConfigProvider'; // Adjust path to where the context is defined
import ProfileImage from '../../assets/profile.png';
import { COLOR_CLASSES } from '../local_config/aboutPageConfig';
import { FaGithub, FaLinkedin, FaTimes, FaCode, FaGraduationCap, FaBrain, FaAtom, FaUtensils, FaDumbbell, FaBook } from 'react-icons/fa';

// Icon mapping for dynamic icon rendering
const ICON_MAP = {
  FaCode,
  FaBrain,
  FaAtom,
  FaUtensils,
  FaDumbbell,
  FaBook,
  FaGithub,
  FaLinkedin,
  FaGraduationCap
};

const AboutPage = () => {
  const { aboutConfig, loading, error } = usePortfolioConfig();
  
  // Process introduction text with name replacement
  const processText = (text, replacements = {}) => {
    let processedText = text || '';
    Object.entries(replacements).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      processedText = processedText.replace(new RegExp(placeholder, 'g'), value);
    });
    return processedText;
  };

  // Helper function to render interest items
  const renderInterestItem = (item) => {
    const IconComponent = ICON_MAP[item.icon];
    const colorClasses = COLOR_CLASSES[item.color];
    
    if (!IconComponent || !colorClasses) {
      return null;
    }
    
    return (
      <div key={item.text} className={`flex items-center p-3 ${colorClasses.bg} rounded-xl`}>
        <IconComponent className={`${colorClasses.icon} mr-3`} />
        <span className="text-gray-700">{item.text}</span>
      </div>
    );
  };

  // Helper function to render social links
  const renderSocialLink = (link) => {
    const IconComponent = ICON_MAP[link.icon];
    
    if (!IconComponent) {
      return null;
    }
    
    return (
      <a 
        key={link.platform}
        href={link.url} 
        className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-full transition-all duration-300 flex items-center text-black"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconComponent className={`mr-2 text-xl text-${link.iconColor}`} />
        <span className="text-black">{link.platform}</span>
      </a>
    );
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-xl p-8 max-w-md">
          <div className="text-6xl mb-4">{aboutConfig?.error?.emoji || '😓'}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{aboutConfig?.error?.title || 'Configuration Error'}</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">{error}</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-700 mb-2">To set up your portfolio:</p>
            <ol className="text-xs text-gray-600 space-y-1">
              {aboutConfig?.error?.instructions?.map((step, index) => (
                <li key={index}>{`${index + 1}. ${step}`}</li>
              )) || (
                <>
                  <li>1. Create a repository named "portfolio-config" on GitHub.</li>
                  <li>2. Add a config.json file with the required structure.</li>
                  <li>3. Ensure VITE_GITHUB_USERNAME and VITE_PORTFOLIO_CONFIG_REPO are set in your environment.</li>
                </>
              )}
            </ol>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            {aboutConfig?.error?.tryAgainButton || 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  // Ensure aboutConfig exists before accessing its properties
  if (!aboutConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-xl p-8 max-w-md">
          <div className="text-6xl mb-4">😓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Configuration Error</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">No configuration data available.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const introText = processText(aboutConfig.profile?.introduction, {
    name: aboutConfig.profile?.name || 'User'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      {/* Close Button */}
      <div className="fixed top-6 left-6 z-50">
        <a 
          href="/" 
          className="flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <FaTimes className="text-xl" />
        </a>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {aboutConfig.header?.title || 'About Me'}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Hey there! 👋</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {introText}
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 rounded-xl p-4">
                  <FaGraduationCap className="text-2xl text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-800">{aboutConfig.profile?.quickStats?.education?.title || 'Education'}</div>
                  <div className="text-sm text-gray-600">{aboutConfig.profile?.quickStats?.education?.subtitle || 'N/A'}</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <FaCode className="text-2xl text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-800">{aboutConfig.profile?.quickStats?.role?.title || 'Role'}</div>
                  <div className="text-sm text-gray-600">{aboutConfig.profile?.quickStats?.role?.subtitle || 'N/A'}</div>
                </div>
              </div>
            </div>
            
            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-xl flex items-center justify-center overflow-hidden">
                <img 
                  src={ProfileImage} 
                  alt={`${aboutConfig.profile?.name || 'User'}'s Profile`} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Technical Interests */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaBrain className="text-blue-600 mr-3" />
              {aboutConfig.technicalInterests?.title || 'Technical Interests'}
            </h3>
            <div className="space-y-4">
              {aboutConfig.technicalInterests?.items?.map(renderInterestItem).filter(Boolean) || <p className="text-gray-600">No technical interests available.</p>}
            </div>
          </div>

          {/* Personal Interests */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaUtensils className="text-orange-600 mr-3" />
              {aboutConfig.personalInterests?.title || 'Personal Interests'}
            </h3>
            <div className="space-y-4">
              {aboutConfig.personalInterests?.items?.map(renderInterestItem).filter(Boolean) || <p className="text-gray-600">No personal interests available.</p>}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-white">{aboutConfig.callToAction?.title || 'Connect with Me'}</h3>
          <p className="text-lg mb-6 opacity-90 text-white">
            {aboutConfig.callToAction?.description || 'Let’s connect and collaborate!'}
          </p>
          <div className="flex justify-center space-x-4">
            {aboutConfig.callToAction?.socialLinks?.map(renderSocialLink).filter(Boolean) || <p className="text-white opacity-90">No social links available.</p>}
          </div>
        </div>

        {/* Footer Credits */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Configuration dynamically loaded from GitHub • 
            Visit my <a href={`https://github.com/${import.meta.env.VITE_GITHUB_USERNAME || 'username'}`} className="text-blue-600 hover:underline">
              profile
            </a> for more information
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;