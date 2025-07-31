import React, { memo, useMemo } from 'react';
import { useRoomDesign } from '../hooks/useRoomDesign';
import { StudioHeader, StudioSidebar, StudioDesignForm, StudioResultPanel } from '../components/studio';
import Navbar from '../components/Navbar';
import { usePerformanceTracker } from '../hooks/usePerformance';

// Layout configuration constants - KISS principle ✨
const LAYOUT_CONFIGS = {
  WITH_RESULT: "grid gap-6 transition-all duration-700 ease-in-out grid-cols-1 lg:grid-cols-[350px_1fr]",
  NO_RESULT: "grid gap-8 transition-all duration-700 ease-in-out grid-cols-1 lg:grid-cols-[45%_55%]"
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
  const layoutClasses = useMemo(() => 
    result ? LAYOUT_CONFIGS.WITH_RESULT : LAYOUT_CONFIGS.NO_RESULT, 
    [result]
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto p-6">
          
          <StudioHeader />

          <div className={layoutClasses}>
            
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

              {!result && (
                <StudioDesignForm
                  form={form}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                  result={result}
                />
              )}
            </div>

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
  );
});

RoomDesignStudio.displayName = 'RoomDesignStudio';

export default RoomDesignStudio;
