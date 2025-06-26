import { CorePage } from '@/layout';
import FlappyBird from './FlappyBird';

export const metadata = {
  title: "Flappy Bird | Beckett Frey",
  description: "Play Flappy Bird and enjoy a classic gaming experience.",
};

const Page = () => {

  return (
    <CorePage header="" containerFixed={true}>
      <FlappyBird />
    </CorePage>
  );
};

export default Page;

