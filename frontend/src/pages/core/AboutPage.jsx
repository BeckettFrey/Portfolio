import ProfileImage from '../../assets/profile.png';
import { aboutConfig as config } from './config';
import { GITHUB_USERNAME, LINKEDIN_URL } from './config';
import { FaMapMarkerAlt } from 'react-icons/fa';
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

const COLOR_CLASSES = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: "text-blue-600"
    
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    icon: "text-purple-600"
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-600",
    icon: "text-green-600"
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    icon: "text-orange-600"
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-600",
    icon: "text-red-600"
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    icon: "text-yellow-600"
  }
};

const AboutPage = () => {
  
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
    console.log("Rendering interest item:", item);
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
  const renderSocialLink = ({ platform, url, icon, iconColor }) => {
    const IconComponent = ICON_MAP[icon];
    
    if (!IconComponent) {
      return null;
    }
    
    return (
      <a 
        key={platform}
        href={url} 
        className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-full transition-all duration-300 flex items-center text-black opacity-80"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconComponent className={`mr-2 text-xl text-${iconColor}`} />
        <span className="text-black">{platform}</span>
      </a>
    );
  };

  const introText = processText(config?.introduction, {
    name: config?.name
  });

  // Define social links using GITHUB_USERNAME and LINKEDIN_URL
  const socialLinks = [
    {
      platform: 'GitHub',
      url: `https://github.com/${GITHUB_USERNAME}`,
      icon: 'FaGithub',
      iconColor: 'gray-900'
    },
    {
      platform: 'LinkedIn',
      url: LINKEDIN_URL,
      icon: 'FaLinkedin',
      iconColor: 'blue-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      {/* Close Button */}
      <div className="absolute top-6 left-6 z-50 w-full">
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
            About Me
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
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
  {/* Education */}
  <div className="bg-blue-50 rounded-xl p-4">
    <FaGraduationCap className="text-2xl text-blue-600 mx-auto mb-2" />
    <div className="font-semibold text-gray-800">{config?.education?.title}</div>
    <div className="text-sm text-gray-600">{config?.education?.subtitle}</div>
  </div>

  {/* Role */}
  <div className="bg-purple-50 rounded-xl p-4">
    <FaCode className="text-2xl text-purple-600 mx-auto mb-2" />
    <div className="font-semibold text-gray-800">{config?.role?.title}</div>
    <div className="text-sm text-gray-600">{config?.role?.subtitle}</div>
  </div>

  {/* Location */}
  <div className="bg-green-50 rounded-xl p-4">
    <FaMapMarkerAlt className="text-2xl text-green-600 mx-auto mb-2" />
    <div className="font-semibold text-gray-800">Based In</div>
    <div className="text-sm text-gray-600">
      {`${config?.location?.city}, ${config?.location?.state}, ${config?.location?.country}`}
    </div>
  </div>
</div>
            </div>
            
            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-xl flex items-center justify-center overflow-hidden">
                <img 
                  src={ProfileImage} 
                  alt={`${config?.name}'s Profile`} 
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
              Technical Interests
            </h3>
            <div className="space-y-4">
              {config.technicalInterests?.map(renderInterestItem).filter(Boolean) || <p className="text-gray-600">No technical interests available.</p>}
            </div>
          </div>

          {/* Personal Interests */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaUtensils className="text-orange-600 mr-3" />
              Personal Interests
            </h3>
            <div className="space-y-4">
              {config.personalInterests?.items?.map(renderInterestItem).filter(Boolean) || <p className="text-gray-600">No personal interests available.</p>}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-white">{config.callToAction?.title}</h3>
          <p className="text-lg mb-6 opacity-90 text-white">
            {config.callToAction?.description}
          </p>
          <div className="flex justify-center space-x-4">
            {socialLinks.map(renderSocialLink).filter(Boolean)}
          </div>
        </div>

        {/* Footer Credits */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
           A simple hello could lead to a million things.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;