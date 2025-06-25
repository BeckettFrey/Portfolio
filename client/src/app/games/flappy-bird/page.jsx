import FlappyBird from '@games/FlappyBird';
import { CorePage } from '@layout';

export const metadata = {
  title: "Flappy Bird | Beckett Frey",
  description: "Play Flappy Bird and enjoy a classic gaming experience.",
};

const Page = () => {

  return (
    <CorePage header="Flappy Bird" showHomeButton={true} containerFixed={true}>
      <FlappyBird />
    </CorePage>
  );
};

export default Page;
