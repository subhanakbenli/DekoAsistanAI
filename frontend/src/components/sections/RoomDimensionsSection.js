import React from 'react';
import Tooltip from '../common/Tooltip';

/**
 * Room dimensions section - basic dimensions only
 * @param {Object} form - Form state
 * @param {Function} handleChange - Form change handler
 */
const RoomDimensionsSection = ({ 
  form, 
  handleChange
}) => {
  // Dimension limits
  const MAX_HEIGHT = 2000; // 20 meters = 2000 cm
  const MAX_WIDTH = 5000;  // 50 meters = 5000 cm  
  const MAX_LENGTH = 5000; // 50 meters = 5000 cm

  // Limit check
  const isHeightOverLimit = form.height && parseInt(form.height) > MAX_HEIGHT;
  const isWidthOverLimit = form.width && parseInt(form.width) > MAX_WIDTH;
  const isLengthOverLimit = form.length && parseInt(form.length) > MAX_LENGTH;

  return (
    <div className="space-y-3">
      <div className="flex items-center mb-2">
        <h2 className="text-base font-semibold">📐 Room Dimensions</h2>
        <Tooltip text="Enter the basic dimensions of your room">
          <span className="ml-2 text-blue-400 cursor-help">ℹ️</span>
        </Tooltip>
      </div>

      {/* Dimension inputs */}
      <div className="space-y-2.5">
        <div className="relative">
          <Tooltip text="Room height (floor to ceiling) in cm. Maximum: 20 meters (2000 cm)">
            <label className="block text-sm text-gray-300 mb-0.5 cursor-help">
              ⬆️ Height (cm) <span className="text-xs text-gray-400">(Max: 2000cm)</span>
            </label>
          </Tooltip>
          <input 
            name="height" 
            type="number" 
            placeholder="250" 
            className={`w-full p-1.5 bg-gray-700 rounded border transition-colors ${
              isHeightOverLimit 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-gray-600 focus:border-blue-500'
            }`}
            onChange={handleChange} 
            value={form.height}
            min="1"
            max={MAX_HEIGHT}
          />
          {isHeightOverLimit && (
            <p className="text-xs text-red-400 mt-1">
              ⚠️ Maximum height is 20 meters (2000 cm)
            </p>
          )}
        </div>
        
        {/* Width and length side by side */}
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Tooltip text="Room width (left to right) in cm. Maximum: 50 meters (5000 cm)">
              <label className="block text-sm text-gray-300 mb-0.5 cursor-help">
                ↔️ Width (cm) <span className="text-xs text-gray-400">(Max: 5000cm)</span>
              </label>
            </Tooltip>
            <input 
              name="width" 
              type="number" 
              placeholder="300" 
              className={`w-full p-1.5 bg-gray-700 rounded border transition-colors ${
                isWidthOverLimit 
                  ? 'border-red-500 focus:border-red-400' 
                  : 'border-gray-600 focus:border-blue-500'
              }`}
              onChange={handleChange} 
              value={form.width}
              min="1"
              max={MAX_WIDTH}
            />
            {isWidthOverLimit && (
              <p className="text-xs text-red-400 mt-1">
                ⚠️ Maximum width is 50 meters (5000 cm)
              </p>
            )}
          </div>
          <div className="relative">
            <Tooltip text="Room length (top to bottom) in cm. Maximum: 50 meters (5000 cm)">
              <label className="block text-sm text-gray-300 mb-0.5 cursor-help">
                ↕️ Length (cm) <span className="text-xs text-gray-400">(Max: 5000cm)</span>
              </label>
            </Tooltip>
            <input 
              name="length" 
              type="number" 
              placeholder="400" 
              className={`w-full p-1.5 bg-gray-700 rounded border transition-colors ${
                isLengthOverLimit 
                  ? 'border-red-500 focus:border-red-400' 
                  : 'border-gray-600 focus:border-blue-500'
              }`}
              onChange={handleChange} 
              value={form.length}
              min="1"
              max={MAX_LENGTH}
            />
            {isLengthOverLimit && (
              <p className="text-xs text-red-400 mt-1">
                ⚠️ Maximum length is 50 meters (5000 cm)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Area calculation and info */}
      {form.width && form.length && (
        <div className="bg-gray-700 p-2 rounded text-sm">
          <p className="text-green-300">
            📏 Room Area: <strong>{((parseInt(form.width) * parseInt(form.length)) / 10000).toFixed(1)} m²</strong>
          </p>
          {form.height && (
            <p className="text-blue-300 text-xs mt-1">
              📦 Volume: {((parseInt(form.width) * parseInt(form.length) * parseInt(form.height)) / 1000000).toFixed(1)} m³
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomDimensionsSection;
