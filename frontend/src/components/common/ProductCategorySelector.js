import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useProductCategories } from '../../hooks/useProductCategories';
import './ProductCategorySelector.css';

// Room type color mapping for visual indicators
const getRoomTypeColor = (roomType) => {
  const colorMap = {
    'salon': 'bg-blue-500 shadow-blue-500/50', // Mavi - Rahatlatıcı
    'yatak': 'bg-purple-500 shadow-purple-500/50', // Mor - Dinlendirici
    'çocuk': 'bg-pink-500 shadow-pink-500/50', // Pembe - Eğlenceli
    'mutfak': 'bg-orange-500 shadow-orange-500/50', // Turuncu - Enerjik
    'banyo': 'bg-cyan-500 shadow-cyan-500/50', // Camgöbeği - Temiz
    'yemek': 'bg-green-500 shadow-green-500/50', // Yeşil - Doğal
    'calisma': 'bg-indigo-500 shadow-indigo-500/50', // İndigo - Odaklanma
    'misafir': 'bg-yellow-500 shadow-yellow-500/50' // Sarı - Konuksever
  };
  return colorMap[roomType] || 'bg-gray-500 shadow-gray-500/50';
};

// Room-specific product category selector with compact design
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

  // Notify parent of selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        isValid,
        selection: useCustomProducts 
          ? { type: 'custom', description: customProductDescription, roomType }
          : { type: 'categories', productIds: selectedProducts, roomType }
      });
    }
  }, [selectedProducts, useCustomProducts, customProductDescription, isValid, roomType]);

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
    <div className={`space-y-2 ${className}`}>
      {/* Header with Room Type Indicator */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="text-base">{roomInfo.icon}</span>
          {roomInfo.name} - Ürün Kategorileri
        </h3>
      </div>

      {/* Popular Combinations */}
      {popularCombinations.length > 0 && !useCustomProducts && (
        <div className="space-y-1">
          <h4 className="block text-xs font-medium text-gray-300">
            💡 Popüler Kombinasyonlar
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {popularCombinations.map((combination) => (
              <button
                key={combination.name}
                onClick={() => applyPopularCombination(combination)}
                className="p-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-md text-left hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-200 group"
              >
                <div className="font-medium text-purple-300 group-hover:text-purple-200 mb-1 text-xs">
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
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={selectAllSuggested}
            className="px-2 py-1 bg-green-600/20 border border-green-500/30 rounded-md text-green-300 hover:bg-green-600/30 transition-colors text-xs"
          >
            ✅ Tümünü Seç
          </button>
          <button
            onClick={clearSelection}
            className="px-2 py-1 bg-red-600/20 border border-red-500/30 rounded-md text-red-300 hover:bg-red-600/30 transition-colors text-xs"
          >
            🗑️ Temizle
          </button>
        </div>
      )}

      {/* Custom Products Toggle - Şık checkbox */}
      <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
        <div className="relative">
          <input
            type="checkbox"
            id="useCustomProducts"
            checked={useCustomProducts}
            onChange={(e) => handleCustomToggle(e.target.checked)}
            className="sr-only"
          />
          <label 
            htmlFor="useCustomProducts" 
            className="relative inline-flex cursor-pointer w-8 h-4"
            aria-label="Özel ürün açıklaması toggle"
          >
            <span className={`
              inline-block w-8 h-4 rounded-full transition-all duration-300 ease-in-out
              ${useCustomProducts 
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30' 
                : 'bg-gray-600 hover:bg-gray-500'
              }
            `}>
              <span className={`
                block w-3 h-3 mt-0.5 bg-white rounded-full transition-transform duration-300 ease-in-out shadow-md
                ${useCustomProducts ? 'translate-x-4' : 'translate-x-0.5'}
              `} />
            </span>
          </label>
        </div>
        <label htmlFor="useCustomProducts" className="text-xs text-gray-300 flex-1 cursor-pointer select-none">
          Özel ürün açıklaması
        </label>
      </div>

      {/* Custom Description Input */}
      {useCustomProducts && (
        <div className="space-y-1">
          <label htmlFor="customProductDescription" className="block text-xs font-medium text-gray-300">
            Ürün Açıklaması
          </label>
          <textarea
            id="customProductDescription"
            value={customProductDescription}
            onChange={(e) => handleCustomDescriptionChange(e.target.value)}
            placeholder="Örnek: Modern ahşap yemek masası, 6 kişilik sandalye takımı, dekoratif avize ve duvar tabloları istiyorum..."
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-xs"
            rows={2}
          />
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">
              {customProductDescription.length} karakter (isteğe bağlı)
            </span>
          </div>
        </div>
      )}

      {/* Product Categories Grid */}
      {!useCustomProducts && (
        <div className="space-y-1 overflow-hidden">
          <div className="flex justify-between items-center">
            <h4 className="block text-xs font-medium text-gray-300">
              Ürün Kategorileri ({suggestedProducts.length} adet)
            </h4>
            <span className="text-xs text-gray-500">
              {getSelectionSummary()}
            </span>
          </div>
          
          <div className="product-categories-container">
            <div 
              className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-3 product-categories-scrollbar"
            >
              {suggestedProducts.map((product) => (
                <ProductCategoryCard
                  key={product.id}
                  product={product}
                  isSelected={selectedProducts.includes(product.id)}
                  onToggle={() => handleProductToggle(product.id)}
                  roomType={roomType}
                  roomIcon={roomInfo.icon}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Validation Message - compact mode */}
      {!isValid && !className.includes('compact') && (
        <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-md">
          <p className="text-red-400 text-xs flex items-center gap-2">
            <span>⚠️</span>
            {getValidationMessage()}
          </p>
        </div>
      )}

      {/* Selection Summary - compact mode */}
      {isValid && !className.includes('compact') && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-md">
          <p className="text-green-400 text-xs flex items-center gap-2">
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

// Individual product category card with compact design
const ProductCategoryCard = memo(({ product, isSelected, onToggle, roomType, roomIcon }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        relative p-1 rounded-md border-2 cursor-pointer transition-all duration-200 group overflow-hidden w-full
        ${isSelected 
          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
        }
      `}
      aria-label={`${product.name} ${isSelected ? 'seçili' : 'seç'}`}
      type="button"
    >
      {/* Room Type Connection Indicator */}
      <div className="absolute top-0.5 left-0.5 z-10">
        <div className={`w-2 h-2 rounded-full ${getRoomTypeColor(roomType)} opacity-60 group-hover:opacity-100 transition-opacity`}>
        </div>
      </div>

      {/* Product Icon */}
      <div className="text-center mb-1 mt-1">
        <span className="text-lg block">{product.icon}</span>
      </div>

      {/* Product Name */}
      <div className="text-center px-1">
        <h4 className="font-medium text-white text-xs leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
          {product.name}
        </h4>
      </div>

      {/* Room Type Tooltip on Hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 text-white text-[10px] px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center">
        <span className="flex items-center justify-center gap-1">
          <span>{roomIcon}</span>
          <span>için uygun</span>
        </span>
      </div>

      {/* Selection Indicator - Şık tasarım */}
      {isSelected && (
        <div className="absolute -top-0.5 -right-0.5 z-10">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50 ring-1 ring-gray-900">
            <span className="text-white text-[10px] font-bold">✓</span>
          </div>
        </div>
      )}
    </button>
  );
});

ProductCategorySelector.displayName = 'ProductCategorySelector';
ProductCategoryCard.displayName = 'ProductCategoryCard';

ProductCategorySelector.propTypes = {
  roomType: PropTypes.string,
  onSelectionChange: PropTypes.func,
  className: PropTypes.string
};

ProductCategoryCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  roomType: PropTypes.string.isRequired,
  roomIcon: PropTypes.string.isRequired
};

export default ProductCategorySelector;
