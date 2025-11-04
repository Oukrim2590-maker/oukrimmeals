import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Meals from './components/Meals';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import Products from './components/Products';
import Articles from './components/Articles';
import Contact from './components/Contact';
import Footer from './components/Footer';
import StickyWhatsAppButton from './components/StickyWhatsAppButton';
import { CartProvider, useCart } from './context/CartContext';
import CartModal from './components/CartModal';
import StickyCartButton from './components/StickyCartButton';

const AppContent: React.FC = () => {
  const { isCartOpen, closeCart } = useCart();

  return (
    <div className="text-gray-800">
      <Header />
      <main>
        <Hero />
        <Meals />
        <About />
        <HowItWorks />
        <Products />
        <Articles />
        <Contact />
      </main>
      <Footer />
      <StickyWhatsAppButton />
      <StickyCartButton />
      <CartModal isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
};

export default App;