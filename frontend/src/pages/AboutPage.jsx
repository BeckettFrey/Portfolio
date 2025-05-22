import ProfileImage from '../assets/profile.png';
import { FaGithub, FaLinkedin, FaTimes, FaCode, FaGraduationCap, FaBrain, FaAtom, FaUtensils, FaDumbbell, FaBook } from 'react-icons/fa';
import { ABOUT_PAGE_CONTENT, COLOR_CLASSES, processText } from './constants/aboutPageConstants';

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
  const content = ABOUT_PAGE_CONTENT;

  // Process introduction text with name replacement
  const introText = processText(content.profile.introduction, {
    name: content.profile.name
  });

  // Helper function to render interest items
  const renderInterestItem = (item) => {
    const IconComponent = ICON_MAP[item.icon];
    const colorClasses = COLOR_CLASSES[item.color];
    
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
    
    return (
      <a 
        key={link.platform}
        href={link.url} 
        className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-full transition-all duration-300 flex items-center text-black"
      >
        <IconComponent className={`mr-2 text-xl text-${link.iconColor}`} />
        <span className="text-black">{link.platform}</span>
      </a>
    );
  };

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
          <h1 className={`text-6xl font-bold bg-gradient-to-r from-${content.theme.colors.gradientFrom} to-${content.theme.colors.gradientTo} bg-clip-text text-transparent mb-6`}>
            {content.header.title}
          </h1>
          <div className={`w-24 h-1 bg-gradient-to-r from-${content.theme.colors.gradientFrom} to-${content.theme.colors.gradientTo} mx-auto rounded-full`}></div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{content.profile.greeting}</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {introText}
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 rounded-xl p-4">
                  <FaGraduationCap className="text-2xl text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-800">{content.profile.quickStats.education.title}</div>
                  <div className="text-sm text-gray-600">{content.profile.quickStats.education.subtitle}</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <FaCode className="text-2xl text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-800">{content.profile.quickStats.role.title}</div>
                  <div className="text-sm text-gray-600">{content.profile.quickStats.role.subtitle}</div>
                </div>
              </div>
            </div>
            
            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-xl flex items-center justify-center overflow-hidden">
                <img 
                  src={ProfileImage} 
                  alt={`${content.profile.name}'s Profile`} 
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
              {content.technicalInterests.title}
            </h3>
            <div className="space-y-4">
              {content.technicalInterests.items.map(renderInterestItem)}
            </div>
          </div>

          {/* Personal Interests */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaUtensils className="text-orange-600 mr-3" />
              {content.personalInterests.title}
            </h3>
            <div className="space-y-4">
              {content.personalInterests.items.map(renderInterestItem)}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-white">{content.callToAction.title}</h3>
          <p className="text-lg mb-6 opacity-90 text-white">
            {content.callToAction.description}
          </p>
          <div className="flex justify-center space-x-4">
            {content.callToAction.socialLinks.map(renderSocialLink)}
          </div>
        </div>

        {/* Footer Credits */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            {content.footer.credits.split(' ').slice(0, 2).join(' ')} <a href={content.footer.creditsUrl} className="text-blue-600 hover:underline">{content.footer.credits.split(' ').slice(2).join(' ')}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;