
import { CorePage } from '@/layout';
import Pacman from './Pacman';


export const metadata = {
  title: "Pacman | Beckett Frey",
  description: "Play Pacman and enjoy a classic gaming experience.",
};

const Page = () => {

  return (
    <CorePage header="" containerFixed={true}>
      <Pacman  />
    </CorePage>
  );
};

export default Page;
