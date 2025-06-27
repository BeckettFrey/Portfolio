export default async function RandomQuote() {
  const res = await fetch('https://zenquotes.io/api/random', {
    cache: 'no-store',
  });

  const data = await res.json();
  const quote = data[0];

  return (
    <div className="mt-6 text-center text-white">
      <blockquote className="italic text-lg max-w-xl mx-auto">
        “{quote.q}”
      </blockquote>
      <p className="mt-2 text-sm text-gray-300">— {quote.a}</p>
    </div>
  );
}
