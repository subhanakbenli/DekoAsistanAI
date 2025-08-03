import React, { memo, useCallback } from 'react';
import Tooltip from '../common/Tooltip';
import ColorPalette from '../common/ColorPalette';
import ProductCategorySelector from '../common/ProductCategorySelector';

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

  // Color selection callback'ini optimize et
  const handleColorSelection = useCallback((colorData) => {
    console.log('RoomInfoSection DEBUG - handleColorSelection called with:', colorData);
    
    // Form state'e renk bilgisini ekle
    if (colorData.isValid) {
      const colorInfo = colorData.selection;
      console.log('RoomInfoSection DEBUG - colorInfo to be set:', colorInfo);
      
      // handleChange kullanarak form'a renk bilgisini ekle
      const event = {
        target: {
          name: 'colorPalette',
          value: colorInfo
        }
      };
      
      console.log('RoomInfoSection DEBUG - Calling handleChange with event:', event);
      handleChange(event);
    } else {
      console.log('RoomInfoSection DEBUG - colorData is not valid:', colorData);
    }
  }, [handleChange]);

  // Product selection callback'ini optimize et
  const handleProductSelection = useCallback((productData) => {
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
  }, [handleChange]);
  const MAX_WIDTH = 5000;  // 50m
  const MAX_LENGTH = 5000; // 50m
  
  // Sınır aşım kontrolü
  const isHeightOverLimit = form.height && parseInt(form.height) > MAX_HEIGHT;
  const isWidthOverLimit = form.width && parseInt(form.width) > MAX_WIDTH;
  const isLengthOverLimit = form.length && parseInt(form.length) > MAX_LENGTH;
  const hasLimitExceeded = isHeightOverLimit || isWidthOverLimit || isLengthOverLimit;
  
  // Notes artık opsiyonel - form validation'dan kaldırıldı
  const isFormValid = form.width && form.length && form.height && !hasLimitExceeded;

  return (
    <div className="space-y-3">
      <div className="flex items-center mb-2">
        <h2 className="text-base font-semibold">🏠 Oda Bilgileri</h2>
        <Tooltip text="Odanızın özelliklerini tanımlayın">
          <span className="ml-2 text-blue-400 cursor-help">ℹ️</span>
        </Tooltip>
      </div>

      {/* Ana Layout: Sol taraf (Oda Bilgileri) + Sağ taraf (Ürün Önerileri) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sol Taraf: Oda Türü, Tasarım Tarzı ve Renk Paleti - Alt Alta */}
        <div className="space-y-4">
          {/* Oda Türü */}
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
              <option value="mutfak">🍳 Mutfak</option>
              <option value="banyo">🛁 Banyo</option>
              <option value="calisma">💻 Çalışma Odası</option>
            </select>
          </div>

          {/* Tasarım Tarzı */}
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
              <option value="endüstriyel">🏭 Endüstriyel</option>
              <option value="iskandinav">🌲 İskandinav</option>
            </select>
          </div>

          {/* Renk Paleti */}
          <div>
            <ColorPalette 
              className="compact-palette"
              onSelectionChange={handleColorSelection}
            />
          </div>

          {/* Fiyat Limiti */}
          <div>
            <Tooltip text="Bütçenize uygun ürün önerilerini almak için maksimum fiyat limitinizi girin">
              <label className="block text-sm text-gray-300 mb-1.5 cursor-help">
                💰 Fiyat Limiti (TL)
              </label>
            </Tooltip>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Örnek: 25000"
              min="0"
              step="500"
              className="w-full p-1.5 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">
              ℹ️ Boş bırakırsanız tüm fiyat aralığından öneriler gelir
            </p>
          </div>
        </div>

        {/* Sağ Taraf: Ürün Kategorisi */}
        <div>
          <ProductCategorySelector 
            roomType={form.roomType}
            className="compact"
            onSelectionChange={handleProductSelection}
          />
        </div>
      </div>

      <div>
        <Tooltip text="Tasarımınız için özel isteklerinizi belirtin (isteğe bağlı)">
          <label className="block text-sm text-gray-300 mb-1.5 cursor-help">
            📝 Tasarım Notları <span className="text-gray-500 text-xs">(İsteğe bağlı)</span>
          </label>
        </Tooltip>
        <textarea 
          name="notes" 
          rows={8} 
          placeholder="İsteğe bağlı: Açık renkler, doğal ışık, çocuk güvenliği gibi özel isteklerinizi yazabilirsiniz..." 
          className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 transition-colors resize-none" 
          value={form.notes} 
          onChange={handleChange}
        />
      </div>

      {/* Buton section'ı - ortalı ve kompakt */}
      <div className="mt-2.5 pt-1.5 border-t border-gray-600">
        <Tooltip text="Oda boyutlarını doldurduktan sonra tasarım önerisi oluşturmak için tıklayın (notlar isteğe bağlı)">
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
