import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Meal, Product } from '../types';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customizations?: {
    removed: string[];
    added: string;
  };
}

export interface AddToCartPayload {
    item: Meal | Product;
    type: 'meal' | 'product';
    quantity?: number;
    customizations?: {
        selectedIngredients?: string[];
        specialInstructions: string;
    };
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (payload: AddToCartPayload) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'oukrim_meals_cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const storedItems = window.localStorage.getItem(CART_STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error("Could not parse cart items from localStorage", error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((payload: AddToCartPayload) => {
    const { item, type, quantity = 1, customizations } = payload;
    setCartItems(prevItems => {
        let itemId = `${type}-${item.id}`;
        let customizationDetails: CartItem['customizations'] | undefined = undefined;
        const instructions = customizations?.specialInstructions?.trim() || '';

        if (type === 'meal' && customizations && 'ingredients' in item) {
            const initialIngredients = item.ingredients.split('، ');
            const selectedIngredients = customizations.selectedIngredients || initialIngredients;
            const removed = initialIngredients.filter(i => !selectedIngredients.includes(i));
            
            const sortedSelected = [...selectedIngredients].sort().join(',');
            itemId += `-[${sortedSelected}]-[${instructions}]`;
            
            if (removed.length > 0 || instructions) {
              customizationDetails = {
                  removed: removed,
                  added: instructions
              };
            }
        } else if (type === 'product' && instructions) {
            itemId += `-[${instructions}]`;
            customizationDetails = {
                removed: [],
                added: instructions
            };
        }

        const existingItem = prevItems.find(cartItem => cartItem.id === itemId);

        if (existingItem) {
            return prevItems.map(cartItem =>
                cartItem.id === itemId
                    ? { ...cartItem, quantity: cartItem.quantity + quantity }
                    : cartItem
            );
        } else {
            return [...prevItems, { 
                id: itemId, 
                name: item.name, 
                price: item.price, 
                image: item.image, 
                quantity: quantity,
                customizations: customizationDetails
            }];
        }
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        return prevItems.filter(item => item.id !== itemId);
      }
      return prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
    });
  }, []);
  
  const clearCart = useCallback(() => {
      setCartItems([]);
  }, []);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);


  return (
    <CartContext.Provider value={{ cartItems, addToCart, cartCount, updateQuantity, clearCart, totalPrice, isCartOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};