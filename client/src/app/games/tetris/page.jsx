
import { CorePage } from '@/layout';
import { TetrisPageClient } from './Tetris';
export const metadata = {
  title: "Tetris | Beckett Frey",
  description: "Play Tetris and enjoy a classic gaming experience.",
};

export default function Page() {
  return (
  <CorePage header="" containerFixed={true}>
    <TetrisPageClient />
  </CorePage>
  );
}