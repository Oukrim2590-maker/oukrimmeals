export interface Meal {
  id: number;
  name: string;
  image: string;
  price: number;
  ingredients: string;
  calories: number;
  category: 'high-protein' | 'vegetarian' | 'low-carb';
  // FIX: Add optional rating and reviews properties to the Meal interface to resolve type errors.
  rating?: number;
  reviews?: number;
}

export interface Article {
  id: number;
  title: string;
  image: string;
  summary: string;
  content: string;
}

export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
}

// FIX: Add the missing 'Review' interface, which was being imported but not exported.
export interface Review {
  rating: number;
  text?: string;
}
