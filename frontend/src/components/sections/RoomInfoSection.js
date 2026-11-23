import React, { memo, useCallback } from 'react';
import Tooltip from '../common/Tooltip';
import ColorPalette from '../common/ColorPalette';
import ProductCategorySelector from '../common/ProductCategorySelector';

/**
 * Room details section - optimized with React.memo
 * @param {Object} form - Form state
 * @param {Function} handleChange - Form change handler
 * @param {Function} handleSubmit - Form submit handler
 * @param {boolean} isLoading - Loading state
 */
const RoomInfoSection = memo(({ form, handleChange, handleSubmit, isLoading }) => {
  // Dimension limits
  const MAX_HEIGHT = 2000; // 20m

  // Memoize the color selection callback
  const handleColorSelection = useCallback((colorData) => {
    console.log('🎨 [RoomInfoSection] handleColorSelection called with:', colorData);
    
    // Add color info to the form state
    if (colorData.isValid) {
      const colorInfo = colorData.selection;
      console.log('🎨 [RoomInfoSection] colorInfo to be set:', colorInfo);
      
      // Add color info to the form via handleChange
      const event = {
        target: {
          name: 'colorPalette',
          value: colorInfo
        }
      };
      
      console.log('🎨 [RoomInfoSection] Calling handleChange with event:', event);
      handleChange(event);
    } else {
      console.log('❌ [RoomInfoSection] colorData is not valid:', colorData);
    }
  }, [handleChange]);

  // Memoize the product selection callback
  const handleProductSelection = useCallback((productData) => {
    console.log('📦 [RoomInfoSection] handleProductSelection called with:', productData);
    
    // Add product info to the form state
    if (productData.isValid) {
      const productInfo = productData.selection;
      console.log('📦 [RoomInfoSection] productInfo to be set:', productInfo);
      
      // Add product info to the form via handleChange
      const event = {
        target: {
          name: 'productCategories',
          value: productInfo
        }
      };
      
      console.log('📦 [RoomInfoSection] Calling handleChange with event:', event);
      handleChange(event);
    } else {
      console.log('❌ [RoomInfoSection] productData is not valid:', productData);
    }
  }, [handleChange]);
  const MAX_WIDTH = 5000;  // 50m
  const MAX_LENGTH = 5000; // 50m
  
  // Limit check
  const isHeightOverLimit = form.height && parseInt(form.height) > MAX_HEIGHT;
  const isWidthOverLimit = form.width && parseInt(form.width) > MAX_WIDTH;
  const isLengthOverLimit = form.length && parseInt(form.length) > MAX_LENGTH;
  const hasLimitExceeded = isHeightOverLimit || isWidthOverLimit || isLengthOverLimit;
  
  // Notes are now optional - removed from form validation
  const isFormValid = form.width && form.length && form.height && !hasLimitExceeded;

  return (
    <div className="space-y-3">
      <div className="flex items-center mb-2">
        <h2 className="text-base font-semibold">🏠 Room Details</h2>
        <Tooltip text="Describe the features of your room">
          <span className="ml-2 text-blue-400 cursor-help">ℹ️</span>
        </Tooltip>
      </div>

      {/* Main layout: left (room details) + right (product suggestions) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: room type, design style and color palette - stacked */}
        <div className="space-y-4">
          {/* Room type */}
          <div>
            <Tooltip text="Choose the type of room you want to design">
              <label className="block text-sm text-gray-300 mb-1.5 cursor-help">
                🏠 Room Type
              </label>
            </Tooltip>
            <select 
              name="roomType" 
              value={form.roomType} 
              onChange={handleChange} 
              className="w-full p-1.5 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 transition-colors"
            >
              <option value="salon">🛋️ Living Room</option>
              <option value="yatak">🛏️ Bedroom</option>
              <option value="çocuk">🧸 Kids' Room</option>
              <option value="mutfak">🍳 Kitchen</option>
              <option value="banyo">🛁 Bathroom</option>
              <option value="calisma">💻 Study</option>
            </select>
          </div>

          {/* Design style */}
          <div>
            <Tooltip text="Choose the design style for your room">
              <label className="block text-sm text-gray-300 mb-1.5 cursor-help">
                🎨 Design Style
              </label>
            </Tooltip>
            <select 
              name="designStyle" 
              value={form.designStyle} 
              onChange={handleChange} 
              className="w-full p-1.5 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 transition-colors"
            >
              <option value="modern">✨ Modern</option>
              <option value="minimal">🎯 Minimal</option>
              <option value="klasik">🏛️ Classic</option>
              <option value="endüstriyel">🏭 Industrial</option>
              <option value="iskandinav">🌲 Scandinavian</option>
            </select>
          </div>

          {/* Color palette */}
          <div>
            <ColorPalette 
              className="compact-palette"
              onSelectionChange={handleColorSelection}
            />
          </div>

          {/* Price limit */}
          <div>
            <Tooltip text="Enter your maximum price limit to get product suggestions that fit your budget">
              <label className="block text-sm text-gray-300 mb-1.5 cursor-help">
                💰 Price Limit (TL)
              </label>
            </Tooltip>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Example: 25000"
              min="0"
              step="500"
              className="w-full p-1.5 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">
              ℹ️ Leave empty to get suggestions from every price range
            </p>
          </div>
        </div>

        {/* Right: product category */}
        <div>
          <ProductCategorySelector 
            roomType={form.roomType}
            className="compact"
            onSelectionChange={handleProductSelection}
          />
        </div>
      </div>

      <div>
        <Tooltip text="Describe any special requests for your design (optional)">
          <label className="block text-sm text-gray-300 mb-1.5 cursor-help">
            📝 Design Notes <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
        </Tooltip>
        <textarea 
          name="notes" 
          rows={8} 
          placeholder="Optional: describe any special requests, such as light colors, natural light or child safety..." 
          className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 transition-colors resize-none" 
          value={form.notes} 
          onChange={handleChange}
        />
      </div>

      {/* Button section - centered and compact */}
      <div className="mt-2.5 pt-1.5 border-t border-gray-600">
        <Tooltip text="After filling in the room dimensions, click to generate a design suggestion (notes are optional)">
          <button 
            onClick={handleSubmit} 
            className="w-full bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg font-semibold text-base transition-colors flex items-center justify-center shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2">⏳</span>
                Submitting...
              </>
            ) : (
              <>
                <span className="mr-2">🎯</span>
                Generate Design Suggestion
              </>
            )}
          </button>
        </Tooltip>
        
        {(!isFormValid || hasLimitExceeded) && (
          <p className="text-xs text-yellow-400 text-center mt-1">
            {hasLimitExceeded 
              ? '⚠️ Dimension limits exceeded - please correct them'
              : '⚠️ Please fill in the dimensions and design notes'
            }
          </p>
        )}
      </div>
    </div>
  );
});

RoomInfoSection.displayName = 'RoomInfoSection';

export default RoomInfoSection;
