import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-green-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          عن Oukrim Meals
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
          نوفر وجبات صحية ومتوازنة للرياضيين والناس اللي باغين يحافظو على لياقتهم. مهمتنا هي نجعل الأكل الصحي لذيذ، ساهل، ومتاح للجميع.
        </p>
      </div>
    </section>
  );
};

export default About;
