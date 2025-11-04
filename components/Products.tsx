import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS_DATA } from '../constants';
import ProductCard from './ProductCard';
import { Product } from '../types';
import ProductDetailModal from './ProductDetailModal';
import ProductEditorModal from './ProductEditorModal';

const PRODUCTS_STORAGE_KEY = 'oukrim_products_data';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const storedProductsRaw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProductsRaw) {
        const storedProducts = JSON.parse(storedProductsRaw);
        if (Array.isArray(storedProducts) && storedProducts.length > 0) {
          return storedProducts;
        }
      }
      return PRODUCTS_DATA;
    } catch (error) {
      console.error("Could not load products from localStorage", error);
      return PRODUCTS_DATA;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error("Could not save products to localStorage", error);
    }
  }, [products]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleOpenEditor = (product: Product | null) => {
    setProductToEdit(product);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setProductToEdit(null);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'> & { id?: number }) => {
    if (productData.id) {
      setProducts(prev => prev.map(p => p.id === productData.id ? { ...p, ...productData } as Product : p));
    } else {
      const newProduct: Product = {
        ...productData,
        id: Date.now(),
      };
      setProducts(prev => [newProduct, ...prev]);
    }
    handleCloseEditor();
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <section id="products" className="py-16 bg-green-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">
              معدات رياضية لتمارينك
            </h2>
            <button
              onClick={() => handleOpenEditor(null)}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              إضافة منتج
            </button>
          </div>
          <div className="relative">
            <button 
              onClick={() => scroll('left')}
              className="absolute top-1/2 -left-4 z-10 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors hidden md:block"
              aria-label="Previous Product"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 md:gap-8 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {products.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5" style={{ scrollSnapAlign: 'start' }}>
                  <ProductCard 
                    product={product} 
                    onCardClick={() => handleOpenModal(product)}
                    onEdit={() => handleOpenEditor(product)}
                  />
                </div>
              ))}
            </div>
             <button 
              onClick={() => scroll('right')}
              className="absolute top-1/2 -right-4 z-10 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors hidden md:block"
              aria-label="Next Product"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      <ProductDetailModal product={selectedProduct} onClose={handleCloseModal} />
      <ProductEditorModal 
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveProduct}
        product={productToEdit}
      />
    </>
  );
};

export default Products;