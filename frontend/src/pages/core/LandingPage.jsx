import {
  FaFolder, FaGithubAlt, FaGraduationCap,
  FaCode, FaMapMarkerAlt, FaUtensils,
  FaDumbbell, FaBook
} from 'react-icons/fa';
import { ImPacman } from 'react-icons/im';
import { TbRectangularPrism } from 'react-icons/tb';
import { PiBirdFill } from 'react-icons/pi';
import { IoMdPhotos } from 'react-icons/io';
import { HiMiniDocumentDuplicate } from 'react-icons/hi2';

const ICON_LINKS = [
  { label: 'About', url: '/about', icon: FaFolder, color: 'blue' },
  { label: 'Projects', url: '/projects', icon: FaFolder, color: 'purple' },
  { label: 'Contact', url: '/contact', icon: FaFolder, color: 'green' },
  { label: 'Photos', url: '/photos', icon: IoMdPhotos, color: 'orange' },
  { label: 'Git Activity', url: '/github-activity', icon: FaGithubAlt, color: 'blue', external: true },
  { label: 'Resume', url: '/beckettfrey_resume.pdf', icon: HiMiniDocumentDuplicate, color: 'yellow', download: true },
  { label: 'Pacman', url: '/games/pacman', icon: ImPacman, color: 'yellow' },
  { label: 'Tetris', url: '/games/tetris', icon: TbRectangularPrism, color: 'purple' },
  { label: 'Flappy Bird', url: '/games/flappy-bird', icon: PiBirdFill, color: 'green' },
];

const COLOR_CLASSES = {
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  green: 'text-green-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
  yellow: 'text-yellow-300'
};


const LandingPage = () => {

  return (
    <>
    
      <div className="relative min-h-screen bg-green text-white font-sans overflow-hidden">

        {/* Main Content */}
        <div className="container mx-auto px-6 py-16 max-w-4xl z-10 relative">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
              SSH
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full" />
          </div>

          {/* Icon Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-12">
            {ICON_LINKS.map(({ label, url, icon: Icon, color, external, download }) => (
              <a
                key={label}
                href={url}
                {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                {...(download && { download })}
                className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/10 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-white/20"
              >
                <Icon className={`text-4xl mb-4 ${COLOR_CLASSES[color]}`} />
                <span className="text-white font-medium text-base text-center">
                  {label}
                </span>
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-400">
            <p>© 2025 Beckett Frey</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;