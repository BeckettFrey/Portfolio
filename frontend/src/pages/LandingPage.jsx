import { useState, useEffect } from 'react';
import { FaWifi, FaBatteryHalf, FaSearch, FaFolder } from 'react-icons/fa';

const LandingPage = () => {
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [showMagnifyPopup, setShowMagnifyPopup] = useState(false);
    const [showWifiPopup, setShowWifiPopup] = useState(false);
    const [showBatteryPopup, setShowBatteryPopup] = useState(false);

    useEffect(() => {
        const updateDateTime = () => {
            const currentDate = new Date();
            const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
            const formattedDate = currentDate.toLocaleDateString('en-US');
            const formattedTime = currentDate.toLocaleTimeString('en-US', timeOptions);
            setCurrentDateTime(`${formattedDate} ${formattedTime}`);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 60000);

        return () => clearInterval(interval);
    }, []);

    const showPopup = (type) => {
        if (type === 'magnify') setShowMagnifyPopup(true);
        if (type === 'wifi') setShowWifiPopup(true);
        if (type === 'battery') setShowBatteryPopup(true);

        setTimeout(() => {
            if (type === 'magnify') setShowMagnifyPopup(false);
            if (type === 'wifi') setShowWifiPopup(false);
            if (type === 'battery') setShowBatteryPopup(false);
        }, 5000);
    };

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            margin: 0,
            padding: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            backgroundImage: "url('/desktop_background.jpg')",
            position: 'relative',
        }}>
            
            {/* Top Overlay Bar */}
            <div className="relative w-full h-11 bg-black bg-opacity-50 text-white flex items-center text-lg font-bold">
                {/* Logo */}
                <div className="h-5 mr-auto ml-4 w-12 flex items-center">
                    <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                </div>

                {/* Desktop Icons */}
                <div className="cursor-pointer mt-1" onClick={() => showPopup('battery')}>
                    <FaBatteryHalf className="h-5 w-5 mx-2 text-white hover:text-gray-300" />
                </div>
                
                <div className="cursor-pointer mt-1" onClick={() => showPopup('wifi')}>
                    <FaWifi className="h-5 w-5 mx-2 text-white hover:text-gray-300" />
                </div>
                
                <div className="cursor-pointer mt-1" onClick={() => showPopup('magnify')}>
                    <FaSearch className="h-5 w-5 ml-2 mr-4 text-white hover:text-gray-300" />
                </div>
                
                {/* DateTime */}
                <div className="mr-4 text-sm">
                    {currentDateTime}
                </div>
            </div>

            {/* Desktop Icons/Folders */}
            <div className="pt-8">
                <a href="/about" className="inline-block text-center no-underline text-black align-middle mx-8">
                    <FaFolder className="w-24 h-24 block mx-auto mb-4 text-yellow-600" />
                    <span className="block">About</span>
                </a>
                
                <a href="/projects" className="inline-block text-center no-underline text-black align-middle mx-8">
                    <FaFolder className="w-24 h-24 block mx-auto mb-4 text-yellow-600" />
                    <span className="block">Projects</span>
                </a>
                
                <a href="/contact" className="inline-block text-center no-underline text-black align-middle mx-8">
                    <FaFolder className="w-24 h-24 block mx-auto mb-4 text-yellow-600" />
                    <span className="block">Contact</span>
                </a>
            </div>

            {/* Popups */}
            {showBatteryPopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-white border border-gray-300 shadow-lg z-50 rounded-lg">
                    <p className="text-black">
                        "I'd put my money on the sun and solar energy. What a source of power! I hope we don't have to wait until oil and coal run out before we tackle that."<br /><br />
                        - Thomas Edison
                    </p>
                </div>
            )}

            {showWifiPopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-white border border-gray-300 shadow-lg z-50 rounded-lg">
                    <p className="text-black">
                        "Consider frequently the connection of all things in the universe and their relation to one another."<br /><br />
                        - Marcus Aurelius
                    </p>
                </div>
            )}

            {showMagnifyPopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-white border border-gray-300 shadow-lg z-50 rounded-lg">
                    <p className="text-black">
                        "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle."<br /><br />
                        - Steve Jobs
                    </p>
                </div>
            )}
        </div>
    );
};

export default LandingPage;