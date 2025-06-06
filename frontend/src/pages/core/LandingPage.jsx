import { FaFolder } from 'react-icons/fa';
import { ImPacman } from "react-icons/im";
import { TbRectangularPrism } from "react-icons/tb"; 
import { PiBirdFill } from "react-icons/pi";
import { LANDING_PAGE_CONFIG } from './local_config/landingPageConfig';
import { IoMdPhotos } from "react-icons/io";
import { FaGithubAlt } from "react-icons/fa";
import { HiMiniDocumentDuplicate } from "react-icons/hi2";

const LandingPage = () => {
    const { theme, folders } = LANDING_PAGE_CONFIG;

    return (
        <div className="landing-page-container min-h-screen flex flex-col">
            {/* Top Overlay Bar */}
            <div className={`relative w-full h-11 ${theme.colors.barBackground} text-white flex items-center text-lg font-bold`}>
                {/* Logo */}
                <div className="h-5 mr-auto ml-4 w-12 flex items-center">
                    <img src="/favicon.ico" alt="Logo" className="h-8 w-auto" />
                </div>

                {/* Portfolio Header - Centered */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h1 className="text-4xl font-bold text-white tracking-wider" style={{ fontFamily: '"Helvetica Neue", "Arial Black", sans-serif', letterSpacing: '0.1em', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                        HOME
                    </h1>
                </div>
            </div>

            {/* Main Content Area with Side Bars */}
            <div className="flex flex-grow">
                {/* Left Side Bar */}
                <div className={`w-11 ${theme.colors.barBackground} flex flex-col hidden sm:block`}>
                    {/* Left sidebar content - empty for now but ready for navigation icons, etc */}
                </div>

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

                       {/* Photos Page */}
                    <a 
                        href="/photos" 
                        className={`inline-block text-center no-underline ${theme.colors.text} align-middle w-1/3 px-2 sm:px-8 mb-8 flex flex-col items-center`}
                    >
                        <IoMdPhotos className={`w-16 sm:w-20 h-16 sm:h-20 block mx-auto mb-2 text-pink-700`} />
                        <span className="block bg-white bg-opacity-80 rounded-lg px-2 py-1 text-gray-800 shadow-sm text-base max-w-[120px] mx-auto">
                            Photos
                        </span>
                    </a>

                    {/* GitHub Activity */}
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

                    {/* Resume Download */}
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

                    {/* Pacman Game */}
                    <a 
                        href="/games/pacman" 
                        className={`inline-block text-center no-underline ${theme.colors.text} align-middle w-1/3 px-2 sm:px-8 mb-8 flex flex-col items-center`}
                    >
                        <ImPacman className={`w-16 sm:w-20 h-16 sm:h-20 block mx-auto mb-2 text-yellow-400`} />
                        <span className="block bg-white bg-opacity-80 rounded-lg px-2 py-1 text-gray-800 shadow-sm text-base max-w-[120px] mx-auto">
                            Pacman
                        </span>
                    </a>

                    {/* Tetris Game */}
                    <a 
                        href="/games/tetris" 
                        className={`inline-block text-center no-underline ${theme.colors.text} align-middle w-1/3 px-2 sm:px-8 mb-8 flex flex-col items-center`}
                    >
                        <TbRectangularPrism className="w-16 sm:w-20 h-16 sm:h-20 block mx-auto mb-2 text-blue-500" />
                        <span className="block bg-white bg-opacity-80 rounded-lg px-2 py-1 text-gray-800 shadow-sm text-base max-w-[120px] mx-auto">
                            Tetris
                        </span>
                    </a>

                    {/* Flappy Bird Game */}
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

                {/* Right Side Bar */}
                <div className={`w-11 ${theme.colors.barBackground} flex flex-col hidden sm:block`}>
                    {/* Right sidebar content - empty for now but ready for tools, social links, etc */}
                </div>
            </div>

            {/* Bottom Footer Bar */}
            <div className={`w-full h-11 ${theme.colors.barBackground} text-white flex items-center justify-center text-sm rounded-b-lg`}>
                <p className="text-center">
                    © 2025 Beckett Frey
                </p>
            </div>
        </div>
    );
};

export default LandingPage;