export const panel = `
  relative 
  bg-white/10 
  backdrop-blur-md 
  border border-white/20 
  rounded-3xl 
  shadow-xl 
  overflow-hidden 
  transition-all duration-300 
  p-8 flex flex-col
`;

export const panelInteractive = [
  'relative',
  'bg-white/15',
  'backdrop-blur-md',
  'border border-white/25',
  'rounded-3xl',
  'shadow-inner', 
  'overflow-hidden',
  'transition-all duration-300',
  'hover:scale-[1.02]',
  'hover:bg-white/20',
  'p-8',
  'flex flex-col items-center justify-center',
  // Inner depth effect
  'before:absolute before:inset-0',
  'before:rounded-3xl',
  'before:bg-gradient-to-b before:from-white/10 before:via-transparent before:to-black/10',
  'before:opacity-100',
  'before:pointer-events-none',
  // Glare swipe on hover
  'after:absolute after:inset-0',
  'after:bg-gradient-to-tr after:from-white/30 after:via-transparent after:to-white/10',
  'after:opacity-0 hover:after:opacity-100',
  'after:transition-opacity after:duration-300',
  'after:animate-glare',
  'after:pointer-events-none',
].join(' ');
