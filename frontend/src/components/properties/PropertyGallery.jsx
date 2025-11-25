import React, { useState } from 'react';
import Modal from '../common/Modal';

const PropertyGallery = ({ images, title, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FIX: Extract URLs from image objects or handle string URLs
  const getImageUrl = (image) => {
    if (typeof image === 'string') return image;
    if (image && image.url) return image.url;
    if (image && image.path) return image.path;
    return null;
  };

  const getImageAlt = (image, index) => {
    if (typeof image === 'string') return `${title} - Image ${index + 1}`;
    if (image && image.originalName) return image.originalName;
    if (image && image.filename) return image.filename;
    return `${title} - Image ${index + 1}`;
  };

  // Process images to ensure we have valid URLs
  const processedImages = React.useMemo(() => {
    if (!images || !Array.isArray(images)) return [];
    
    return images
      .map(img => getImageUrl(img))
      .filter(url => url && url !== '');
  }, [images]);

  if (!processedImages || processedImages.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-2xl flex items-center justify-center h-64 ${className}`}>
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  const mainImage = processedImages[currentIndex];
  const thumbnailImages = processedImages.slice(0, 5); // Show max 5 thumbnails

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === processedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? processedImages.length - 1 : prevIndex - 1
    );
  };

  const openModal = (index = 0) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={`${className}`}>
        {/* Main Image */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-200">
          <img
            src={mainImage}
            alt={getImageAlt(images?.[currentIndex], currentIndex)}
            className="w-full h-96 object-cover cursor-pointer"
            onClick={() => openModal(currentIndex)}
            onError={(e) => {
              console.error('❌ Image failed to load:', mainImage);
              e.target.src = '/images/placeholder-property.jpg';
            }}
          />

          {/* Navigation Arrows */}
          {processedImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all duration-200 shadow-lg"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all duration-200 shadow-lg"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {processedImages.length}
          </div>

          {/* Expand Button */}
          <button
            onClick={() => openModal(currentIndex)}
            className="absolute bottom-4 left-4 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all duration-200 shadow-lg"
          >
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
        </div>

        {/* Thumbnails */}
        {processedImages.length > 1 && (
          <div className="grid grid-cols-5 gap-2 mt-3">
            {thumbnailImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  currentIndex === index 
                    ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-30 shadow-md' 
                    : 'border-transparent hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <img
                  src={image}
                  alt={getImageAlt(images?.[index], index)}
                  className="w-full h-16 object-cover"
                  onError={(e) => {
                    console.error('❌ Thumbnail failed to load:', image);
                    e.target.src = '/images/placeholder-property.jpg';
                  }}
                />
                {index === 4 && processedImages.length > 5 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      +{processedImages.length - 5}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Fullscreen View */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        size="full"
        closeOnOverlayClick={true}
      >
        <div className="relative h-full flex items-center justify-center bg-black">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 z-10 bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-200"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Main Image */}
          <img
            src={processedImages[currentIndex]}
            alt={getImageAlt(images?.[currentIndex], currentIndex)}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              console.error('❌ Fullscreen image failed to load:', processedImages[currentIndex]);
              e.target.src = '/images/placeholder-property.jpg';
            }}
          />

          {/* Navigation Arrows */}
          {processedImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-200"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-200"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full font-medium">
            {currentIndex + 1} / {processedImages.length}
          </div>

          {/* Thumbnail Strip */}
          {processedImages.length > 1 && (
            <div className="absolute bottom-6 left-6 right-6 flex justify-center space-x-2">
              {processedImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-12 h-12 rounded border-2 transition-all duration-200 ${
                    currentIndex === index 
                      ? 'border-white ring-2 ring-white ring-opacity-50' 
                      : 'border-transparent hover:border-white hover:border-opacity-50'
                  }`}
                >
                  <img
                    src={image}
                    alt={getImageAlt(images?.[index], index)}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      console.error('❌ Modal thumbnail failed to load:', image);
                      e.target.src = '/images/placeholder-property.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default PropertyGallery;