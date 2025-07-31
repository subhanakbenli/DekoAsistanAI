import React, { memo } from 'react';
import { useColorPalette } from '../../hooks/useColorPalette';

/**
 * Color Palette Component
 * Interactive color palette selector with categories and custom description option
 * Features gradient previews, category filtering, and localStorage persistence
 */
const ColorPalette = memo(({ className = '', onSelectionChange }) => {
  const {
    selectedPalette,
    selectedCategory,
    useCustomDescription,
    customColorDescription,
    currentPalettes,
    availableCategories,
    handlePaletteSelect,
    handleCustomToggle,
    handleCustomDescriptionChange,
    handleCategoryChange,
    isValid,
    getValidationMessage
  } = useColorPalette();

  // Notify parent component of selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        isValid,
        selection: useCustomDescription 
          ? { type: 'custom', description: customColorDescription }
          : { type: 'palette', palette: selectedPalette }
      });
    }
  }, [selectedPalette, useCustomDescription, customColorDescription, isValid, onSelectionChange]);

  return (
    <div className={`${className.includes('compact-palette') ? 'space-y-2 w-full' : 'space-y-6'} ${className} ${className.includes('compact-palette') ? 'compact-color-palette overflow-hidden' : ''}`}>
      {/* Header */}
      <div className={className.includes('compact-palette') ? 'space-y-1' : 'space-y-2'}>
        <h3 className={`font-semibold text-white flex items-center gap-2 ${className.includes('compact-palette') ? 'text-sm' : 'text-xl'}`}>
          <span className={className.includes('compact-palette') ? 'text-base' : 'text-2xl'}>🎨</span>
          Renk Paleti
        </h3>
        {!className.includes('compact-palette') && (
          <p className="text-gray-400 text-sm">
            Tasarımınız için uygun renk paletini seçin veya özel renk açıklaması girin.
          </p>
        )}
      </div>

      {/* Category Selector */}
      <div className={`${className.includes('compact-palette') ? 'space-y-1' : 'space-y-3'}`}>
        <label className={`block font-medium text-gray-300 ${className.includes('compact-palette') ? 'text-xs' : 'text-sm'}`}>
          Kategori
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className={`w-full bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${className.includes('compact-palette') ? 'px-2 py-1 text-xs' : 'px-4 py-3'}`}
          disabled={useCustomDescription}
        >
          {availableCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Description Toggle */}
      <div className={`flex items-center gap-3 bg-gray-800/50 rounded-lg border border-gray-700 ${className.includes('compact-palette') ? 'p-2' : 'p-4'}`}>
        <input
          type="checkbox"
          id="useCustomDescription"
          checked={useCustomDescription}
          onChange={(e) => handleCustomToggle(e.target.checked)}
          className={`text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 ${className.includes('compact-palette') ? 'w-3 h-3' : 'w-4 h-4'}`}
        />
        <label htmlFor="useCustomDescription" className={`text-gray-300 flex-1 cursor-pointer ${className.includes('compact-palette') ? 'text-xs' : 'text-sm'}`}>
          Özel renk açıklaması
        </label>
      </div>

      {/* Custom Description Input */}
      {useCustomDescription && (
        <div className={`${className.includes('compact-palette') ? 'space-y-1' : 'space-y-3'}`}>
          <label className={`block font-medium text-gray-300 ${className.includes('compact-palette') ? 'text-xs' : 'text-sm'}`}>
            Renk Açıklaması
          </label>
          <textarea
            value={customColorDescription}
            onChange={(e) => handleCustomDescriptionChange(e.target.value)}
            placeholder="Örnek: Sıcak kahverengi tonları, krem beyazı..."
            className={`w-full bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none ${className.includes('compact-palette') ? 'px-2 py-1 text-xs' : 'px-4 py-3'}`}
            rows={className.includes('compact-palette') ? 2 : 4}
          />
          <div className="flex justify-between items-center text-xs">
            <span className={`${customColorDescription.length >= 10 ? 'text-green-400' : 'text-red-400'}`}>
              {customColorDescription.length}/10 minimum karakter
            </span>
          </div>
        </div>
      )}

      {/* Palette Grid */}
      {!useCustomDescription && (
        <div className={`${className.includes('compact-palette') ? 'space-y-1' : 'space-y-4'} overflow-hidden`}>
          <label className={`block font-medium text-gray-300 ${className.includes('compact-palette') ? 'text-xs' : 'text-sm'}`}>
            Paleti Seç ({currentPalettes.length})
          </label>
          
          {currentPalettes.length === 0 ? (
            <div className={`text-center text-gray-500 ${className.includes('compact-palette') ? 'py-2' : 'py-8'}`}>
              <span className={`block mb-1 ${className.includes('compact-palette') ? 'text-lg' : 'text-4xl'}`}>🎨</span>
              <span className={className.includes('compact-palette') ? 'text-xs' : ''}>Bu kategoride palet yok.</span>
            </div>
          ) : (
            <div 
              className={`grid overflow-y-auto overflow-x-hidden ${className.includes('compact-palette') ? 'grid-cols-4 gap-1 max-h-24 pr-1' : 'grid-cols-1 max-h-96 gap-4 pr-2'}`}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#4B5563 transparent'
              }}
            >
              {currentPalettes.map((palette) => (
                <PaletteCard
                  key={palette.id}
                  palette={palette}
                  isSelected={selectedPalette?.id === palette.id}
                  onSelect={() => handlePaletteSelect(palette)}
                  isCompact={className.includes('compact-palette')}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Validation Message - only show in non-compact mode */}
      {!isValid && !className.includes('compact-palette') && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-400 flex items-center gap-2 text-sm">
            <span>⚠️</span>
            {getValidationMessage()}
          </p>
        </div>
      )}

      {/* Selection Summary - only show in non-compact mode */}
      {isValid && !className.includes('compact-palette') && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400 flex items-center gap-2 text-sm">
            <span>✅</span>
            {useCustomDescription 
              ? 'Özel renk açıklaması hazır'
              : `"${selectedPalette?.name}" seçildi`
            }
          </p>
        </div>
      )}
    </div>
  );
});

/**
 * Individual Palette Card Component
 */
const PaletteCard = memo(({ palette, isSelected, onSelect, isCompact = false }) => {
  return (
    <div
      onClick={onSelect}
      className={`
        relative rounded-lg border-2 cursor-pointer transition-all duration-200 group overflow-hidden
        ${isSelected 
          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
        }
        ${isCompact ? 'p-1' : 'p-4'}
      `}
      title={isCompact ? palette.name : undefined}
    >
      {/* Popular indicator for compact mode */}
      {palette.isPopular && isCompact && (
        <div className="absolute -top-1 -right-1 z-10">
          <span className="text-yellow-400 text-xs">⭐</span>
        </div>
      )}

      {/* Popular Badge - full version for non-compact */}
      {palette.isPopular && !isCompact && (
        <div className="absolute -top-2 -right-2">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
            ⭐ Popüler
          </span>
        </div>
      )}

      {/* Color Gradient Preview */}
      <div className={`rounded shadow-inner ${palette.gradient} ${isCompact ? 'h-8' : 'h-16 mb-3'}`} />

      {/* Color Circles - only show in non-compact mode */}
      {!isCompact && (
        <div className="flex gap-1 mb-3 justify-center">
          {palette.colors.map((color, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full border-2 border-gray-600 shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}

      {/* Palette Info - only show in non-compact mode */}
      {!isCompact && (
        <div className="text-center">
          <h4 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
            {palette.name}
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            {palette.description}
          </p>
        </div>
      )}

      {/* Tooltip for compact mode */}
      {isCompact && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 whitespace-nowrap border border-gray-600 backdrop-blur-sm">
          <div className="text-center">
            <div className="font-semibold text-white">{palette.name}</div>
            {palette.description && (
              <div className="text-gray-300 text-xs mt-1 max-w-40 whitespace-normal">
                {palette.description}
              </div>
            )}
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className={`absolute ${isCompact ? 'top-0 left-0' : 'top-2 left-2'} z-10`}>
          <div className={`bg-blue-500 rounded-full flex items-center justify-center ${isCompact ? 'w-3 h-3' : 'w-6 h-6'}`}>
            <span className={`text-white ${isCompact ? 'text-xs leading-none' : 'text-xs'}`}>✓</span>
          </div>
        </div>
      )}
    </div>
  );
});

ColorPalette.displayName = 'ColorPalette';
PaletteCard.displayName = 'PaletteCard';

export default ColorPalette;
