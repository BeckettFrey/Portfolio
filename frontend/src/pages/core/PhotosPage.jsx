import { useState, useEffect } from 'react';
import { FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { usePortfolioConfig } from '../../context/PortfolioConfigProvider';

const PhotosPage = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { photosConfig } = usePortfolioConfig();

  // Handle keyboard navigation for photo viewer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedPhoto) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevPhoto();
          break;
        case 'ArrowRight':
          handleNextPhoto();
          break;
        case 'Escape':
          setSelectedPhoto(null);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  // Navigate to previous photo
  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photosConfig.findIndex(photo => photo.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + photosConfig.length) % photosConfig.length;
    setSelectedPhoto(photosConfig[prevIndex]);
  };

  // Navigate to next photo
  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photosConfig.findIndex(photo => photo.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % photosConfig.length;
    setSelectedPhoto(photosConfig[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      {/* Close Button */}
      <div className="absolute top-6 left-6 z-50 w-full">
        <a
          href="/"
          className="flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          onTouchStart={(e) => {
            e.stopPropagation();
            e.preventDefault();
            window.location.href = '/';
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            window.location.href = '/';
          }}
        >
          <FaTimes className="text-xl" />
        </a>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            My Photos
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Photo Grid */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Photo Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photosConfig.map((photo) => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-xl shadow-md cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2">
                  {photo.caption}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Credits */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Photo URLs loaded dynamically • From GitHub repository 
            Visit my <a href={`https://github.com/${import.meta.env.VITE_GITHUB_USERNAME || 'username'}`} className="text-blue-600 hover:underline">
              profile
            </a> for more information
          </p>
        </div>
      </div>

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Navigation Arrows */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-30 hover:bg-opacity-50 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
              onClick={handlePrevPhoto}
              onTouchStart={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-30 hover:bg-opacity-50 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
              onClick={handleNextPhoto}
              onTouchStart={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
            >
              <FaArrowRight className="text-xl" />
            </button>

            {/* Photo Display */}
            <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-100">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  className="w-full max-h-[80vh] object-contain rounded-xl"
                />
              <p className="text-center text-gray-800 mt-4 text-lg font-semibold">
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosPage;