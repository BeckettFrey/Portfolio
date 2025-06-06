    import { MdEmail } from 'react-icons/md';

    function Header() {
        return (
            <header className="bg-green-600 text-white py-8 shadow-lg">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center space-x-3">
                        <img 
                            src="/four_lakes/logo_bare.png" 
                            alt="FourLakesDetailing Logo" 
                            className="w-14 h-14 object-contain drop-shadow-sm" 
                        />
                            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">FourLakesDetailing</h1>
                    </div>
                    <p className="text-xl mt-3 text-blue-100">
                        Premier Boat Detailing in Madison, Wisconsin
                    </p>
                </div>
            </header>
        );
    }

    function Hero() {
        return (
            <section className="bg-gradient-to-br from-gray-50 to-blue-100 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        Revive Your Boat's Shine
                    </h2>
                    <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
                        At FourLakesDetailing, we bring your boat back to life with expert detailing services tailored to Madison's unique lakes.
                    </p>
                    <a 
                        href="#contact" 
                        className="inline-block bg-blue-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-950 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Get a Quote
                    </a>
                </div>
            </section>
        );
    }

    function FounderCard({ name, quote, image }) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="mb-6">
                    {image.includes('placeholder') ? (
                        <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-green-600 to-blue-900 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {name.split(' ').map(n => n[0]).join('')}
                        </div>
                    ) : (
                        <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-green-600 to-blue-900 flex items-center justify-center shadow-lg">
                            <img
                                src={image}
                                alt={name}
                                className="w-28 h-28 rounded-full object-contain"
                            />
                        </div>
                    )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{name}</h3>
                <p className="text-gray-600 italic text-lg leading-relaxed">"{quote}"</p>
            </div>
        );
    }

    function Founders() {
        const founders = [
            {
                name: "Harper Frey",
                quote: "I grew up on these lakes and know how important it is to keep our boats looking their best.",
                image: "/four_lakes/harper.png"
            },
            {
                name: "James Beyler",
                quote: "I believe in the power of a clean boat to enhance your entire boating experience.",
                image: "/four_lakes/james.png"
            },
            {
                name: "Sawyer Stair",
                quote: "Attention to detail is what sets us apart. Every boat deserves to shine.",
                image: "/four_lakes/sawyer.png" 
            }
        ];    return (
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                
                    <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">

                        {founders.map((founder, index) => (
                            <FounderCard
                                key={index}
                                name={founder.name}
                                quote={founder.quote}
                                image={founder.image}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    function Contact() {
        return (
            <section id="contact" className="bg-gradient-to-br from-blue-100 to-gray-50 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6 text-gray-900">Contact Us</h2>
                    <p className="text-xl text-gray-700 mb-10 leading-relaxed">
                        Ready to make your boat sparkle? Reach out to us today!
                    </p>
                    <div className="flex justify-center">
                        <a 
                            href="mailto:fourlakesdetailing@outlook.com" 
                            className="inline-flex items-center justify-center bg-blue-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-950 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <MdEmail className="w-5 h-5 mr-2" />
                            Email Us
                        </a>
                    </div>
                    <div className="mt-12 max-w-md mx-auto">
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">Email</h3>
                            <p className="text-gray-600">fourlakesdetailing@outlook.com</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    function Footer() {
        return (
            <footer className="bg-green-600 text-white py-8">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <img 
                            src="/four_lakes/logo_bare.png" 
                            alt="FourLakesDetailing Logo" 
                            className="w-12 h-12 object-contain drop-shadow-sm" 
                        />
                        <span className="text-xl font-bold">FourLakesDetailing</span>
                    </div>
                    <p className="text-blue-100 text-lg">
                        &copy; {new Date().getFullYear()} FourLakesDetailing. All rights reserved.
                    </p>
                    <p className="mt-2 text-blue-200">Madison, Wisconsin</p>
                </div>
            </footer>
        );
    }

    export default function FourLakes() {
        return (
            <div className="min-h-screen">
                <Header />
                <Hero />
                <Founders />
                <Contact />
                <Footer />
            </div>
        );
    }
