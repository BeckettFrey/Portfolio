import { useState, useEffect, useMemo } from 'react';
import { FaTimes } from 'react-icons/fa';
import { photosConfig } from './config';

const PhotosPage = () => {
  const photosArray = useMemo(() => Object.values(photosConfig), []);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  // Preload images for faster transitions
  useEffect(() => {
    const preloadImages = () => {
      photosArray.forEach((photo) => {
        const img = new Image();
        img.src = photo.url;
      });
    };
    preloadImages();
  }, [photosArray]);

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

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Block touch events except for close button and modal content
  useEffect(() => {
    if (!selectedPhoto) return;

    const handleTouchStart = (e) => {
      const closeButton = e.target.closest('button[aria-label="Close photo modal"]');
      const modalContent = e.target.closest('div[role="dialog"]');
      if (closeButton) {
        console.log('Close button touched');
        setSelectedPhoto(null);
      } else if (modalContent) {
        console.log('Modal content touched for swipe');
      } else {
        console.log('Document touch blocked');
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    return () => document.removeEventListener('touchstart', handleTouchStart);
  }, [selectedPhoto]);

  // Swipe gesture handling
  const handleTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].screenX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.changedTouches[0].screenX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;

    const swipeDistance = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      handleNextPhoto();
    } else if (swipeDistance < -minSwipeDistance) {
      handlePrevPhoto();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Navigate to previous photo
  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photosArray.findIndex((photo) => photo.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + photosArray.length) % photosArray.length;
    setSelectedPhoto(photosArray[prevIndex]);
  };

  // Navigate to next photo
  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photosArray.findIndex((photo) => photo.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % photosArray.length;
    setSelectedPhoto(photosArray[nextIndex]);
  };

  if (!photosArray || photosArray.length === 0) {
    return (
      <div className="relative min-h-screen text-white font-sans overflow-hidden">
        <style jsx>{`
          @media (max-width: 767px) {
            .container {
              padding-left: 8px;
              padding-right: 8px;
              padding-top: 8px;
              padding-bottom: 8px;
            }
          }
        `}</style>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">No Photos Available</h1>
            <p className="text-lg text-gray-300">Please check back later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden">
      <style jsx>{`
        @media (max-width: 767px) {
          .container {
            padding-left: 8px;
            padding-right: 8px;
            padding-top: 8px;
            padding-bottom: 8px;
          }
        }
        .photo-modal {
          pointer-events: all;
          touch-action: none;
        }
        .photo-modal img {
          clip-path: polygon(50px 0, 100% 0, 100% 100%, 0 100%, 0 50px);
        }
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: black;
          z-index: 40;
          pointer-events: auto; /* ← this is crucial */
          touch-action: none;   /* optional, but enforces no touch pass-through */
        }
        .close-button {
          touch-action: none;
        }
        .navigation-message {
          font-size: 0.875rem;
          opacity: 0.8;
        }
      `}</style>

      {/* Close Button (Page-level, hidden when modal is open) */}
      {!selectedPhoto && (
        <div className="absolute top-2 left-2 z-50">
          <a
            href="/"
            className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 close-button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              window.location.href = '/';
            }}
          >
            <FaTimes className="text-lg" />
          </a>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 max-w-lg relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 leading-tight">
            My Photos
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        {/* Photo Grid (Hidden when modal is open) */}
        {!selectedPhoto && (
          <div
            className={`bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/10 mb-8 ${
              selectedPhoto ? 'pointer-events-none' : ''
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {photosArray.map((photo) => (
                <div
                  key={photo.id}
                  className="relative overflow-hidden rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform duration-200 border border-white/10"
                  onClick={() => {
                    console.log('Grid photo clicked:', photo.id);
                    setSelectedPhoto(photo);
                  }}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm text-white text-xs p-2">
                    {photo.caption}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <>
          <div className="modal-backdrop" />
          <div
            className="fixed inset-0 z-50 flex items-center justify-center photo-modal"
            style={{ touchAction: 'none' }} // force block
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <div
              className="relative max-w-3xl w-full mx-4"
              tabIndex={0}
              role="dialog"
              aria-label={`Photo: ${selectedPhoto.caption}`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Exit Button */}
              <button
                className="absolute top-2 left-2 z-10 flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 close-button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  console.log('Close button clicked');
                  setSelectedPhoto(null);
                }}
                aria-label="Close photo modal"
              >
                <FaTimes className="text-lg" />
              </button>

              {/* Photo Display */}
              <div
                className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-white/10"
                role="img"
                aria-label={selectedPhoto.caption}
              >
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  className="w-full max-h-[70vh] object-contain rounded-lg"
                />
                <p className="text-center text-white mt-3 text-base font-semibold" aria-live="polite">
                  {selectedPhoto.caption}
                </p>
                <p
                  className="text-center text-white mt-2 navigation-message"
                  aria-live="polite"
                >
                  {isMobile
                    ? 'Swipe left or right to navigate.'
                    : 'Use arrow keys to navigate or Esc to close.'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer Credits */}
      <div className="text-center text-sm text-gray-400">
        <p>More photos coming soon!</p>
      </div>
    </div>
  );
};

export default PhotosPage;