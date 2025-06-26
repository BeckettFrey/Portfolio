
import Pacman from './Pacman';


export const metadata = {
  title: "Pacman | Beckett Frey",
  description: "Play Pacman and enjoy a classic gaming experience.",
};

const Page = () => {

  return (
    <div className="w-screen h-screen overflow-hidden touch-none">
      <Pacman  />
    </div>
  );
};

export default Page;
