import React from 'react';
import { Link } from 'react-router-dom';
import { useRoomDesign } from '../hooks/useRoomDesign';
import { RoomDimensionsSection, RoomInfoSection, DesignResultSection } from '../components/sections';

/**
 * Room Design Studio - Professional Interior Design Tool
 * AI-powered room design and visualization platform
 */
const RoomDesignStudio = () => {
  const {
    form,
    newBlock,
    result,
    isLoading,
    moodBoard,
    progress,
    isMoodBoardLoading,
    connectionId,
    handleChange,
    handleExtraChange,
    addBlock,
    removeBlock,
    handleSubmit
  } = useRoomDesign();

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 mr-4"
              >
                <span className="text-xl">←</span>
                <span className="text-sm">Ana Sayfa</span>
              </Link>
              <div className="bg-purple-600 p-2 rounded-lg">
                <span className="text-xl">🏠</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Oda Tasarım Stüdyosu</h1>
                <p className="text-sm text-gray-300">AI Destekli İç Mekan Tasarım Platformu</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">Beta Sürümü</p>
                <p className="text-xs text-purple-300">Gemini AI ile Güçlendirildi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Workspace Header */}
        <div className="mb-8 text-center">
          <h2 className="text-lg font-semibold text-gray-200 mb-2">
            Mükemmel Oda Tasarımınızı Oluşturun
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            AI destekli aracımız ile mekanınızı tasarlayın. Kişiselleştirilmiş öneriler, 
            mood board'lar ve profesyonel iç mekan tasarım önerileri alın.
          </p>
        </div>

        {/* Design Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SECTION 1 - Room Dimensions & Visualization */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <h3 className="text-lg font-semibold text-blue-300">Oda Kurulumu</h3>
            </div>
            <RoomDimensionsSection
              form={form}
              handleChange={handleChange}
              newBlock={newBlock}
              handleExtraChange={handleExtraChange}
              addBlock={addBlock}
              removeBlock={removeBlock}
            />
          </div>

          {/* SECTION 2 - Design Preferences */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <h3 className="text-lg font-semibold text-green-300">Tasarım Tercihleri</h3>
            </div>
            <RoomInfoSection
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>

          {/* SECTION 3 - AI Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <h3 className="text-lg font-semibold text-purple-300">AI Önerileri</h3>
            </div>
            <DesignResultSection 
              result={result} 
              moodBoard={moodBoard}
              progress={progress}
              isMoodBoardLoading={isMoodBoardLoading}
            />
          </div>
        </div>

        {/* Status & Debug Info */}
        {connectionId && (
          <div className="mt-12 text-center">
            <div className="bg-gray-800 border border-gray-600 p-4 rounded-lg inline-block">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">AI Bağlantısı Aktif</span>
                <span className="text-xs text-gray-500">
                  Oturum: {connectionId.substring(0, 8)}...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">
              🤖 Yapay Zeka ile Profesyonel İç Mekan Tasarımı
            </p>
            <p className="text-gray-500 text-xs">
              Gemini AI ile Güçlendirildi • DALL-E Entegrasyonu • Gerçek Zamanlı Tasarım Üretimi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDesignStudio;
