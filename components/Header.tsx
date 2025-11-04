import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const NavLink: React.FC<{ href: string; children: React.ReactNode; className?: string; onClick?: () => void }> = ({ href, children, className, onClick }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    if (onClick) {
      onClick();
    }
  };

  const defaultClassName = "text-gray-600 hover:text-green-600 transition-colors duration-300 font-medium";

  return (
    <a href={href} onClick={handleNavClick} className={className || defaultClassName}>
      {children}
    </a>
  );
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount, openCart } = useCart();

  const navLinks = [
    { href: '#home', label: 'الرئيسية' },
    { href: '#meals', label: 'الوجبات' },
    { href: '#products', label: 'منتجات رياضية' },
    { href: '#articles', label: 'مقالات' },
    { href: '#contact', label: 'تواصل معنا' },
  ];

  const CartIcon = () => (
    <div className="relative cursor-pointer" onClick={openCart}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </div>
  );

  return (
    <header className="bg-[#FAF8F1]/80 backdrop-blur-sm py-4 px-6 md:px-12 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-600">Oukrim Meals</h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
          ))}
          <CartIcon />
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <CartIcon />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <nav className="flex flex-col items-center gap-4">
            {navLinks.map(link => (
              <NavLink 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className="text-lg text-gray-700 hover:text-green-600 py-2"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;