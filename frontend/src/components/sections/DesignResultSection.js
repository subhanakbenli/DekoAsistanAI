import React, { useState, useEffect } from 'react';
import ProductSuggestionSection from './ProductSuggestionSection';
import FavoriteButton from '../FavoriteButton';
import HashtagDisplay from '../HashtagDisplay';
import ShareToBlog from '../common/ShareToBlog';

/**
 * Enhanced Design Result Section with modern UI
 * Features: Modern cards, gradients, animations, better typography
 */
const DesignResultSection = ({ result, moodBoard, progress, isMoodBoardLoading }) => {
  const [showMoodBoard, setShowMoodBoard] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Progress mesajları için mapping
  const progressMessages = {
    'preparing_prompt': "Deko'nun hayali konsepti hazırlanıyor...",
    'optimizing_prompt': 'Tasarım promtu optimize ediliyor...',
    'generating_image': 'AI görsel oluşturuyor...',
    'processing_image': 'Görsel işleniyor...',
    'finalizing': 'Son düzenlemeler yapılıyor...',
    'completed': "Deko'nun hayali hazırlandı!"
  };

  // Mood board tamamlandığında otomatik göster
  useEffect(() => {
    if (moodBoard?.image_data && !showMoodBoard) {
      setShowMoodBoard(true);
    }
  }, [moodBoard?.mood_board_id, moodBoard?.id]);

  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: '🎨' },
    { id: 'moodboard', label: "Deko'nun Hayali", icon: '🖼️' },
    { id: 'userinput', label: 'Kullanıcı Girdileri', icon: '📝' },
    { id: 'products', label: 'Ürünler', icon: '🛍️' }
  ];

  return (
    <div className="space-y-6">
      {result ? (
        <div className="space-y-6">
          
          {/* Tab Navigation */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-2">
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="space-y-3 animate-fadeIn">
                
                {/* Main Content Grid - Mood Board Left, Content Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  
                  {/* Left: Mood Board */}
                  <div className="order-2 lg:order-1">
                    <MoodBoardSection 
                      moodBoard={moodBoard} 
                      progress={progress} 
                      isMoodBoardLoading={isMoodBoardLoading}
                      showMoodBoard={showMoodBoard}
                      setShowMoodBoard={setShowMoodBoard}
                      progressMessages={progressMessages}
                      compact={true}
                    />
                  </div>

                  {/* Right: Design Content */}
                  <div className="order-1 lg:order-2 space-y-3">
                    
                    {/* Design Title Card */}
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
                              <span className="text-lg">🏠</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">{result.design_title}</h3>
                          </div>
                          <p className="text-gray-300 leading-relaxed">{result.design_description}</p>
                        </div>
                        {result.design_id && (
                          <div className="ml-4">
                            <FavoriteButton 
                              designId={result.design_id}
                              variant="icon"
                              size="lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Room Info Cards Grid */}
                    <div className="grid grid-cols-1 gap-2">
                      <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 backdrop-blur-sm rounded-xl p-2 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
                        <div className="flex items-center space-x-3">
                          <div className="bg-purple-500/20 p-2 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                            <span className="text-lg">🏛️</span>
                          </div>
                          <div>
                            <p className="text-purple-300 text-sm font-medium">Oda Tipi</p>
                            <p className="text-white font-semibold">{result.room_type}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-pink-900/40 to-pink-800/40 backdrop-blur-sm rounded-xl p-2 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 group">
                        <div className="flex items-center space-x-3">
                          <div className="bg-pink-500/20 p-2 rounded-lg group-hover:bg-pink-500/30 transition-colors">
                            <span className="text-lg">🎭</span>
                          </div>
                          <div>
                            <p className="text-pink-300 text-sm font-medium">Tasarım Stili</p>
                            <p className="text-white font-semibold">{result.design_style}</p>
                          </div>
                        </div>
                      </div>

                      {(result.width || result.length || result.height) && (
                        <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/40 backdrop-blur-sm rounded-xl p-2 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group">
                          <div className="flex items-center space-x-3">
                            <div className="bg-cyan-500/20 p-2 rounded-lg group-hover:bg-cyan-500/30 transition-colors">
                              <span className="text-lg">📐</span>
                            </div>
                            <div>
                              <p className="text-cyan-300 text-sm font-medium">Boyutlar</p>
                              <p className="text-white font-semibold">
                                {[result.width, result.length, result.height].filter(Boolean).join(' × ')} m
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Hashtags Card */}
                    {result.hashtags && (
                      <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/40 backdrop-blur-sm rounded-xl p-2 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="bg-indigo-500/20 p-2 rounded-lg">
                            <span className="text-lg">#️⃣</span>
                          </div>
                          <h5 className="text-indigo-300 text-sm font-medium">Popüler Etiketler</h5>
                        </div>
                        <HashtagDisplay 
                          hashtags={result.hashtags} 
                          previewLimit={6}
                          showAll={false}
                          copyEnabled={true}
                        />
                      </div>
                    )}

                    {/* Blog Paylaşımı */}
                    {result.design_id && (
                      <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-sm rounded-xl p-2 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
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
                            imageUrl: moodBoard ? (
                              moodBoard.image_data?.base64 
                                ? `data:image/png;base64,${moodBoard.image_data.base64}`
                                : moodBoard.image_data?.file_path 
                                  ? `http://localhost:8000/static/mood_boards/${moodBoard.image_data.file_path.split('\\').pop().split('/').pop()}`
                                  : null
                            ) : null
                          }}
                          designId={result.design_id}
                          variant="card"
                          onPublishSuccess={(publishedPost) => {
                            console.log('Design published to blog:', publishedPost);
                          }}
                          onPublishError={(error) => {
                            console.error('Failed to publish to blog:', error);
                          }}
                        />
                      </div>
                    )}
                  </div>

                </div>
                </div>
              </div>
            )}

            {/* Mood Board Tab */}
            {activeTab === 'moodboard' && (
              <div className="animate-fadeIn">
                <MoodBoardSection 
                  moodBoard={moodBoard} 
                  progress={progress} 
                  isMoodBoardLoading={isMoodBoardLoading}
                  showMoodBoard={showMoodBoard}
                  setShowMoodBoard={setShowMoodBoard}
                  progressMessages={progressMessages}
                />
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="animate-fadeIn">
                <ProductSuggestionSection result={result} />
              </div>
            )}

            {/* User Input Tab */}
            {activeTab === 'userinput' && (
              <div className="animate-fadeIn">
                <UserInputSection result={result} />
              </div>
            )}

          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">🎨</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Henüz Tasarım Oluşturulmadı</h3>
              <p className="text-gray-500 text-sm">
                Sol taraftaki formu doldurarak yapay zeka destekli<br />
                tasarım önerilerinizi alabilirsiniz
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600 text-xs">
              <span>👈</span>
              <span>Formları doldurun ve önerilerinizi görün</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Modern Mood Board Section Component
 */
const MoodBoardSection = ({ 
  moodBoard, 
  progress, 
  isMoodBoardLoading, 
  showMoodBoard, 
  setShowMoodBoard, 
  progressMessages,
  compact = false
}) => {
  return (
    <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-2 rounded-lg">
            <span className="text-lg">🎨</span>
          </div>
          <h4 className="text-lg font-semibold text-pink-300">Deko'nun Hayali</h4>
        </div>
        
        {moodBoard && (
          <button 
            onClick={() => setShowMoodBoard(!showMoodBoard)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              showMoodBoard 
                ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-lg' 
                : 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30'
            }`}
          >
            {showMoodBoard ? 'Gizle' : 'Göster'}
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {(isMoodBoardLoading || progress) && !moodBoard && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-pink-300 text-sm font-medium">
              {progress ? progressMessages[progress.stage] || progress.message : "Deko'nun hayali hazırlanıyor..."}
            </span>
            <span className="text-pink-300 text-sm font-bold">
              {progress ? `${progress.progress_percentage}%` : '0%'}
            </span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out bg-size-200 animate-gradient-x"
                style={{ width: `${progress ? progress.progress_percentage : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-pink-950/30 rounded-lg p-4 border border-pink-500/10">
            <p className="text-pink-200 text-sm italic text-center">
              ✨ AI tasarımınız için gerçekçi oda görseli oluşturuyor...
            </p>
          </div>
        </div>
      )}

      {/* Mood Board Image */}
      {moodBoard && showMoodBoard && (
        <div className="space-y-6 animate-fadeIn">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl filter blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
            {(() => {
              // Çoklu kaynak desteği: farklı data yapılarını destekle
              let imageSrc = null;
              
              // 1. Nested image_data yapısı
              if (moodBoard.image_data?.base64) {
                imageSrc = `data:image/png;base64,${moodBoard.image_data.base64}`;
              } else if (moodBoard.image_data?.file_path) {
                const fileName = moodBoard.image_data.file_path.split('\\').pop().split('/').pop();
                imageSrc = `http://localhost:8000/static/mood_boards/${fileName}`;
              }
              // 2. Direct properties
              else if (moodBoard.base64) {
                imageSrc = `data:image/png;base64,${moodBoard.base64}`;
              } else if (moodBoard.file_path) {
                const fileName = moodBoard.file_path.split('\\').pop().split('/').pop();
                imageSrc = `http://localhost:8000/static/mood_boards/${fileName}`;
              }
              // 3. Direct image_data string
              else if (typeof moodBoard.image_data === 'string') {
                if (moodBoard.image_data.startsWith('data:')) {
                  imageSrc = moodBoard.image_data;
                } else {
                  const fileName = moodBoard.image_data.split('\\').pop().split('/').pop();
                  imageSrc = `http://localhost:8000/static/mood_boards/${fileName}`;
                }
              }
              // 4. Image URL
              else if (moodBoard.image_url) {
                imageSrc = moodBoard.image_url;
              }
              
              // Eğer imageSrc hala undefined ise, alternatif kaynaklara bak
              if (!imageSrc) {
                // Fallback sources
                if (moodBoard.base64) {
                  imageSrc = `data:image/png;base64,${moodBoard.base64}`;
                } else if (moodBoard.file_path) {
                  const fileName = moodBoard.file_path.split('\\').pop().split('/').pop();
                  imageSrc = `http://localhost:8000/static/mood_boards/${fileName}`;
                }
              }
              
              return (
                <img 
                  src={imageSrc}
                  alt="Oda Görselleştirmesi"
                  className="relative w-full rounded-xl shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              );
            })()}
            <div className="hidden bg-red-900/80 backdrop-blur-sm border border-red-500/30 p-6 rounded-xl text-center">
              <span className="text-red-200">❌ Deko'nun hayali yüklenemedi</span>
            </div>
          </div>
          
          {/* Mood Board Info Grid - Only show if not compact */}
          {!compact && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-pink-950/30 backdrop-blur-sm rounded-lg p-4 border border-pink-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-pink-400">📅</span>
                    <span className="text-pink-300 text-sm font-medium">Oluşturulma</span>
                  </div>
                  <p className="text-white font-semibold">
                    {new Date(moodBoard.created_at).toLocaleString('tr-TR')}
                  </p>
                </div>
                
                <div className="bg-purple-950/30 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-purple-400">🖼️</span>
                    <span className="text-purple-300 text-sm font-medium">Format</span>
                  </div>
                  <p className="text-white font-semibold">{moodBoard.image_data?.format || 'PNG'}</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error State */}
      {progress && (progress.type === 'room_visualization_error' || progress.type === 'mood_board_error') && (
        <div className="bg-red-900/40 backdrop-blur-sm border border-red-500/30 p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <span className="text-lg">❌</span>
            </div>
            <span className="text-lg font-semibold text-red-200">Deko'nun Hayali Hatası</span>
          </div>
          <p className="text-red-100 mb-4">
            {progress.error || "Deko'nun hayali oluşturulurken bir hata oluştu."}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
          >
            🔄 Yeniden Dene
          </button>
        </div>
      )}

      {/* Empty State */}
      {!moodBoard && !isMoodBoardLoading && !progress && (
        <div className="text-center py-12">
          <div className="bg-pink-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎨</span>
          </div>
          <h5 className="text-pink-300 font-semibold mb-2">Deko'nun Hayali Bekleniyor</h5>
          <p className="text-gray-400 text-sm">
            Tasarım önerisi gönderildikten sonra<br />
            Deko'nun hayali otomatik oluşturulacak
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * User Input Section - Kullanıcının girdiği bilgileri gösterir
 */
const UserInputSection = ({ result }) => {
  const hasUserInput = result.notes || result.width || result.length || result.height;

  if (!hasUserInput) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">📝</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Kullanıcı Girdisi Yok</h3>
            <p className="text-gray-500 text-sm">
              Bu tasarım için kullanıcı tarafından<br />
              özel not veya boyut bilgisi verilmemiş
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-yellow-500 to-amber-500 p-3 rounded-lg">
            <span className="text-xl">📝</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Kullanıcı Girdileri</h3>
            <p className="text-gray-400 text-sm">Tasarım oluşturulurken verilen özel bilgiler</p>
          </div>
        </div>

        {/* Kullanıcı Notları */}
        {result.notes && (
          <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-500/20 p-2 rounded-lg flex-shrink-0 mt-1">
                <span className="text-lg">💭</span>
              </div>
              <div className="flex-1">
                <h4 className="text-yellow-300 font-semibold mb-3">Özel Notlar & İstekler</h4>
                <div className="bg-yellow-950/30 rounded-lg p-4 border border-yellow-500/20">
                  <p className="text-white leading-relaxed">{result.notes}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Oda Boyutları */}
        {(result.width || result.length || result.height) && (
          <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-cyan-500/20 p-2 rounded-lg">
                <span className="text-lg">📐</span>
              </div>
              <h4 className="text-cyan-300 font-semibold">Belirtilen Oda Boyutları</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {result.width && (
                <div className="bg-cyan-950/30 rounded-lg p-4 text-center border border-cyan-500/20">
                  <div className="text-cyan-400 text-sm font-medium mb-1">Genişlik</div>
                  <div className="text-2xl font-bold text-white">{result.width}</div>
                  <div className="text-cyan-300 text-sm">metre</div>
                </div>
              )}
              {result.length && (
                <div className="bg-cyan-950/30 rounded-lg p-4 text-center border border-cyan-500/20">
                  <div className="text-cyan-400 text-sm font-medium mb-1">Uzunluk</div>
                  <div className="text-2xl font-bold text-white">{result.length}</div>
                  <div className="text-cyan-300 text-sm">metre</div>
                </div>
              )}
              {result.height && (
                <div className="bg-cyan-950/30 rounded-lg p-4 text-center border border-cyan-500/20">
                  <div className="text-cyan-400 text-sm font-medium mb-1">Yükseklik</div>
                  <div className="text-2xl font-bold text-white">{result.height}</div>
                  <div className="text-cyan-300 text-sm">metre</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ek Bilgi */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/20">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <h4 className="text-indigo-300 font-semibold mb-2">Tasarım Bilgileri</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-indigo-400">Oda Tipi:</span>
                  <span className="text-white ml-2 font-medium">{result.room_type}</span>
                </div>
                <div>
                  <span className="text-indigo-400">Tasarım Stili:</span>
                  <span className="text-white ml-2 font-medium">{result.design_style}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignResultSection;
