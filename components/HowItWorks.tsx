import React from 'react';

const Step: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="text-center p-6 bg-[#FEFCF5] rounded-lg shadow-md border border-green-100">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const ChooseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
);

const OrderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const DeliveryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h2a1 1 0 001-1V7a1 1 0 00-1-1h-2" />
    </svg>
);

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          كيفاش كنخدمو؟
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Step icon={<ChooseIcon />} title="الخطوة 1" description="اختر وجبتك المفضلة من القائمة ديالنا." />
          <Step icon={<OrderIcon />} title="الخطوة 2" description="صيفط الطلب ديالك بسهولة عبر واتساب." />
          <Step icon={<DeliveryIcon />} title="الخطوة 3" description="نتوصلو بطلبك ونوصلوه ليك حتى عندك." />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;