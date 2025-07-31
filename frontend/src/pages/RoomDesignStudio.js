import React, { memo, useCallback } from 'react';
import { useRoomDesign } from '../hooks/useRoomDesign';
import { StudioHeader, StudioSidebar, StudioDesignForm, StudioResultPanel } from '../components/studio';
import Navbar from '../components/Navbar';
import { usePerformanceTracker } from '../hooks/usePerformance';

// Layout configuration constants - KISS principle ✨
const LAYOUT_CONFIGS = {
  // Yeni 3-section layout: Section 1 (30%) + Section 2 (70%) + AI Önerileri (100%)
  MAIN_LAYOUT: "space-y-8",
  TOP_SECTIONS: "grid grid-cols-1 lg:grid-cols-[30%_70%] gap-3",
  AI_RESULTS_FULL: "w-full"
};

// AI-powered room design studio with dynamic layout
const RoomDesignStudio = memo(() => {
  usePerformanceTracker('RoomDesignStudio');

  const roomDesignState = useRoomDesign();
  
  // Extract needed props - cleaner destructuring ✨
  const {
    form,
    newBlock,
    result,
    isLoading,
    moodBoard,
    progress,
    isMoodBoardLoading,
    isConnected,
    handleChange,
    handleExtraChange,
    addBlock,
    removeBlock,
    handleSubmit
  } = roomDesignState;

  // Simplified layout logic - KISS principle ✨
  const scrollToResults = useCallback(() => {
    if (result) {
      // AI önerileri section'ına scroll
      const resultsSection = document.getElementById('ai-results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [result]);

  // Result değiştiğinde scroll yap
  React.useEffect(() => {
    if (result) {
      setTimeout(scrollToResults, 300); // Animation için kısa delay
    }
  }, [result, scrollToResults]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-1.5 py-3">
          
          <StudioHeader />

          {/* Yeni Layout: Section 1 (40%) + Section 2 (60%) */}
          <div className={LAYOUT_CONFIGS.MAIN_LAYOUT}>
            
            {/* Üst Kısım: Oda Kurulumu (30%) + Tasarım Tercihleri (70%) */}
            <div className={LAYOUT_CONFIGS.TOP_SECTIONS}>
              
              {/* Section 1: Oda Kurulumu (30%) */}
              <div className="space-y-6">
                <StudioSidebar
                  form={form}
                  newBlock={newBlock}
                  result={result}
                  isLoading={isLoading}
                  handleChange={handleChange}
                  handleExtraChange={handleExtraChange}
                  addBlock={addBlock}
                  removeBlock={removeBlock}
                  handleSubmit={handleSubmit}
                />
              </div>

              {/* Section 2: Tasarım Tercihleri (70%) */}
              <div className="space-y-6">
                <StudioDesignForm
                  form={form}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                  result={result}
                />
              </div>

            </div>

            {/* Alt Kısım: AI Önerileri (100% genişlik) */}
            <div id="ai-results-section" className={LAYOUT_CONFIGS.AI_RESULTS_FULL}>
              <StudioResultPanel
                result={result}
                moodBoard={moodBoard}
                progress={progress}
                isMoodBoardLoading={isMoodBoardLoading}
                isConnected={isConnected}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
});

RoomDesignStudio.displayName = 'RoomDesignStudio';

export default RoomDesignStudio;
