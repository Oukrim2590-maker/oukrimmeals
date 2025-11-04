import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, clearCart, totalPrice } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isOpen) return null;
  
  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-end"
        onClick={onClose}
      >
        <div
          className="bg-[#FEFCF5] w-full max-w-md h-full shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold text-gray-800">سلة التسوق</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="إغلاق">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-grow overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-xl font-semibold">سلتك فارغة</p>
                <p>أضف بعض المنتجات اللذيذة!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-800">{item.name}</h4>
                      <p className="text-gray-600 font-semibold">{item.price} د.م.</p>
                       {item.customizations && (
                        <div className="text-xs text-gray-500 mt-1 space-y-1">
                          {item.customizations.removed.length > 0 && (
                            <p><strong className="font-semibold">بدون:</strong> {item.customizations.removed.join('، ')}</p>
                          )}
                          {item.customizations.added && (
                            <p><strong className="font-semibold">إضافات:</strong> {item.customizations.added}</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-gray-200 rounded-full font-bold flex items-center justify-center">-</button>
                        <span className="font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-gray-200 rounded-full font-bold flex items-center justify-center">+</button>
                      </div>
                       <button onClick={() => updateQuantity(item.id, 0)} className="text-red-500 hover:text-red-700 mt-2" aria-label="إزالة">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                          </svg>
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-medium text-gray-700">الإجمالي</span>
                      <span className="text-2xl font-bold text-green-600">{totalPrice} د.م.</span>
                  </div>
                   <button 
                      onClick={handleCheckout}
                      className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg text-lg"
                   >
                      أكمل الطلب
                  </button>
                  <button 
                      onClick={clearCart}
                      className="w-full text-red-500 font-semibold py-2 mt-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                      إفراغ السلة
                  </button>
              </div>
          )}
        </div>
      </div>
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        onOrderConfirmed={() => {
          setIsCheckoutOpen(false);
          onClose(); // Close the main cart modal
          clearCart();
        }}
        cartItems={cartItems}
        totalPrice={totalPrice}
      />
    </>
  );
};

export default CartModal;