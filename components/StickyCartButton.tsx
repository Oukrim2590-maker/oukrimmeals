import React from 'react';
import { useCart } from '../context/CartContext';

const StickyCartButton: React.FC = () => {
    const { cartCount, openCart } = useCart();

    if (cartCount === 0) {
        return null;
    }

    return (
        <button
            onClick={openCart}
            className="fixed bottom-20 end-5 z-50 bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition-all duration-300 hover:scale-110 flex items-center justify-center md:bottom-5"
            aria-label={`افتح السلة (${cartCount} منتجات)`}
        >
            <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-white text-green-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-green-600">
                    {cartCount}
                </span>
            </div>
        </button>
    );
};

export default StickyCartButton;