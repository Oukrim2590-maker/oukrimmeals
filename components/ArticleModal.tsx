import React from 'react';
import { Article } from '../types';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="relative">
          <img src={article.image} alt={article.title} className="w-full h-64 object-cover rounded-t-lg" />
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 bg-white rounded-full p-1 text-gray-700 hover:bg-gray-200"
            aria-label="إغلاق"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{article.title}</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {article.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
