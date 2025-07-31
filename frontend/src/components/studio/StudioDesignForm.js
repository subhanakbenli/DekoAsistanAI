import React from 'react';
import { RoomInfoSection } from '../sections';

/**
 * StudioDesignForm - Enhanced design preferences with product recommendations on top
 * Always visible in new layout - shows as Section 2 (60% width)
 */
const StudioDesignForm = ({ 
  form, 
  handleChange, 
  handleSubmit, 
  isLoading,
  result 
}) => {
  
  return (
    <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
      {/* Section Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
          2
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-300">
            Tasarım Tercihleri
          </h3>
          <p className="text-xs text-gray-400">
            Stilinizi ve tercihlerinizi seçin
          </p>
        </div>
      </div>
      
      {/* Main Design Form */}
      <RoomInfoSection
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StudioDesignForm;
