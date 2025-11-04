import React from 'react';
import { WHATSAPP_LINK } from '../constants';

const Hero: React.FC = () => {
  return (
    <section id="home" className="bg-green-50 py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-green-800 mb-4">
          Oukrim Meals
        </h2>
        <p className="text-2xl md:text-3xl text-gray-700 mb-8">
          الأكل الصحي بسهولة وسرعة
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-all duration-300 text-lg shadow-lg transform hover:scale-105"
        >
          اطلب الآن
        </a>
      </div>
    </section>
  );
};

export default Hero;