import { FaFolder, FaGithubAlt } from 'react-icons/fa';
import { ImPacman } from 'react-icons/im';
import { TbRectangularPrism } from 'react-icons/tb';
import { PiBirdFill } from 'react-icons/pi';
import { IoMdPhotos } from 'react-icons/io';
import { HiMiniDocumentDuplicate } from 'react-icons/hi2';


export const landingConstants = {
  folders: [
    { label: 'About', url: '/about' },
    { label: 'Projects', url: '/projects' },
    { label: 'Contact', url: '/contact' },
  ],
  theme: {
    colors: {
      primary: 'yellow-600',
      text: 'text-black',
      icon: 'text-white',
      iconHover: 'hover:text-gray-300',
      barBackground: 'bg-black bg-opacity-50',
    },
  },
};

const LandingPage = () => {
  const { theme, folders } = landingConstants;

  return (
    <div className="landing-page-container min-h-screen flex flex-col">
      {/* Top Overlay Bar */}
      <div
        className={`relative w-full h-11 ${theme.colors.barBackground} text-white flex items-center text-lg font-bold`}
      >
   

        {/* Portfolio Header - Centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1
            className="text-2xl font-bold text-white tracking-wider"
            style={{
              fontFamily: '"Helvetica Neue", "Arial Black", sans-serif',
              letterSpacing: '0.1em',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            SSH
          </h1>
        </div>
      </div>

      {/* Main Content Area with Side Bars */}
      <div className="flex flex-grow">

        {/* Desktop Icons/Folders - Main Content */}
        <div className="pt-8 flex-grow flex flex-wrap justify-start px-2 sm:px-8">
          {folders.map((folder, index) => (
            <a
              key={index}
              href={folder.url}
              className={`inline-block text-center no-underline ${theme.colors.text} align-middle w-1/3 px-2 sm:px-8 mb-8 flex flex-col items-center`}
            >
              <FaFolder className={`w-20 sm:w-24 h-20 sm:h-24 block mx-auto mb-2 text-${theme.colors.primary}`} />
              <span className="block bg-white bg-opacity-80 rounded-lg px-2 py-1 text-gray-800 shadow-sm text-base max-w-[120px] mx-auto">
                {folder.label}
              </span>
            </a>
          ))}

          <a
            href="/photos"
            className={`inline-block text-center no-underline ${theme.colors.text} align-middle w-1/3 px-2 sm:px-8 mb-8 flex flex-col items-center`}
          >
            <IoMdPhotos className="w-16 sm:w-20 h-16 sm:h-20 block mx-auto mb-2 text-pink-700" />
            <span className="block bg-white bg-opacity-80 rounded-lg px-2 py-1 text-gray-800 shadow-sm text-base max-w-[120px] mx-auto">
              Photos
            </span>
          </a>

          <a
            href="/github-activity"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block text-center no-underline ${theme.colors.text} align-middle w-1/3 px-2 sm:px-8 mb-8 flex flex-col items-center`}
          >
            <FaGithubAlt className="w-16 sm:w-20 h-16 sm:h-20 block mx-auto mb-2 text-pink-700" />
            <span className="block bg-white bg-opacity-80 rounded-lg px-2 py-1 text-gray-800 shadow-sm text-base max-w-[120px] mx-auto">
              Git Activity
            </span>
          </a>

          <a
            href="/beckettfrey_resume.pdf"
            download="beckettfrey_resume.pdf"
            className={`inline-block text-center no-underline ${theme.colors.text} align-middle w-1/3 px-2 sm:px-8 mb-8 flex flex-col items-center`}
          >
            <HiMiniDocumentDuplicate className="w-16 sm:w-20 h-16 sm:h-20 block mx-auto mb-2 text-pink-700" />
            <span className="block bg-white bg-opacity-80 rounded-lg px-2 py-1 text-gray-800 shadow-sm text-base max-w-[120px] mx-auto">
              Resume
            </span>
          </a>

          <a
            href="/games/pacman"
            className={`inline-block text-center no-underline ${theme.colors.text} align-middle w-1/3 px-2 sm:px-8 mb-8 flex flex-col items-center`}
          >
            <ImPacman className="w-16 sm:w-20 h-16 sm:h-20 block mx-auto mb-2 text-yellow-400" />
            <span className="block bg-white bg-opacity-80 rounded-lg px-2 py-1 text-gray-800 shadow-sm text-base max-w-[120px] mx-auto">
              Pacman
            </span>
          </a>

          <a
            href="/games/tetris"
            className={`inline-block text-center no-underline ${theme.colors.text} align-middle w-1/3 px-2 sm:px-8 mb-8 flex flex-col items-center`}
          >
            <TbRectangularPrism className="w-16 sm:w-20 h-16 sm:h-20 block mx-auto mb-2 text-blue-500" />
            <span className="block bg-white bg-opacity-80 rounded-lg px-2 py-1 text-gray-800 shadow-sm text-base max-w-[120px] mx-auto">
              Tetris
            </span>
          </a>

          <a
            href="/games/flappy-bird"
            className={`inline-block text-center no-underline ${theme.colors.text} align-middle w-1/3 px-2 sm:px-8 mb-8 flex flex-col items-center`}
          >
            <PiBirdFill className="w-16 sm:w-20 h-16 sm:h-20 block mx-auto mb-2 text-green-400" />
            <span className="block bg-white bg-opacity-80 rounded-lg px-2 py-1 text-gray-800 shadow-sm text-base max-w-[120px] mx-auto">
              Flappy Bird
            </span>
          </a>
        </div>


      </div>

      {/* Bottom Footer Bar */}
      <div
        className={`w-full h-11 ${theme.colors.barBackground} text-white flex items-center justify-center text-sm rounded-b-lg`}
      >
        <p className="text-center">© 2025 Beckett Frey</p>
      </div>
    </div>
  );
};

export default LandingPage;
