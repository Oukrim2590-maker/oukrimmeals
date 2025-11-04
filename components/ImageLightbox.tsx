import React from 'react';

interface ImageLightboxProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ imageUrl, onClose }) => {
  // Effect to prevent body scroll when lightbox is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageUrl}
          alt="Full screen view"
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-[#F5EFE1] rounded-full p-2 text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white transition-colors shadow-lg"
          aria-label="إغلاق"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ImageLightbox;