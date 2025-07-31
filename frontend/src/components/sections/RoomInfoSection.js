import React, { memo } from 'react';
import Tooltip from '../common/Tooltip';
import ColorPalette from '../common/ColorPalette';
import ProductCategorySelector from '../common/ProductCategorySelector';
import DoorWindowSelector from '../common/DoorWindowSelector';

/**
 * Oda bilgileri section'ı - React.memo ile optimize edilmiş
 * @param {Object} form - Form state'i
 * @param {Function} handleChange - Form değişiklik handler'ı
 * @param {Function} handleSubmit - Form gönderme handler'ı
 * @param {boolean} isLoading - Yükleme durumu
 */
const RoomInfoSection = memo(({ form, handleChange, handleSubmit, isLoading }) => {
  // Boyut sınırları
  const MAX_HEIGHT = 2000; // 20m
  const MAX_WIDTH = 5000;  // 50m
  const MAX_LENGTH = 5000; // 50m
  
  // Sınır aşım kontrolü
  const isHeightOverLimit = form.height && parseInt(form.height) > MAX_HEIGHT;
  const isWidthOverLimit = form.width && parseInt(form.width) > MAX_WIDTH;
  const isLengthOverLimit = form.length && parseInt(form.length) > MAX_LENGTH;
  const hasLimitExceeded = isHeightOverLimit || isWidthOverLimit || isLengthOverLimit;
  
  const isFormValid = form.width && form.length && form.height && form.notes?.trim() && !hasLimitExceeded;

  return (
    <div className="bg-gray-800 p-3 rounded-lg shadow-lg space-y-3">
      <div className="flex items-center mb-2">
        <h2 className="text-lg font-semibold">🏠 Oda Bilgileri</h2>
        <Tooltip text="Odanızın özelliklerini tanımlayın">
          <span className="ml-2 text-blue-400 cursor-help">ℹ️</span>
        </Tooltip>
      </div>

      <div>
        <Tooltip text="Tasarlayacağınız odanın türünü seçin">
          <label className="block text-sm text-gray-300 mb-1.5 cursor-help">
            🏠 Oda Türü
          </label>
        </Tooltip>
        <select 
          name="roomType" 
          value={form.roomType} 
          onChange={handleChange} 
          className="w-full p-1.5 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 transition-colors"
        >
          <option value="salon">🛋️ Salon</option>
          <option value="yatak">🛏️ Yatak Odası</option>
          <option value="çocuk">🧸 Çocuk Odası</option>
        </select>
      </div>

      <div>
        <Tooltip text="Odanızın tasarım stilini belirleyin">
          <label className="block text-sm text-gray-300 mb-1.5 cursor-help">
            🎨 Tasarım Tarzı
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
          <option value="klasik">🏛️ Klasik</option>
        </select>
      </div>

      {/* Renk Paleti Seçimi - Compact */}
      <div className="pt-2">
        <ColorPalette 
          className="compact-palette"
          onSelectionChange={(colorData) => {
            // Form state'e renk bilgisini ekle
            if (colorData.isValid) {
              const colorInfo = colorData.selection;
              // handleChange kullanarak form'a renk bilgisini ekle
              const event = {
                target: {
                  name: 'colorPalette',
                  value: colorInfo
                }
              };
              handleChange(event);
            }
          }}
        />
      </div>

      <div>
        <Tooltip text="Özel isteklerinizi, renk tercihlerinizi veya önemli noktaları yazın">
          <label className="block text-sm text-gray-300 mb-1.5 cursor-help">
            📝 Tasarım Notları
          </label>
        </Tooltip>
        <textarea 
          name="notes" 
          rows={8} 
          placeholder="Örnek: Açık renkler, doğal ışık, çocuk güvenliği..." 
          className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 transition-colors resize-none" 
          value={form.notes} 
          onChange={handleChange}
        />
      </div>

      {/* Ürün Kategorisi Seçimi */}
      <div className="pt-4 border-t border-gray-600">
        <ProductCategorySelector 
          roomType={form.roomType}
          className="compact"
          onSelectionChange={(productData) => {
            // Form state'e ürün bilgisini ekle
            if (productData.isValid) {
              const productInfo = productData.selection;
              // handleChange kullanarak form'a ürün bilgisini ekle
              const event = {
                target: {
                  name: 'productCategories',
                  value: productInfo
                }
              };
              handleChange(event);
            }
          }}
        />
      </div>

      {/* Kapı/Pencere Konumu Seçimi */}
      <div className="pt-4 border-t border-gray-600">
        <DoorWindowSelector 
          className="compact"
          onSelectionChange={(doorWindowData) => {
            // Form state'e kapı/pencere bilgisini ekle
            if (doorWindowData.isValid) {
              const doorWindowInfo = doorWindowData.configuration;
              // handleChange kullanarak form'a kapı/pencere bilgisini ekle
              const event = {
                target: {
                  name: 'doorWindow',
                  value: doorWindowInfo
                }
              };
              handleChange(event);
            }
          }}
        />
      </div>

      {/* Buton section'ı - ortalı ve kompakt */}
      <div className="mt-2.5 pt-1.5 border-t border-gray-600">
        <Tooltip text="Tüm bilgileri doldurduktan sonra tasarım önerisi oluşturmak için tıklayın">
          <button 
            onClick={handleSubmit} 
            className="w-full bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg font-semibold text-base transition-colors flex items-center justify-center shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2">⏳</span>
                Gönderiliyor...
              </>
            ) : (
              <>
                <span className="mr-2">🎯</span>
                Tasarım Önerisi Oluştur
              </>
            )}
          </button>
        </Tooltip>
        
        {(!isFormValid || hasLimitExceeded) && (
          <p className="text-xs text-yellow-400 text-center mt-1">
            {hasLimitExceeded 
              ? '⚠️ Boyut sınırları aşıldı - lütfen düzeltin'
              : '⚠️ Lütfen boyutları ve tasarım notlarını doldurun'
            }
          </p>
        )}
      </div>
    </div>
  );
});

RoomInfoSection.displayName = 'RoomInfoSection';

export default RoomInfoSection;
