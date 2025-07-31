import React, { memo } from 'react';
import { useProductCategories } from '../../hooks/useProductCategories';

/**
 * Product Category Selector Component
 * Room-specific product category selection with popular combinations
 * Features checkbox system with SVG icons and localStorage persistence
 */
const ProductCategorySelector = memo(({ roomType = 'salon', onSelectionChange, className = '' }) => {
  const {
    selectedProducts,
    useCustomProducts,
    customProductDescription,
    roomInfo,
    suggestedProducts,
    popularCombinations,
    handleProductToggle,
    handleCustomToggle,
    handleCustomDescriptionChange,
    applyPopularCombination,
    selectAllSuggested,
    clearSelection,
    isValid,
    getValidationMessage,
    getSelectionSummary
  } = useProductCategories(roomType);

  // Notify parent component of selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        isValid,
        selection: useCustomProducts 
          ? { type: 'custom', description: customProductDescription, roomType }
          : { type: 'categories', productIds: selectedProducts, roomType }
      });
    }
  }, [selectedProducts, useCustomProducts, customProductDescription, isValid, onSelectionChange, roomType]);

  if (!roomInfo) {
    return (
      <div className={`p-4 bg-red-500/10 border border-red-500/30 rounded-lg ${className}`}>
        <p className="text-red-400 text-sm">
          ⚠️ Geçersiz oda türü: {roomType}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">{roomInfo.icon}</span>
          {roomInfo.name} - Ürün Kategorileri
        </h3>
        <p className="text-gray-400 text-sm">
          {roomInfo.description} için uygun ürün kategorilerini seçin.
        </p>
      </div>

      {/* Popular Combinations */}
      {popularCombinations.length > 0 && !useCustomProducts && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            💡 Popüler Kombinasyonlar
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {popularCombinations.map((combination, index) => (
              <button
                key={index}
                onClick={() => applyPopularCombination(combination)}
                className="p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg text-left hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-200 group"
              >
                <div className="font-medium text-purple-300 group-hover:text-purple-200 mb-1">
                  {combination.name}
                </div>
                <div className="text-xs text-gray-400">
                  {combination.products.length} ürün
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!useCustomProducts && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={selectAllSuggested}
            className="px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-600/30 transition-colors text-sm"
          >
            ✅ Tümünü Seç
          </button>
          <button
            onClick={clearSelection}
            className="px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-600/30 transition-colors text-sm"
          >
            🗑️ Temizle
          </button>
        </div>
      )}

      {/* Custom Products Toggle */}
      <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <input
          type="checkbox"
          id="useCustomProducts"
          checked={useCustomProducts}
          onChange={(e) => handleCustomToggle(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
        />
        <label htmlFor="useCustomProducts" className="text-sm text-gray-300 flex-1 cursor-pointer">
          Kategorilerden seçmiyorum - Açıklamada belirteceğim
        </label>
      </div>

      {/* Custom Description Input */}
      {useCustomProducts && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Ürün Açıklaması
          </label>
          <textarea
            value={customProductDescription}
            onChange={(e) => handleCustomDescriptionChange(e.target.value)}
            placeholder="Örnek: Modern ahşap yemek masası, 6 kişilik sandalye takımı, dekoratif avize ve duvar tabloları istiyorum..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            rows={4}
          />
          <div className="flex justify-between items-center text-xs">
            <span className={`${customProductDescription.length >= 10 ? 'text-green-400' : 'text-red-400'}`}>
              {customProductDescription.length}/10 minimum karakter
            </span>
          </div>
        </div>
      )}

      {/* Product Categories Grid */}
      {!useCustomProducts && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-300">
              Ürün Kategorileri ({suggestedProducts.length} adet)
            </label>
            <span className="text-xs text-gray-500">
              {getSelectionSummary()}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {suggestedProducts.map((product) => (
              <ProductCategoryCard
                key={product.id}
                product={product}
                isSelected={selectedProducts.includes(product.id)}
                onToggle={() => handleProductToggle(product.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Validation Message - hide in compact mode */}
      {!isValid && !className.includes('compact') && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm flex items-center gap-2">
            <span>⚠️</span>
            {getValidationMessage()}
          </p>
        </div>
      )}

      {/* Selection Summary - hide in compact mode */}
      {isValid && !className.includes('compact') && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400 text-sm flex items-center gap-2">
            <span>✅</span>
            {useCustomProducts 
              ? 'Özel ürün açıklaması hazır'
              : `${selectedProducts.length} ürün kategorisi seçildi`
            }
          </p>
          {!useCustomProducts && selectedProducts.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedProducts.map(productId => {
                const product = suggestedProducts.find(p => p.id === productId);
                return product ? (
                  <span key={productId} className="inline-flex items-center gap-1 px-2 py-1 bg-green-600/20 rounded text-xs text-green-300">
                    <span>{product.icon}</span>
                    {product.name}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

/**
 * Individual Product Category Card Component
 */
const ProductCategoryCard = memo(({ product, isSelected, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`
        relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 group
        ${isSelected 
          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
        }
      `}
    >
      {/* Product Icon */}
      <div className="text-center mb-2">
        <span className="text-2xl block mb-1">{product.icon}</span>
      </div>

      {/* Product Name */}
      <div className="text-center">
        <h4 className="font-medium text-white text-xs leading-tight group-hover:text-blue-400 transition-colors">
          {product.name}
        </h4>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>
      )}

      {/* Checkbox Input (hidden but accessible) */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="sr-only"
        aria-label={`${product.name} seç`}
      />
    </div>
  );
});

ProductCategorySelector.displayName = 'ProductCategorySelector';
ProductCategoryCard.displayName = 'ProductCategoryCard';

export default ProductCategorySelector;
