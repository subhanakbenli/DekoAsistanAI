import React from 'react';

/**
 * Design suggestion result section
 * @param {Object} result - Design result data
 */
const DesignResultSection = ({ result }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg space-y-4">
      <h2 className="text-lg font-semibold mb-3">🎨 Tasarım Önerisi</h2>
      {result ? (
        <div className="space-y-3">
          {/* Success/Error Status */}
          <div className={`p-3 rounded border ${result.success 
            ? 'bg-green-900 border-green-600' 
            : 'bg-red-900 border-red-600'
          }`}>
            <div className="flex items-center space-x-2">
              <span>{result.success ? '✅' : '❌'}</span>
              <span className={`text-sm font-medium ${result.success 
                ? 'text-green-200' 
                : 'text-red-200'
              }`}>
                {result.success ? 'Başarılı' : 'Hata'}
              </span>
            </div>
            <p className={`text-xs mt-1 ${result.success 
              ? 'text-green-100' 
              : 'text-red-100'
            }`}>
              {result.message}
            </p>
          </div>

          {/* Design Content */}
          <div className="bg-gray-700 p-4 rounded space-y-3">
            <div className="border-b border-gray-600 pb-2">
              <h3 className="text-lg font-semibold text-blue-300">{result.design_title}</h3>
            </div>
            
            {/* Room Info */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400">Oda Tipi:</span>
                <p className="text-white font-medium">{result.room_type}</p>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400">Tasarım Stili:</span>
                <p className="text-white font-medium">{result.design_style}</p>
              </div>
            </div>

            {/* Design Description */}
            <div className="bg-gray-800 p-3 rounded">
              <p className="text-sm font-medium text-yellow-300 mb-2">📝 Tasarım Açıklaması:</p>
              <p className="text-xs text-gray-300 leading-relaxed">{result.design_description}</p>
            </div>

            {/* Product Suggestions */}
            <div className="bg-gray-800 p-3 rounded">
              <p className="text-sm font-medium text-purple-300 mb-2">🛍️ Ürün Önerileri:</p>
              <p className="text-xs text-gray-300 leading-relaxed">{result.product_suggestion}</p>
            </div>

            {/* User Notes */}
            {result.notes && (
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-sm font-medium text-green-300 mb-2">� Verilen Bilgiler:</p>
                <pre className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {result.notes}
                </pre>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          <p className="text-sm">Henüz bir tasarım oluşturulmadı.</p>
          <p className="text-xs mt-2">👈 Sol taraftan bilgileri doldurun</p>
        </div>
      )}
    </div>
  );
};

export default DesignResultSection;
