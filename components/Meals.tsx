import React, { useState } from 'react';
import { MEALS_DATA } from '../constants';
import MealCard from './MealCard';
import { Meal } from '../types';
import MealDetailModal from './MealDetailModal';
import MealEditorModal from './MealEditorModal';
import { useAdmin } from '../context/AdminContext';
import { usePersistentData } from '../hooks/usePersistentData';

type CategoryKey = 'all' | Meal['category'];

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'high-protein', label: 'بروتين عالي' },
  { key: 'vegetarian', label: 'نباتي' },
  { key: 'low-carb', label: 'قليل الكربوهيدرات' },
];

const MEALS_STORAGE_KEY = 'oukrim_meals_data';

const Meals: React.FC = () => {
  const { isAdmin } = useAdmin();
  const [meals, setMeals] = usePersistentData<Meal[]>(MEALS_STORAGE_KEY, MEALS_DATA);

  const [activeFilter, setActiveFilter] = useState<CategoryKey>('all');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  // Editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [mealToEdit, setMealToEdit] = useState<Meal | null>(null);

  const filteredMeals = meals.filter(
    (meal) => activeFilter === 'all' || meal.category === activeFilter
  );

  const handleOpenModal = (meal: Meal) => {
    setSelectedMeal(meal);
  };

  const handleCloseModal = () => {
    setSelectedMeal(null);
  };

  // Editor handlers
  const handleOpenEditor = (meal: Meal | null) => {
    setMealToEdit(meal);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setMealToEdit(null);
  };

  const handleSaveMeal = (mealData: Omit<Meal, 'id' | 'rating' | 'reviews'> & { id?: number }) => {
    if (mealData.id) {
      // Editing existing meal
      setMeals(prevMeals => prevMeals.map(m => m.id === mealData.id ? { ...m, ...mealData } as Meal : m));
    } else {
      // Adding new meal
      const newMeal: Meal = {
        ...mealData,
        id: Date.now(), // Simple unique ID
        rating: 0,
        reviews: 0,
      };
      setMeals(prevMeals => [newMeal, ...prevMeals]);
    }
    handleCloseEditor();
  };

  return (
    <>
      <section id="meals" className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">
              وجباتنا الصحية
            </h2>
            {isAdmin && (
              <button
                onClick={() => handleOpenEditor(null)}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                إضافة وجبة
              </button>
            )}
          </div>
          
          <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-10">
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-colors duration-300 ${
                  activeFilter === key
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredMeals.map((meal) => (
              <MealCard 
                key={meal.id} 
                meal={meal} 
                onCardClick={() => handleOpenModal(meal)}
                onEdit={() => handleOpenEditor(meal)}
              />
            ))}
          </div>
        </div>
      </section>
      <MealDetailModal meal={selectedMeal} onClose={handleCloseModal} />
      <MealEditorModal 
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveMeal}
        meal={mealToEdit}
      />
    </>
  );
};

export default Meals;
