import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-6 text-center">
        <p>&copy; {currentYear} Oukrim Meals. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
};

export default Footer;
