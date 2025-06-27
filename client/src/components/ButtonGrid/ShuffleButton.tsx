'use client';

import { useRouter } from 'next/navigation';
import { PiQuestionMarkFill } from 'react-icons/pi';
import { LinkItem } from './types'; 

export default function ShuffleButton({ links }: { links: LinkItem[] }) {
  const router = useRouter();

  const handleShuffleClick = () => {
    const random = links[Math.floor(Math.random() * links.length)];
    if (random.external) {
      window.open(random.url, '_blank');
    } else {
      router.push(random.url);
    }
  };

  return (
    <button
      onClick={handleShuffleClick}
      className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white/20 p-8 flex flex-col items-center justify-center"
    >
      <PiQuestionMarkFill className="text-4xl mb-4 text-white" />
      <span className="text-white font-medium text-base text-center">Surprise Me</span>
    </button>
  );
}
