import React, { useState, useEffect, useCallback } from 'react';
import { Meal, Review } from '../types';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';
import { getMealRatings, addMealRating } from '../utils/ratings';
import ImageLightbox from './ImageLightbox';

interface MealDetailModalProps {
  meal: Meal | null;
  onClose: () => void;
}

const MealDetailModal: React.FC<MealDetailModalProps> = ({ meal, onClose }) => {
  const { addToCart, openCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // State for reviews
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  
  const loadRatings = useCallback(() => {
    if (meal) {
      try {
        const { averageRating, reviewCount, reviews } = getMealRatings(meal.id);
        setAverageRating(averageRating);
        setReviewCount(reviewCount);
        setReviews(reviews);
      } catch (error) {
        console.error("Error loading ratings:", error);
      }
    }
  }, [meal]);

  useEffect(() => {
    if (meal) {
      // Load ratings when a new meal is selected
      loadRatings();
      // Reset component state
      setSelectedIngredients(meal.ingredients.split('، '));
      setSpecialInstructions('');
      setIsAdded(false);
      setUserRating(0);
      setReviewText('');
      setShowReviewForm(false);
      setReviewSubmitted(false);
      setShowConfirmation(false);
    }
  }, [meal, loadRatings]);

  if (!meal) return null;

  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleAddToCart = () => {
    addToCart({ 
      item: meal, 
      type: 'meal', 
      customizations: {
        selectedIngredients,
        specialInstructions
      }
    });
    setIsAdded(true);

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);

    if (!reviewSubmitted) {
      setShowReviewForm(true); // Show review form after adding to cart
    }
  };

  const handleGoToCheckout = () => {
    openCart();
    onClose();
  };

  const handleSubmitReview = () => {
    if (!meal || userRating === 0) {
      alert("المرجو تحديد تقييم (عدد النجوم) قبل الإرسال.");
      return;
    }
    try {
      addMealRating(meal.id, { rating: userRating, text: reviewText });
      setReviewSubmitted(true);
      setShowReviewForm(false);
      loadRatings(); // Refresh ratings data
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("حدث خطأ أثناء إرسال المراجعة. قد تكون مساحة التخزين ممتئة.");
    }
  };

  const initialIngredients = meal.ingredients.split('، ');

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
        onClick={onClose}
      >
        <div 
          className="bg-[#FEFCF5] rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <img 
              src={meal.image} 
              alt={meal.name} 
              className="w-full h-64 object-cover rounded-t-lg cursor-pointer transition-opacity duration-300 hover:opacity-80"
              onClick={() => setIsLightboxOpen(true)}
            />
            <button 
              onClick={onClose}
              className="absolute top-3 right-3 bg-[#F5EFE1] rounded-full p-1 text-gray-700 hover:bg-gray-200 transition-colors"
              aria-label="إغلاق"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-3xl font-bold text-gray-800">{meal.name}</h2>
              <span className="text-3xl font-bold text-green-600 flex-shrink-0">{meal.price} د.م.</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <StarRating rating={averageRating} />
              <span>{averageRating.toFixed(1)}</span>
              <span>({reviewCount} مراجعة)</span>
              <span className="mx-2">|</span>
              <span>السعرات: {meal.calories}</span>
            </div>

            <div className="space-y-4 my-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-2">تخصيص المكونات</h3>
                <p className="text-sm text-gray-500 mb-3">يمكنك إلغاء تحديد المكونات التي لا تريدها.</p>
                <div className="grid grid-cols-2 gap-2">
                  {initialIngredients.map(ingredient => {
                    const isSelected = selectedIngredients.includes(ingredient);
                    return (
                      <label key={ingredient} className="flex items-center gap-2 cursor-pointer transition-colors hover:text-gray-900">
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleIngredientToggle(ingredient)}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className={!isSelected ? 'line-through text-gray-400' : 'text-gray-700'}>
                          {ingredient}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-2">إضافات أو تعليمات خاصة</h3>
                <textarea 
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="مثال: بدون ملح, قليل من الزيت..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  rows={2}
                ></textarea>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="h-6 mb-2">
                <div className={`transition-opacity duration-300 ease-in-out ${showConfirmation ? 'opacity-100' : 'opacity-0'}`}>
                  <p className="text-green-600 font-semibold text-center">
                    تمت الإضافة إلى السلة!
                  </p>
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <button
                  onClick={isAdded ? handleGoToCheckout : handleAddToCart}
                  className={`w-full text-center block font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md ${
                    isAdded
                      ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } ${isAnimating ? 'animate-button-pop' : ''}`}
                >
                  {isAdded ? 'أكمل الطلب' : 'أضف إلى السلة'}
                </button>
                <button
                  onClick={onClose}
                  className="w-full text-center block font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md bg-[#F5EFE1] text-gray-700 border border-gray-300 hover:bg-[#EAE4D4]"
                >
                  {isAdded ? 'متابعة التسوق' : 'الرجوع'}
                </button>
              </div>
            </div>
            
            {/* Review Section */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-xl font-bold text-gray-800 mb-3">آراء الزبناء ({reviewCount})</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                      <StarRating rating={review.rating} />
                      <p className="text-gray-600 mt-1">{review.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">لا توجد مراجعات بعد. كن أول من يكتب مراجعة!</p>
                )}
              </div>

              {showReviewForm && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-bold text-lg text-gray-700 mb-2">أضف مراجعتك</h4>
                  <div className="flex justify-center mb-3">
                    <StarRating rating={userRating} onRate={setUserRating} isInteractive={true} />
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="كيف كانت تجربتك؟"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    rows={3}
                  ></textarea>
                  <button
                    onClick={handleSubmitReview}
                    className="w-full mt-3 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    إرسال المراجعة
                  </button>
                </div>
              )}
              {reviewSubmitted && (
                <p className="text-center font-semibold text-green-600 mt-4">شكراً لمراجعتك!</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {isLightboxOpen && meal && (
        <ImageLightbox imageUrl={meal.image} onClose={() => setIsLightboxOpen(false)} />
      )}
    </>
  );
};

export default MealDetailModal;