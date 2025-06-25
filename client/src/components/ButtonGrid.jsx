// components/ButtonGrid.tsx
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
  }
];

const COLOR_CLASSES = {
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  green: 'text-green-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
  yellow: 'text-yellow-300'
};

const ButtonGrid = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-12">
    {ICON_LINKS.map(({ label, url, icon: Icon, color, external, download }) => (
      <Link
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
      </Link>
    ))}
  </div>
);

export default ButtonGrid;
