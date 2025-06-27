import { Props, Audiobook } from './types';

export default function Main({ books }: Props) {
    return (
    
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {books.map((book: Audiobook, idx: number) => (
                    <a
                        key={idx}
                        href={book.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-gray-900 hover:bg-gray-800 transition-all rounded-xl shadow-lg overflow-hidden"
                    >
                        <img
                            src={book.image}
                            alt={`${book.title} cover`}
                            className="w-full h-60 object-cover"
                        />
                        <div className="p-4 text-white">
                            <h3 className="text-lg font-semibold group-hover:text-yellow-300 transition">
                                {book.title}
                            </h3>
                            <p className="text-sm opacity-80">{book.author}</p>
                        </div>
                    </a>
                ))}
            </div>
    );
}
