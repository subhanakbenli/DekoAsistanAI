import React from 'react';

/**
 * Single product card component - Enhanced for individual product display with image and link support
 * @param {Object} product - Product data with category, name, description, image_path, product_link, is_real
 * @param {number} index - Product index for key
 * @param {Object} categoryIcons - Category icons mapping
 */
const ProductCard = ({ product, index, categoryIcons }) => {
  // Category color mapping - Updated with new categories
  const categoryColors = {
    'Mobilyalar': 'border-blue-500 bg-blue-900/20',
    'Aydınlatma': 'border-yellow-500 bg-yellow-900/20',
    'Dekoratif Ürünler': 'border-pink-500 bg-pink-900/20',
    'Aksesuarlar': 'border-green-500 bg-green-900/20',
    'Tekstil': 'border-purple-500 bg-purple-900/20',
    'Dekoratif Objeler': 'border-red-500 bg-red-900/20',
    'Bitkiler': 'border-emerald-500 bg-emerald-900/20',
    'Perdeler': 'border-indigo-500 bg-indigo-900/20'
  };

  const categoryTextColors = {
    'Mobilyalar': 'text-blue-300',
    'Aydınlatma': 'text-yellow-300',
    'Dekoratif Ürünler': 'text-pink-300',
    'Aksesuarlar': 'text-green-300',
    'Tekstil': 'text-purple-300',
    'Dekoratif Objeler': 'text-red-300',
    'Bitkiler': 'text-emerald-300',
    'Perdeler': 'text-indigo-300'
  };

  const cardColor = categoryColors[product.category] || 'border-gray-500 bg-gray-900/20';
  const textColor = categoryTextColors[product.category] || 'text-gray-300';

  // Render product name with link if available
  const renderProductName = () => {
    const productName = (
      <h5 className="text-sm font-semibold text-white leading-tight hover:text-purple-300 transition-colors cursor-pointer">
        {product.name}
      </h5>
    );

    // If real product with link, make it clickable
    if (product.is_real && product.product_link) {
      return (
        <div 
          onClick={() => window.open(product.product_link, '_blank', 'noopener,noreferrer')}
          className="block cursor-pointer"
        >
          {productName}
        </div>
      );
    }

    return productName;
  };

  return (
    <div className={`bg-gray-800 p-4 rounded-lg border-l-4 ${cardColor} hover:bg-gray-750 transition-colors duration-200`}>
      {/* Category Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{categoryIcons[product.category] || '📦'}</span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gray-700 ${textColor}`}>
            {product.category}
          </span>
          {/* Real product indicator */}
          {product.is_real && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-600 text-white">
              ✓ Gerçek
            </span>
          )}
        </div>
      </div>

      {/* Product Image */}
      {product.is_real && product.image_path && (
        <div className="mb-3">
          <img 
            src={product.image_path} 
            alt={product.name}
            className="w-full h-32 object-cover rounded-lg border border-gray-600"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Product Info */}
      <div className="space-y-2">
        {renderProductName()}
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
          <div className="flex items-center space-x-2">
            {product.is_real && product.product_link && (
              <span className="text-xs text-blue-400">🔗 Tıklanabilir</span>
            )}
            <div className={`w-2 h-2 rounded-full ${cardColor.split(' ')[0].replace('border-', 'bg-')}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
