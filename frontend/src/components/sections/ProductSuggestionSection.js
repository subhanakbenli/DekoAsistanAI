import React from 'react';
import ProductCard from '../common/ProductCard';
import { CATEGORY_ICONS, filterValidProducts } from '../../utils/productUtils';

/**
 * Product suggestions section component - Individual product cards display
 * Handles new products array format and displays each product as individual card
 * @param {Object} result - Design result data
 */
const ProductSuggestionSection = ({ result }) => {
  // Debug: Console log to check data structure
  console.log('ProductSuggestionSection - Result data:', result);
  console.log('ProductSuggestionSection - Products array:', result?.products);
  
  // Validate and filter products
  const validProducts = filterValidProducts(result.products);
  const hasValidProducts = validProducts.length > 0;
  
  console.log('ProductSuggestionSection - Valid products:', validProducts);
  console.log('ProductSuggestionSection - Has valid products:', hasValidProducts);

  // Test için geçici mock data (backend henüz yeni format göndermiyorsa)
  const mockProducts = [
    {
      category: "Mobilyalar",
      name: "L Şeklinde Koltuk Takımı",
      description: "Modern tasarım, rahat oturma için ideal"
    },
    {
      category: "Aydınlatma",
      name: "LED Avize",
      description: "Sıcak ışık, dimmer özelliği"
    },
    {
      category: "Dekoratif Ürünler",
      name: "Modern Halı",
      description: "Geometrik desen, yumuşak dokulu"
    }
  ];

  // Eğer backend'den products gelmiyorsa test için mock data kullan
  const productsToShow = hasValidProducts ? validProducts : mockProducts;

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
      
      {/* Her zaman kartları göster - test için */}
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

      {/* Debug bilgisi */}
      <div className="mt-4 p-2 bg-yellow-900/20 border border-yellow-600 rounded text-xs">
        <p className="text-yellow-300">DEBUG:</p>
        <p className="text-yellow-200">Has valid products: {hasValidProducts ? 'YES' : 'NO'}</p>
        <p className="text-yellow-200">Products count: {validProducts.length}</p>
        <p className="text-yellow-200">Using: {hasValidProducts ? 'Real data' : 'Mock data'}</p>
      </div>

      {/* Fallback sadece gerçek data yokken ve mock da çalışmıyorsa */}
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
