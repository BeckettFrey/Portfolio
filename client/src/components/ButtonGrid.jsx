'use client';

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
import { NAME } from '@globals/config/identity';
import Link from 'next/link';

const ICON_LINKS = [
  { label: 'About', url: '/about', icon: FaFolder, color: 'blue' },
  { label: 'Projects', url: '/projects', icon: FaFolder, color: 'purple' },
  { label: 'Contact', url: '/contact', icon: FaFolder, color: 'green' },
  { label: 'Photos', url: '/photos', icon: IoMdPhotos, color: 'orange' },
  { label: 'Git Activity', url: '/git-activity', icon: FaGithubAlt, color: 'blue', external: true },
  {
    label: 'Resume',
    url: '/documents/resume.pdf',
    icon: HiMiniDocumentDuplicate,
    color: 'yellow',
    download: `${NAME.replace(" ", "_")}_resume.pdf`
  },
  { label: 'Flappy Bird', url: '/games/flappy-bird', icon: PiBirdFill, color: 'green' },
  { label: 'Pacman', url: '/games/pacman', icon: ImPacman, color: 'yellow' },
  { label: 'Tetris', url: '/games/tetris', icon: TbRectangularPrism, color: 'red' },
];

const COLOR_CLASSES = {
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  green: 'text-green-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
  yellow: 'text-yellow-300'
};

const glassPanel = `
  relative 
  bg-white/10 
  backdrop-blur-md 
  border border-white/20 
  rounded-3xl 
  shadow-xl 
  overflow-hidden 
  transition-all duration-300 
  hover:scale-105 
  hover:bg-white/20
  before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/50 before:to-transparent before:opacity-20 before:rounded-3xl before:pointer-events-none
  p-8 flex 
  flex-col
`;

const ButtonGrid = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6">
    {ICON_LINKS.map(({ label, url, icon: Icon, color, external, download }) => {
      const isExternal = external || url.startsWith('http');
      const linkProps = {
        href: url,
        ...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {}),
      };

      return isExternal || download ? (
        <a
          key={label}
          {...linkProps}
          {...(download ? { download } : {})}
          className={`${glassPanel} items-center justify-center`}
        >
          <Icon className={`text-4xl mb-4 ${COLOR_CLASSES[color]}`} />
          <span className="text-white font-medium text-base text-center">
            {label}
          </span>
        </a>
      ) : (
        <Link
          key={label}
          href={url}
          className={`${glassPanel} p-8 flex flex-col items-center justify-center`}
        >
          <Icon className={`text-4xl mb-4 ${COLOR_CLASSES[color]}`} />
          <span className="text-white font-medium text-base text-center">
            {label}
          </span>
        </Link>
      );
    })}
  </div>
);

export default ButtonGrid;
