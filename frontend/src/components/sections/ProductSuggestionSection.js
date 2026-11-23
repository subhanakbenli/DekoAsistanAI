import React from 'react';
import ProductCard from '../common/ProductCard';
import { CATEGORY_ICONS, filterValidProducts } from '../../utils/productUtils';

/**
 * Product suggestions section component - Individual product cards display
 * Handles new products array format and displays each product as individual card
 * @param {Object} result - Design result data
 */
const ProductSuggestionSection = ({ result }) => {
  // Validate and filter products
  const validProducts = filterValidProducts(result.products);
  const hasValidProducts = validProducts.length > 0;

  // Temporary mock data for testing (in case the backend does not send the new format yet)
  const mockProducts = [
    {
      category: "Mobilyalar",
      name: "Test Sofa",
      description: "This is mock data - it disappears once real data arrives"
    }
  ];

  // Use real data if available, otherwise mock data
  const productsToShow = hasValidProducts ? validProducts : (
    // Show mock data only when there is no real data at all
    validProducts.length === 0 && result?.products === undefined ? mockProducts : []
  );

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-purple-300 flex items-center space-x-2">
          <span>🛍️</span>
          <span>Product Suggestions</span>
        </h3>
        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
          {productsToShow.length} products
        </span>
      </div>
      
      {/* Product cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {productsToShow.map((product, index) => (
          <ProductCard
            key={`${product.category}-${index}`}
            product={product}
            index={index}
            categoryIcons={CATEGORY_ICONS}
          />
        ))}
      </div>

      {/* Fallback text only when there are no products */}
      {productsToShow.length === 0 && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-300 leading-relaxed">
            {result.product_suggestion || 'No product suggestions found.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductSuggestionSection;
