import Image from 'next/image';
import ProfileImage from '@assets/profile.png';
import { aboutConfig as config } from './config';
import { GITHUB_USERNAME, LINKEDIN_URL } from '@globals/config/identity';
import {
  FaMapMarkerAlt, FaGithub, FaLinkedin, FaCode,
  FaGraduationCap, FaBrain, FaAtom, FaUtensils, FaDumbbell, FaBook,
  FaChessKing
} from 'react-icons/fa';
import { InterestItem, SocialLink } from './types';

const ICON_MAP = {
  FaCode,
  FaBrain,
  FaAtom,
  FaUtensils,
  FaDumbbell,
  FaBook,
  FaGithub,
  FaLinkedin,
  FaGraduationCap,
  FaChessKing
};

const COLOR_CLASSES = {
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  green: 'text-green-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
  yellow: 'text-yellow-300'
};

const AboutContent = () => {
  const socialLinks: SocialLink[] = [
    { platform: 'GitHub', url: `https://github.com/${GITHUB_USERNAME}`, icon: 'FaGithub', iconColor: 'white' },
    { platform: 'LinkedIn', url: LINKEDIN_URL, icon: 'FaLinkedin', iconColor: 'white' }
  ];

  const processText = (template: string, variables: Record<string, string> = {}) =>
    template.replace(/{(\w+)}/g, (_, key) => variables[key] ?? `[missing:${key}]`);

  const introText = processText(config?.introduction, { name: config?.name });

  const renderInterestItem = (item: InterestItem) => {
    const IconComponent = ICON_MAP[item.icon];
    const colorClass = COLOR_CLASSES[item.color];
    if (!IconComponent || !colorClass) return null;

    return (
      <div key={item.text} className="flex items-center p-3 bg-white/10 backdrop-blur-md rounded-xl hover:scale-[1.02] transition">
        <IconComponent className={`mr-3 text-xl ${colorClass}`} />
        <span className="text-white">{item.text}</span>
      </div>
    );
  };

  const renderSocialLink = ({ platform, url, icon, iconColor }: SocialLink) => {
    const IconComponent = ICON_MAP[icon];
    if (!IconComponent) return null;

    return (
      <a
        key={platform}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-black/70 hover:bg-black/90 px-6 py-3 rounded-full flex items-center text-white hover:scale-105 transition"
      >
        <IconComponent className={`mr-2 text-xl text-${iconColor}`} />
        <span>{platform}</span>
      </a>
    );
  };

  return (
    <>
      {/* Profile Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-12 border border-white/10">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-white mb-4">Hey there! 👋</h2>
            <div className="text-lg text-gray-300 leading-relaxed mb-6 space-y-4">
              {introText.split('\n\n').map((para, idx) => <p key={idx}>{para}</p>)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 p-4 rounded-xl hover:scale-[1.02]">
                <FaGraduationCap className="text-2xl text-blue-400 mx-auto mb-2" />
                <div className="font-semibold text-white">{config?.education?.title}</div>
                <div className="text-sm text-gray-300">{config?.education?.subtitle}</div>
              </div>

              <div className="bg-white/10 p-4 rounded-xl hover:scale-[1.02]">
                <FaCode className="text-2xl text-purple-400 mx-auto mb-2" />
                <div className="font-semibold text-white">{config?.role?.title}</div>
                <div className="text-sm text-gray-300">{config?.role?.subtitle}</div>
              </div>

              <div className="bg-white/10 p-4 rounded-xl hover:scale-[1.02]">
                <FaMapMarkerAlt className="text-2xl text-green-400 mx-auto mb-2" />
                <div className="font-semibold text-white">Based In</div>
                <div className="text-sm text-gray-300">
                  {`${config?.location?.city}, ${config?.location?.state}, ${config?.location?.country}`}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-xl overflow-hidden">
              <Image src={ProfileImage} alt={`${config?.name}'s Profile`} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FaBrain className="text-blue-400 mr-3" />
            Technical Interests
          </h3>
          <div className="space-y-4">
            {config.technicalInterests?.map(renderInterestItem).filter(Boolean)}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FaUtensils className="text-orange-400 mr-3" />
            Personal Interests
          </h3>
          <div className="space-y-4">
            {config.personalInterests?.map(renderInterestItem).filter(Boolean)}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4 text-white">{config.callToAction?.title}</h3>
        <p className="text-lg mb-6 opacity-90 text-white">{config.callToAction?.description}</p>
        <div className="flex justify-center space-x-4">
          {socialLinks.map(renderSocialLink).filter(Boolean)}
        </div>
      </div>
    </>
  );
};

export default AboutContent;
