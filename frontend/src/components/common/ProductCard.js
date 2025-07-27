import React from 'react';

/**
 * Single product card component - Enhanced for individual product display
 * @param {Object} product - Product data with category, name, description
 * @param {number} index - Product index for key
 * @param {Object} categoryIcons - Category icons mapping
 */
const ProductCard = ({ product, index, categoryIcons }) => {
  // Category color mapping
  const categoryColors = {
    'Mobilyalar': 'border-blue-500 bg-blue-900/20',
    'Aydınlatma': 'border-yellow-500 bg-yellow-900/20',
    'Dekoratif Ürünler': 'border-pink-500 bg-pink-900/20',
    'Aksesuarlar': 'border-green-500 bg-green-900/20'
  };

  const categoryTextColors = {
    'Mobilyalar': 'text-blue-300',
    'Aydınlatma': 'text-yellow-300',
    'Dekoratif Ürünler': 'text-pink-300',
    'Aksesuarlar': 'text-green-300'
  };

  const cardColor = categoryColors[product.category] || 'border-gray-500 bg-gray-900/20';
  const textColor = categoryTextColors[product.category] || 'text-gray-300';

  return (
    <div className={`bg-gray-800 p-4 rounded-lg border-l-4 ${cardColor} hover:bg-gray-750 transition-colors duration-200`}>
      {/* Category Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{categoryIcons[product.category] || '📦'}</span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gray-700 ${textColor}`}>
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h5 className="text-sm font-semibold text-white leading-tight">
          {product.name}
        </h5>
        <p className="text-xs text-gray-300 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Product Card Bottom */}
      <div className="mt-3 pt-2 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            #{index + 1} önerisi
          </span>
          <div className={`w-2 h-2 rounded-full ${cardColor.split(' ')[0].replace('border-', 'bg-')}`}></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
