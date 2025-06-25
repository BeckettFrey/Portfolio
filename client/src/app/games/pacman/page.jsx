
import Pacman from '@games/Pacman';
import { CorePage } from '@layout';

export const metadata = {
  title: "Pacman | Beckett Frey",
  description: "Play Pacman and enjoy a classic gaming experience.",
};

const Page = () => {

  return (
    <CorePage header="Pacman" showHomeButton={true} containerFixed={true}>
      <Pacman  />
    </CorePage>
  );
};

export default Page;
