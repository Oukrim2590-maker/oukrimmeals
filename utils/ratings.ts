import { MEALS_DATA } from '../constants';
import { Review } from '../types';

const RATINGS_STORAGE_KEY = 'oukrim_meals_ratings';

// Structure in localStorage: { "1": [{rating: 5, text: "..."}], "2": [...] }
type AllRatings = {
  [mealId: number]: Review[];
};

const getAllRatings = (): AllRatings => {
  try {
    const stored = window.localStorage.getItem(RATINGS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error("Failed to parse ratings from localStorage", e);
    return {};
  }
};

// Calculates the combined rating based on initial data and new reviews
export const getMealRatings = (mealId: number) => {
  const allRatings = getAllRatings();
  const newReviews = allRatings[mealId] || [];
  const mealData = MEALS_DATA.find(m => m.id === mealId);

  // Default values if meal isn't found in constants (should not happen)
  if (!mealData) {
    return { reviews: [], averageRating: 0, reviewCount: 0 };
  }

  // FIX: Provide default values for optional 'reviews' and 'rating' properties on Meal to prevent runtime errors.
  const baseReviewCount = mealData.reviews || 0;
  const baseRatingTotal = (mealData.rating || 0) * baseReviewCount;

  const newRatingsTotal = newReviews.reduce((sum, r) => sum + r.rating, 0);
  const newReviewCount = newReviews.length;

  const combinedReviewCount = baseReviewCount + newReviewCount;
  const combinedRatingTotal = baseRatingTotal + newRatingsTotal;
  
  const averageRating = combinedReviewCount > 0 
    ? parseFloat((combinedRatingTotal / combinedReviewCount).toFixed(1))
    : 0;
  
  return {
    reviews: newReviews,
    averageRating,
    reviewCount: combinedReviewCount,
  };
};

// Adds a new review for a specific meal
export const addMealRating = (mealId: number, review: Review) => {
  try {
    const allRatings = getAllRatings();
    const currentReviews = allRatings[mealId] || [];
    // Add the new review to the beginning of the list
    allRatings[mealId] = [review, ...currentReviews];
    window.localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(allRatings));
  } catch (e) {
    console.error("Failed to save rating to localStorage", e);
    // Re-throw the error to be handled by the component
    throw new Error("Could not save review. Storage might be full or disabled.");
  }
};
