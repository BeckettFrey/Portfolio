import { ButtonGridProps } from '@/components/ButtonGrid/types';
import { NAME } from '@globals/config/identity';

// Define the links for the button grid
export const IconLinks: ButtonGridProps['links'] = [
  { label: 'About', url: '/about', icon: 'FaFolder', color: 'blue' },
  { label: 'Projects', url: '/projects', icon: 'FaFolder', color: 'purple' },
  { label: 'Contact', url: '/contact', icon: 'FaFolder', color: 'green' },
  // { label: 'Photos', url: '/photos', icon: 'IoMdPhotos', color: 'orange' },
  { label: 'Git Activity', url: '/git-activity', icon: 'FaGithubAlt', color: 'blue', external: true },
  {
    label: 'Resume',
    url: '/documents/resume.pdf',
    icon: 'HiMiniDocumentDuplicate',
    color: 'yellow',
    download: `${NAME.replace(" ", "_")}_resume.pdf`
  },
  { label: 'Chess', url: 'https://chess-link-client.vercel.app', icon: 'FaChessKnight', color: 'blue' },
  { label: 'Music', url: '/music', icon: 'FaMusic', color:'yellow' },
  { label: "Books", url: '/books', icon: 'FaBook', color: 'green' },
];