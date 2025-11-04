import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onReadMore: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onReadMore }) => {
  return (
    <div className="bg-[#FEFCF5] rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
      <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-green-800 mb-2">{article.title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{article.summary}</p>
        <button
          onClick={onReadMore}
          className="mt-auto self-start bg-green-100 text-green-700 font-semibold py-2 px-4 rounded-lg hover:bg-green-200 transition-colors duration-300"
        >
          إقرأ المزيد
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;