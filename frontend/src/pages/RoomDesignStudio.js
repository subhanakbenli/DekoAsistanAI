import React, { memo, useMemo } from 'react';
import { useRoomDesign } from '../hooks/useRoomDesign';
import { StudioHeader, StudioSidebar, StudioDesignForm, StudioResultPanel } from '../components/studio';
import Navbar from '../components/Navbar';
import { usePerformanceTracker } from '../hooks/usePerformance';

/**
 * Room Design Studio - Professional Interior Design Tool
 * AI-powered room design and visualization platform
 * 
 * Refactored for better component composition and separation of concerns
 * Optimized with React.memo and performance tracking
 */
const RoomDesignStudio = memo(() => {
  // Performance tracking in development
  usePerformanceTracker('RoomDesignStudio');

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
  } = useRoomDesign();

  // Memoize grid classes for better performance
  const gridClasses = useMemo(() => 
    "grid gap-8 transition-all duration-700 ease-in-out grid-cols-1 lg:grid-cols-3", 
    []
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Navbar />
      <div className="pt-16">
        {/* Main Workspace */}
        <div className="max-w-7xl mx-auto p-8">
          
          {/* Studio Header */}
          <StudioHeader />

          {/* Design Grid - Dynamic layout based on result */}
          <div className={gridClasses}>
            
            {/* LEFT SIDE - Form Sections */}
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

            {/* MIDDLE SECTION - Design Form (only when no result) */}
            <StudioDesignForm
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              result={result}
            />

            {/* RIGHT SIDE - Result Panel */}
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
