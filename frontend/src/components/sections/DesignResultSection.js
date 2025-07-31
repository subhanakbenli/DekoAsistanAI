import React, { useState, useEffect } from 'react';
import ProductSuggestionSection from './ProductSuggestionSection';
import FavoriteButton from '../FavoriteButton';
import HashtagDisplay from '../HashtagDisplay';
import ShareToBlog from '../common/ShareToBlog';

/**
 * Design suggestion result section with mood board support
 * @param {Object} result - Design result data
 * @param {Object} moodBoard - Mood board data from WebSocket
 * @param {Object} progress - Progress data for mood board generation
 * @param {boolean} isMoodBoardLoading - Loading state for mood board
 */
const DesignResultSection = ({ result, moodBoard, progress, isMoodBoardLoading }) => {
  const [showMoodBoard, setShowMoodBoard] = useState(false);

  // Progress mesajları için mapping
  const progressMessages = {
    'preparing_prompt': 'Mood board konsepti hazırlanıyor...',
    'optimizing_prompt': 'Tasarım promtu optimize ediliyor...',
    'generating_image': 'AI görsel oluşturuyor...',
    'processing_image': 'Görsel işleniyor...',
    'finalizing': 'Son düzenlemeler yapılıyor...',
    'completed': 'Mood board hazırlandı!'
  };

  // Mood board tamamlandığında otomatik göster
  useEffect(() => {
    if (moodBoard?.image_data) {
      setShowMoodBoard(true);
    }
  }, [moodBoard]);

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
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-blue-300">{result.design_title}</h3>
                {result.design_id && (
                  <FavoriteButton 
                    designId={result.design_id}
                    variant="icon"
                    size="md"
                  />
                )}
              </div>
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

            {/* Hashtags */}
            {result.hashtags && (
              <div className="bg-gray-800 p-3 rounded">
                <HashtagDisplay 
                  hashtags={result.hashtags} 
                  previewLimit={4}
                  showAll={false}
                  copyEnabled={true}
                />
              </div>
            )}

            {/* Product Suggestions */}
            <ProductSuggestionSection result={result} />

            {/* User Notes */}
            {result.notes && (
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-sm font-medium text-green-300 mb-2">📝 Verilen Bilgiler:</p>
                <pre className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {result.notes}
                </pre>
              </div>
            )}

            {/* Mood Board Section */}
            <div className="bg-gray-800 p-3 rounded">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-pink-300">🎨 Mood Board</p>
                {moodBoard && (
                  <button 
                    onClick={() => setShowMoodBoard(!showMoodBoard)}
                    className="text-xs bg-pink-600 hover:bg-pink-700 px-2 py-1 rounded transition-colors"
                  >
                    {showMoodBoard ? 'Gizle' : 'Göster'}
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              {(isMoodBoardLoading || progress) && !moodBoard && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-300">
                      {progress ? progressMessages[progress.stage] || progress.message : 'Mood board hazırlanıyor...'}
                    </span>
                    <span className="text-blue-300">
                      {progress ? `${progress.progress_percentage}%` : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress ? progress.progress_percentage : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 italic">
                    AI tasarımınız için özel mood board oluşturuyor...
                  </p>
                </div>
              )}

              {/* Mood Board Image */}
              {moodBoard && showMoodBoard && (
                <div className="space-y-3">
                  <div className="relative">
                    <img 
                      src={`data:image/png;base64,${moodBoard.image_data.base64}`}
                      alt="Design Mood Board"
                      className="w-full rounded-lg shadow-lg border border-gray-600"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="hidden bg-red-900 border border-red-600 p-3 rounded text-center">
                      <span className="text-red-200 text-sm">❌ Mood board yüklenemedi</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-700 p-2 rounded">
                      <span className="text-gray-400">Oluşturulma:</span>
                      <p className="text-white font-medium">
                        {new Date(moodBoard.created_at).toLocaleString('tr-TR')}
                      </p>
                    </div>
                    <div className="bg-gray-700 p-2 rounded">
                      <span className="text-gray-400">Format:</span>
                      <p className="text-white font-medium">{moodBoard.image_data.format}</p>
                    </div>
                  </div>

                  {moodBoard.prompt_used && (
                    <div className="bg-gray-700 p-2 rounded">
                      <p className="text-xs text-gray-400 mb-1">🤖 AI Prompt:</p>
                      <p className="text-xs text-gray-300 italic">
                        {moodBoard.prompt_used.length > 150 
                          ? `${moodBoard.prompt_used.substring(0, 150)}...` 
                          : moodBoard.prompt_used
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Mood Board Error State */}
              {progress && progress.type === 'mood_board_error' && (
                <div className="bg-red-900 border border-red-600 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <span>❌</span>
                    <span className="text-sm font-medium text-red-200">Mood Board Hatası</span>
                  </div>
                  <p className="text-xs text-red-100 mt-1">
                    {progress.error || 'Mood board oluşturulurken bir hata oluştu.'}
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded mt-2 transition-colors"
                  >
                    Yeniden Dene
                  </button>
                </div>
              )}

              {/* Mood Board Placeholder */}
              {!moodBoard && !isMoodBoardLoading && !progress && (
                <div className="text-center text-gray-500 py-4">
                  <div className="text-2xl mb-2">🎨</div>
                  <p className="text-xs">
                    Tasarım önerisi gönderildikten sonra<br />
                    mood board otomatik oluşturulacak
                  </p>
                </div>
              )}
            </div>

            {/* WebSocket Connection Status */}
            {result.message && result.message.includes('connection:') && (
              <div className="bg-blue-900 border border-blue-600 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <span>🔗</span>
                  <span className="text-xs text-blue-200">
                    WebSocket bağlantısı kuruldu - Mood board oluşturuluyor...
                  </span>
                </div>
              </div>
            )}

            {/* Blog Paylaşımı */}
            {result.design_id && (
              <div className="pt-4 border-t border-gray-600">
                <ShareToBlog
                  designData={{
                    designId: result.design_id,
                    roomType: result.room_type,
                    designStyle: result.design_style,
                    width: result.width,
                    length: result.length,
                    height: result.height,
                    notes: result.notes,
                    designTitle: result.design_title,
                    designDescription: result.design_description,
                    hashtags: result.hashtags,
                    imageUrl: moodBoard ? `data:image/png;base64,${moodBoard.image_data.base64}` : null
                  }}
                  designId={result.design_id}
                  variant="card"
                  onPublishSuccess={(publishedPost) => {
                    // Toast notification could be added here
                    console.log('Design published to blog:', publishedPost);
                  }}
                  onPublishError={(error) => {
                    // Error handling could be added here
                    console.error('Failed to publish to blog:', error);
                  }}
                />
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
