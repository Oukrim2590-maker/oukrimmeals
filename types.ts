export interface Meal {
  id: number;
  name: string;
  image: string;
  price: number;
  ingredients: string;
  calories: number;
  category: 'high-protein' | 'vegetarian' | 'low-carb';
  rating: number;
  reviews: number;
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

export interface Review {
  rating: number;
  text: string;
}
