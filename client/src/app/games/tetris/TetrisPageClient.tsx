'use client';
import Tetris from '@games/Tetris';
import { CorePage } from '@layout';
import { useIsMobile } from '@/utils/hooks/useIsMobile';

const TetrisPageClient = () => {
  const isMobile = useIsMobile();

  return (
    <CorePage header="Tetris" showHomeButton={true} containerFixed={true}>
      <Tetris isMobile={isMobile} />
    </CorePage>
  );
};

export default TetrisPageClient;
