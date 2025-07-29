import React from 'react';
import { useRoomDesign } from '../hooks/useRoomDesign';
import { RoomDimensionsSection, RoomInfoSection, DesignResultSection } from '../components/sections';
import Navbar from '../components/Navbar';

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
      <Navbar />
      <div className="pt-16">
        {/* Main Workspace */}
        <div className="max-w-7xl mx-auto p-8">
          {/* Compact Header Badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <span className="text-lg">🏠</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Tasarım Stüdyosu
                </h1>
                <p className="text-xs text-gray-400">AI destekli iç mekan tasarımı</p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs text-gray-400">Beta Sürümü</p>
              <p className="text-xs text-purple-300">Gemini AI</p>
            </div>
          </div>

        {/* Design Grid - Dynamic layout based on result with smooth transitions */}
        <div className="grid gap-8 transition-all duration-700 ease-in-out grid-cols-1 lg:grid-cols-3">
          
          {/* LEFT SIDE - Combined sections when result exists, separate when no result */}
          <div className="transition-all duration-700 ease-in-out lg:col-span-1">
            {result ? (
              // Combined Section 1 & 2 when result exists - Compact vertical layout
              <div className="space-y-4 animate-fadeIn">
                {/* Section 1 - Ultra Compact */}
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 transition-all duration-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-blue-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <h3 className="text-xs font-semibold text-blue-300">Oda Kurulumu</h3>
                  </div>
                  <div className="scale-90 origin-top">
                    <RoomDimensionsSection
                      form={form}
                      handleChange={handleChange}
                      newBlock={newBlock}
                      handleExtraChange={handleExtraChange}
                      addBlock={addBlock}
                      removeBlock={removeBlock}
                    />
                  </div>
                </div>

                {/* Section 2 - Ultra Compact */}
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 transition-all duration-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-green-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <h3 className="text-xs font-semibold text-green-300">Tasarım Tercihleri</h3>
                  </div>
                  <div className="scale-90 origin-top">
                    <RoomInfoSection
                      form={form}
                      handleChange={handleChange}
                      handleSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Separate sections when no result
              <div className="space-y-4">
                {/* SECTION 1 - Room Dimensions & Visualization */}
                <div className="space-y-4 transition-all duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-300">Oda Kurulumu</h3>
                        <p className="text-xs text-gray-400">Mekanınızın ölçülerini belirleyin</p>
                      </div>
                    </div>
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
              </div>
            )}
          </div>

          {/* MIDDLE SECTION - Only visible when no result */}
          {!result && (
            <div className="space-y-4 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-300">Tasarım Tercihleri</h3>
                    <p className="text-xs text-gray-400">Stilinizi ve tercihlerinizi seçin</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  💡 Kişiselleştirilmiş öneriler
                </div>
              </div>
              <RoomInfoSection
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* RIGHT SIDE - AI Recommendations - 2/3 width when result exists */}
          <div className={`space-y-4 transition-all duration-700 ease-in-out ${
            result ? 'lg:col-span-2 animate-expandRight' : 'lg:col-span-1'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h3 className={`font-semibold text-purple-300 transition-all duration-500 ${
                    result ? 'text-xl' : 'text-lg'
                  }`}>
                    AI Önerileri
                  </h3>
                  <p className="text-xs text-gray-400">
                    {result ? 'Mood board ve ürün önerileri' : 'Yapay zeka destekli tasarım önerileri'}
                  </p>
                </div>
              </div>
              {!result && (
                <div className="text-xs text-gray-500">
                  🤖 Gemini AI
                </div>
              )}
            </div>
            <div className={`transition-all duration-500 ${result ? 'animate-fadeIn' : ''}`}>
              <DesignResultSection 
                result={result} 
                moodBoard={moodBoard}
                progress={progress}
                isMoodBoardLoading={isMoodBoardLoading}
              />
            </div>
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
      </div>
      </div>
    </div>
  );
};

export default RoomDesignStudio;
