import React from 'react';
import ProductCard from '../common/ProductCard';

/**
 * Product category section component
 * @param {string} category - Category name
 * @param {Array} products - Products in this category
 * @param {Object} categoryIcons - Icon mapping for categories
 */
const ProductCategorySection = ({ category, products, categoryIcons }) => {
  return (
    <div className="bg-gray-700 p-3 rounded">
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-lg">{categoryIcons[category] || '📦'}</span>
        <h4 className="text-sm font-semibold text-purple-200">{category}</h4>
        <span className="text-xs text-gray-400">({products.length})</span>
      </div>
      <div className="space-y-2">
        {products.map((product, index) => (
          <ProductCard 
            key={index} 
            product={product} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCategorySection;
