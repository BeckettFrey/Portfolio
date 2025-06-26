'use client';
import Tetris from '@games/Tetris';
import { CorePage } from '@layout';
import { useIsMobile } from '@/utils/hooks/useIsMobile';

const TetrisPageClient = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-screen h-screen overflow-hidden touch-none">
      <Tetris isMobile={isMobile} />
    </div>
  );
};

export default TetrisPageClient;
