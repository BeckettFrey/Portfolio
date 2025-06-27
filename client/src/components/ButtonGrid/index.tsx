
import Link from 'next/link';
import * as FaIcons from 'react-icons/fa';
import * as ImIcons from 'react-icons/im';
import * as TbIcons from 'react-icons/tb';
import * as PiIcons from 'react-icons/pi';
import * as IoIcons from 'react-icons/io';
import * as HiIcons from 'react-icons/hi2';

import { ButtonGridProps } from './types';
import { COLOR_CLASSES } from '@globals/constants';
import { panelInteractive as baseStyles } from '@globals/styles';

const ICON_LIBS = {
  ...FaIcons,
  ...ImIcons,
  ...TbIcons,
  ...PiIcons,
  ...IoIcons,
  ...HiIcons,
};

type IconTypes = typeof ICON_LIBS;

export default function ButtonGrid({ links }: ButtonGridProps) {
  // pick a random link every render
  const randomLink = links[Math.floor(Math.random() * links.length)];
  const isExternal = randomLink.external || randomLink.url.startsWith('http');

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6">
      {links.map(({ label, url, icon, color, external, download }) => {
        const Icon = ICON_LIBS[icon as keyof IconTypes];
        const isExternal = external || url.startsWith('http');

        const linkProps = {
          href: url,
          ...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
          ...(download ? { download } : {}),
        };

        const content = (
          <>
            {Icon && <Icon className={`text-4xl mb-4 ${COLOR_CLASSES[color]}`} />}
            <span className="text-white font-medium text-base text-center">{label}</span>
          </>
        );

        return isExternal || download ? (
          <a key={label} {...linkProps} className={baseStyles}>
            {content}
          </a>
        ) : (
          <Link key={label} href={url} className={baseStyles}>
            {content}
          </Link>
        );
      })}

      {/* Shuffle tile as a real Link */}
      {isExternal ? (
        <a
          href={randomLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${baseStyles} flex flex-col items-center justify-center`}
        >
          <FaIcons.FaRandom className="text-4xl mb-4 text-yellow-300" />
          <span className="text-white font-medium text-base text-center">Shuffle</span>
        </a>
      ) : (
        <Link
          href={randomLink.url}
          className={`${baseStyles} flex flex-col items-center justify-center`}
        >
          <FaIcons.FaRandom className="text-4xl mb-4 text-yellow-300" />
          <span className="text-white font-medium text-base text-center">Shuffle</span>
        </Link>
      )}
    </div>
  );
}
