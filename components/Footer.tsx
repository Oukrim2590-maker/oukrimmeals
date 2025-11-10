import React from 'react';
import { useAdmin } from '../context/AdminContext';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { isAdmin, openLoginModal, logout } = useAdmin();

  const handleAccessClick = () => {
    if (!isAdmin) {
      openLoginModal();
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-6 text-center">
        <p>
            <span onClick={handleAccessClick} className="cursor-pointer" title="Admin Access">
              &copy; {currentYear} Oukrim Meals. جميع الحقوق محفوظة.
            </span>
            {isAdmin && (
              <button 
                onClick={logout} 
                className="ml-4 text-sm bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
              >
                تسجيل الخروج
              </button>
            )}
        </p>
      </div>
    </footer>
  );
};

export default Footer;