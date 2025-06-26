import FlappyBird from './FlappyBird';

export const metadata = {
  title: "Flappy Bird | Beckett Frey",
  description: "Play Flappy Bird and enjoy a classic gaming experience.",
};

const Page = () => {

  return (
    <div className="w-screen h-screen overflow-hidden touch-none">
      <FlappyBird />
      </div>
    
  );
};

export default Page;

