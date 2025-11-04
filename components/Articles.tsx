import React, { useState } from 'react';
import { ARTICLES_DATA } from '../constants';
import { Article } from '../types';
import ArticleCard from './ArticleCard';
import ArticleModal from './ArticleModal';

const Articles: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const handleOpenModal = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  return (
    <>
      <section id="articles" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            مقالات ونصائح تغذية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARTICLES_DATA.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                onReadMore={() => handleOpenModal(article)}
              />
            ))}
          </div>
        </div>
      </section>
      <ArticleModal article={selectedArticle} onClose={handleCloseModal} />
    </>
  );
};

export default Articles;