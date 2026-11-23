import React, { memo, useCallback } from 'react';
import { useRoomDesign } from '../hooks/useRoomDesign';
import { StudioHeader, StudioSidebar, StudioDesignForm, StudioResultPanel } from '../components/studio';
import Navbar from '../components/Navbar';
import { usePerformanceTracker } from '../hooks/usePerformance';

// Layout configuration constants - KISS principle ✨
const LAYOUT_CONFIGS = {
  // New 3-section layout: Section 1 (30%) + Section 2 (70%) + AI Suggestions (100%)
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
    result,
    isLoading,
    moodBoard,
    progress,
    isMoodBoardLoading,
    isConnected,
    handleChange,
    handleSubmit
  } = roomDesignState;

  // Simplified layout logic - KISS principle ✨
  const scrollToResults = useCallback(() => {
    if (result) {
      // Scroll to the AI suggestions section
      const resultsSection = document.getElementById('ai-results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [result]);

  // Scroll when the result changes
  React.useEffect(() => {
    if (result) {
      setTimeout(scrollToResults, 300); // Short delay for the animation
    }
  }, [result, scrollToResults]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-1.5 py-3">
          
          <StudioHeader />

          {/* New layout: Section 1 (40%) + Section 2 (60%) */}
          <div className={LAYOUT_CONFIGS.MAIN_LAYOUT}>
            
            {/* Top: Room Setup (30%) + Design Preferences (70%) */}
            <div className={LAYOUT_CONFIGS.TOP_SECTIONS}>
              
              {/* Section 1: Room Setup (30%) */}
              <div className="space-y-6">
                <StudioSidebar
                  form={form}
                  result={result}
                  isLoading={isLoading}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                />
              </div>

              {/* Section 2: Design Preferences (70%) */}
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

            {/* Bottom: AI Suggestions (100% width) */}
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
