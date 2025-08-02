import React from 'react';
import Tooltip from '../common/Tooltip';

/**
 * Oda boyutları section'ı - Sadece temel boyutlar
 * @param {Object} form - Form state'i
 * @param {Function} handleChange - Form değişiklik handler'ı
 */
const RoomDimensionsSection = ({ 
  form, 
  handleChange
}) => {
  // Boyut sınırları
  const MAX_HEIGHT = 2000; // 20 metre = 2000 cm
  const MAX_WIDTH = 5000;  // 50 metre = 5000 cm  
  const MAX_LENGTH = 5000; // 50 metre = 5000 cm

  // Sınır aşım kontrolü
  const isHeightOverLimit = form.height && parseInt(form.height) > MAX_HEIGHT;
  const isWidthOverLimit = form.width && parseInt(form.width) > MAX_WIDTH;
  const isLengthOverLimit = form.length && parseInt(form.length) > MAX_LENGTH;

  return (
    <div className="space-y-3">
      <div className="flex items-center mb-2">
        <h2 className="text-base font-semibold">📐 Oda Boyutları</h2>
        <Tooltip text="Odanızın temel boyutlarını girin">
          <span className="ml-2 text-blue-400 cursor-help">ℹ️</span>
        </Tooltip>
      </div>

      {/* Boyut girişleri */}
      <div className="space-y-2.5">
        <div className="relative">
          <Tooltip text="Odanın yüksekliği (zemin-tavan) cm cinsinden. Maksimum: 20 metre (2000 cm)">
            <label className="block text-sm text-gray-300 mb-0.5 cursor-help">
              ⬆️ Yükseklik (cm) <span className="text-xs text-gray-400">(Max: 2000cm)</span>
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
              ⚠️ Maksimum yükseklik 20 metre (2000 cm) olmalıdır
            </p>
          )}
        </div>
        
        {/* Genişlik ve Uzunluk yan yana */}
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Tooltip text="Odanın genişliği (sol-sağ) cm cinsinden. Maksimum: 50 metre (5000 cm)">
              <label className="block text-sm text-gray-300 mb-0.5 cursor-help">
                ↔️ Genişlik (cm) <span className="text-xs text-gray-400">(Max: 5000cm)</span>
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
                ⚠️ Maksimum genişlik 50 metre (5000 cm) olmalıdır
              </p>
            )}
          </div>
          <div className="relative">
            <Tooltip text="Odanın uzunluğu (yukarı-aşağı) cm cinsinden. Maksimum: 50 metre (5000 cm)">
              <label className="block text-sm text-gray-300 mb-0.5 cursor-help">
                ↕️ Uzunluk (cm) <span className="text-xs text-gray-400">(Max: 5000cm)</span>
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
                ⚠️ Maksimum uzunluk 50 metre (5000 cm) olmalıdır
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Alan hesaplaması ve bilgi */}
      {form.width && form.length && (
        <div className="bg-gray-700 p-2 rounded text-sm">
          <p className="text-green-300">
            📏 Oda Alanı: <strong>{((parseInt(form.width) * parseInt(form.length)) / 10000).toFixed(1)} m²</strong>
          </p>
          {form.height && (
            <p className="text-blue-300 text-xs mt-1">
              📦 Hacim: {((parseInt(form.width) * parseInt(form.length) * parseInt(form.height)) / 1000000).toFixed(1)} m³
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomDimensionsSection;
