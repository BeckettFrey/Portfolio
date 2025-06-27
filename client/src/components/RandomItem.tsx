
export default function RandomItem({items}: {items: string[]}) {
  const random = items[Math.floor(Math.random() * items.length)];

  return (
    <div className="mt-6 text-center text-white text-lg font-semibold">
      🎲 Random Pick: <span className="text-blue-400">{random}</span>
    </div>
  );
}
