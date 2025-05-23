import { useState, useEffect } from 'react';
import { FaWifi, FaBatteryHalf, FaSearch, FaFolder } from 'react-icons/fa';
import { LANDING_PAGE_CONFIG } from '../local_config/landingPageConfig';

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

  const { theme, folders, popups } = LANDING_PAGE_CONFIG;

  return (
    <div className="landing-page-container">
      {/* Top Overlay Bar */}
      <div className={`relative w-full h-11 ${theme.colors.barBackground} text-white flex items-center text-lg font-bold`}>
        {/* Logo */}
        <div className="h-5 mr-auto ml-4 w-12 flex items-center">
          <img src="/favicon.png" alt="Logo" className="h-8 w-auto" />
        </div>

        {/* Desktop Icons */}
        <div className="cursor-pointer mt-1" onClick={() => showPopup('battery')}>
          <FaBatteryHalf className={`h-5 w-5 mx-2 ${theme.colors.icon} ${theme.colors.iconHover}`} />
        </div>
        
        <div className="cursor-pointer mt-1" onClick={() => showPopup('wifi')}>
          <FaWifi className={`h-5 w-5 mx-2 ${theme.colors.icon} ${theme.colors.iconHover}`} />
        </div>
        
        <div className="cursor-pointer mt-1" onClick={() => showPopup('magnify')}>
          <FaSearch className={`h-5 w-5 ml-2 mr-4 ${theme.colors.icon} ${theme.colors.iconHover}`} />
        </div>
        
        {/* DateTime */}
        <div className="mr-4 text-sm">
          {currentDateTime}
        </div>
      </div>

      {/* Desktop Icons/Folders */}
      <div className="pt-8">
        {folders.map((folder, index) => (
          <a 
            key={index}
            href={folder.url} 
            className={`inline-block text-center no-underline ${theme.colors.text} align-middle mx-8`}
          >
            <FaFolder className={`w-24 h-24 block mx-auto mb-4 text-${theme.colors.primary}`} />
            <span className="block bg-white bg-opacity-80 rounded-lg px-3 py-1 text-gray-800 shadow-sm">
              {folder.label}
            </span>
          </a>
        ))}
      </div>

      {/* Popups */}
      {showBatteryPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-white border border-gray-300 shadow-lg z-50 rounded-lg">
          <p className="text-black">
            "{popups.battery.quote}"<br /><br />
            - {popups.battery.author}
          </p>
        </div>
      )}

      {showWifiPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-white border border-gray-300 shadow-lg z-50 rounded-lg">
          <p className="text-black">
            "{popups.wifi.quote}"<br /><br />
            - {popups.wifi.author}
          </p>
        </div>
      )}

      {showMagnifyPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-white border border-gray-300 shadow-lg z-50 rounded-lg">
          <p className="text-black">
            "{popups.magnify.quote}"<br /><br />
            - {popups.magnify.author}
          </p>
        </div>
      )}
    </div>
  );
};

export default LandingPage;