import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import ImageLightbox from './ImageLightbox';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSpecialInstructions('');
      setIsAdded(false);
      setShowConfirmation(false);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({ 
      item: product, 
      type: 'product',
      quantity, 
      customizations: {
        specialInstructions
      }
    });
    setIsAdded(true);

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  const handleGoToCheckout = () => {
    openCart();
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
        onClick={onClose}
      >
        <div 
          className="bg-[#FEFCF5] rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-64 object-cover rounded-t-lg cursor-pointer transition-opacity duration-300 hover:opacity-80"
              onClick={() => setIsLightboxOpen(true)}
            />
            <button 
              onClick={onClose}
              className="absolute top-3 right-3 bg-[#F5EFE1] rounded-full p-1 text-gray-700 hover:bg-gray-200 transition-colors"
              aria-label="إغلاق"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
              <span className="text-3xl font-bold text-green-600 flex-shrink-0">{product.price} د.م.</span>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            
            <div className="space-y-4 my-6">
               <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-2">الكمية</h3>
                 <div className="flex items-center gap-4">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 bg-gray-200 rounded-full font-bold flex items-center justify-center text-lg">-</button>
                    <span className="font-bold text-xl w-8 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 bg-gray-200 rounded-full font-bold flex items-center justify-center text-lg">+</button>
                  </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-2">تعليمات خاصة (اختياري)</h3>
                <textarea 
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="مثال: تغليف كهدية..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  rows={2}
                ></textarea>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <div className="h-6 mb-2">
                <div className={`transition-opacity duration-300 ease-in-out ${showConfirmation ? 'opacity-100' : 'opacity-0'}`}>
                  <p className="text-green-600 font-semibold text-center">
                    تمت الإضافة إلى السلة!
                  </p>
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <button
                  onClick={isAdded ? handleGoToCheckout : handleAddToCart}
                  className={`w-full text-center block font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md ${
                    isAdded
                      ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                      : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                  } ${isAnimating ? 'animate-button-pop' : ''}`}
                >
                  {isAdded ? 'أكمل الطلب' : 'أضف إلى السلة'}
                </button>
                <button
                  onClick={onClose}
                  className="w-full text-center block font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md bg-[#F5EFE1] text-gray-700 border border-gray-300 hover:bg-[#EAE4D4]"
                >
                  {isAdded ? 'متابعة التسوق' : 'الرجوع'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLightboxOpen && product && (
        <ImageLightbox imageUrl={product.image} onClose={() => setIsLightboxOpen(false)} />
      )}
    </>
  );
};

export default ProductDetailModal;