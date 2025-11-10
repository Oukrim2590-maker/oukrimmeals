import React from 'react';
import { Meal } from '../types';
import { useAdmin } from '../context/AdminContext';

interface MealCardProps {
  meal: Meal;
  onCardClick: () => void;
  onEdit: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onCardClick, onEdit }) => {
  const { isAdmin } = useAdmin();
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the detail modal
    onEdit();
  };
  
  return (
    <div 
        className="bg-[#FEFCF5] rounded-lg shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group relative"
        onClick={onCardClick}
    >
      {isAdmin && (
        <button 
          onClick={handleEditClick}
          className="absolute top-2 right-2 z-10 bg-[#F5EFE1] p-2 rounded-full shadow-md text-gray-600 hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="تعديل الوجبة"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      <div className="overflow-hidden">
        <img src={meal.image} alt={meal.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <h3 className="text-lg md:text-xl font-bold text-green-800 mb-2 flex-grow">{meal.name}</h3>
        
        <div className="mt-auto flex justify-between items-center text-gray-700">
          <span className="font-medium text-sm">السعرات: {meal.calories}</span>
          <span className="text-lg md:text-xl font-bold text-green-600">{meal.price} د.م.</span>
        </div>
         <div className="text-center text-green-700 font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          تخصيص و إضافة للسلة
        </div>
      </div>
    </div>
  );
};

export default MealCard;
