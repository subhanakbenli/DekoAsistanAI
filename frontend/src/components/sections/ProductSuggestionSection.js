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

  // Test için geçici mock data (backend henüz yeni format göndermiyorsa)
  const mockProducts = [
    {
      category: "Mobilyalar",
      name: "Test Koltuk",
      description: "Bu mock data - gerçek data geldiğinde kaybolacak"
    }
  ];

  // Gerçek data varsa onu kullan, yoksa mock data
  const productsToShow = hasValidProducts ? validProducts : (
    // Mock data'yı sadece hiç gerçek data yoksa göster
    validProducts.length === 0 && result?.products === undefined ? mockProducts : []
  );

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-purple-300 flex items-center space-x-2">
          <span>🛍️</span>
          <span>Ürün Önerileri</span>
        </h3>
        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
          {productsToShow.length} ürün
        </span>
      </div>
      
      {/* Ürün kartları */}
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

      {/* Fallback text sadece ürün yokken */}
      {productsToShow.length === 0 && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-300 leading-relaxed">
            {result.product_suggestion || 'Ürün önerileri bulunamadı.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductSuggestionSection;
