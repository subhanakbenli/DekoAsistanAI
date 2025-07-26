import React from 'react';
import { useRoomDesign } from '../../hooks/useRoomDesign';
import RoomDimensionsSection from './RoomDimensionsSection';
import RoomInfoSection from './RoomInfoSection';
import DesignResultSection from './DesignResultSection';

/**
 * Ana oda tasarımı demo sayfası
 * 3 section'dan oluşan modüler yapı
 */
const RoomDesignDemo = () => {
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
    <div id="demo" className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">🛠️ Oda Tasarımı Prototipi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* SECTION 1 - Oda Boyutları ve Görselleştirme */}
        <RoomDimensionsSection
          form={form}
          handleChange={handleChange}
          newBlock={newBlock}
          handleExtraChange={handleExtraChange}
          addBlock={addBlock}
          removeBlock={removeBlock}
        />

        {/* SECTION 2 - Oda Bilgileri */}
        <RoomInfoSection
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {/* SECTION 3 - Tasarım Önerisi */}
        <DesignResultSection 
          result={result} 
          moodBoard={moodBoard}
          progress={progress}
          isMoodBoardLoading={isMoodBoardLoading}
        />

        {/* WebSocket Connection Status (Debugging) */}
        {connectionId && (
          <div className="lg:col-span-3 text-center">
            <div className="bg-blue-900 border border-blue-600 p-2 rounded inline-block">
              <span className="text-xs text-blue-200">
                🔗 WebSocket ID: {connectionId.substring(0, 8)}...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDesignDemo;
