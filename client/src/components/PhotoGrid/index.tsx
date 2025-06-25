'use client';

import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { photosConfig } from './config';
import type { PhotoGridProps } from './types';
import { useIsMobile } from '@/utils/hooks/useIsMobile';

const PhotoGrid = ({ selectedPhoto, setSelectedPhoto }: PhotoGridProps) => {
const isMobile = useIsMobile(768); // Custom hook to check if the device is mobile
  const photosArray = photosConfig;
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  useEffect(() => {
    photosArray.forEach((photo) => {
      const img = new Image();
      img.src = photo.url;
    });
  }, [photosArray]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.changedTouches[0].screenX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEndX(e.changedTouches[0].screenX);
  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const swipeDistance = touchStartX - touchEndX;
    const minSwipeDistance = 50;
    if (swipeDistance > minSwipeDistance) handleNextPhoto();
    else if (swipeDistance < -minSwipeDistance) handlePrevPhoto();
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photosArray.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + photosArray.length) % photosArray.length;
    setSelectedPhoto(photosArray[prevIndex]);
  };

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photosArray.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % photosArray.length;
    setSelectedPhoto(photosArray[nextIndex]);
  };

  return (
    <div className="relative z-10">
      {!selectedPhoto && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photosArray.map((photo) => (
            <div
              key={photo.id}
              className="relative overflow-hidden rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform duration-200 border border-white/10"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img src={photo.url} alt={photo.caption} className="w-full h-40 object-cover" loading="lazy" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
                {photo.caption}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div
            className="relative max-w-3xl w-full mx-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button
              className="absolute top-2 left-2 z-10 flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close photo modal"
            >
              <FaTimes className="text-lg" />
            </button>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-white/10">
              <img src={selectedPhoto.url} alt={selectedPhoto.caption} className="w-full max-h-[70vh] object-contain rounded-lg" />
              <p className="text-center text-white mt-3 text-base font-semibold">{selectedPhoto.caption}</p>
              <p className="text-center text-white mt-2 text-sm opacity-80">
                {isMobile ? 'Swipe to navigate' : 'Use ← → arrows or Esc to close'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;
