import React from 'react';
import Tooltip from '../common/Tooltip';
import RoomVisualization from '../common/RoomVisualization';
import ExtraBlock from '../common/ExtraBlock';

/**
 * Oda boyutları ve görselleştirme section'ı
 * @param {Object} form - Form state'i
 * @param {Function} handleChange - Form değişiklik handler'ı
 * @param {Object} newBlock - Yeni çıkıntı state'i
 * @param {Function} handleExtraChange - Çıkıntı değişiklik handler'ı
 * @param {Function} addBlock - Çıkıntı ekleme fonksiyonu
 * @param {Function} removeBlock - Çıkıntı silme fonksiyonu
 */
const RoomDimensionsSection = ({ 
  form, 
  handleChange, 
  newBlock, 
  handleExtraChange, 
  addBlock, 
  removeBlock 
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
        <Tooltip text="Odanızın temel boyutlarını girin ve görselleştirin">
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

      {/* Oda Görselleştirme - kompakt */}
      <div className="bg-gray-700 p-2.5 rounded">
        <RoomVisualization 
          width={parseInt(form.width) || 0} 
          length={parseInt(form.length) || 0} 
          extras={form.extras} 
        />
      </div>

      {/* Çıkıntı Ekleme - kompakt */}
      <div className="bg-gray-700 p-2.5 rounded space-y-1.5">
        <div className="flex items-center">
          <h4 className="font-medium text-sm">📐 Çıkıntı Ekle</h4>
          <Tooltip text="Kolon, niş gibi sabit yapılar">
            <span className="ml-1 text-blue-400 cursor-help text-xs">ℹ️</span>
          </Tooltip>
        </div>
        
        <div className="grid grid-cols-2 gap-1.5">
          <input 
            name="width" 
            type="number" 
            placeholder="Genişlik" 
            className="p-1 bg-gray-800 rounded text-xs" 
            value={newBlock.width} 
            onChange={handleExtraChange}
            min="1"
          />
          <input 
            name="length" 
            type="number" 
            placeholder="Uzunluk" 
            className="p-1 bg-gray-800 rounded text-xs" 
            value={newBlock.length} 
            onChange={handleExtraChange}
            min="1"
          />
          <input 
            name="x" 
            type="number" 
            placeholder="X Pos." 
            className="p-1 bg-gray-800 rounded text-xs" 
            value={newBlock.x} 
            onChange={handleExtraChange}
            min="0"
          />
          <input 
            name="y" 
            type="number" 
            placeholder="Y Pos." 
            className="p-1 bg-gray-800 rounded text-xs" 
            value={newBlock.y} 
            onChange={handleExtraChange}
            min="0"
          />
        </div>
        
        <button 
          onClick={addBlock} 
          className="w-full bg-purple-500 hover:bg-purple-600 px-1.5 py-0.5 rounded text-xs font-medium transition-colors"
        >
          ➕ Ekle
        </button>

        {/* Mevcut Çıkıntılar - kompakt liste */}
        {form.extras.length > 0 && (
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-gray-300">📦 Çıkıntılar:</p>
            <div className="max-h-32 overflow-y-auto space-y-0.5">
              {form.extras.map((block, index) => (
                <ExtraBlock 
                  key={`block-${index}-${block.x}-${block.y}`} 
                  block={block} 
                  index={index} 
                  onRemove={removeBlock} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDimensionsSection;
