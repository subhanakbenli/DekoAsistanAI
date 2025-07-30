import React from 'react';
import { RoomInfoSection } from '../sections';

/**
 * StudioDesignForm - Design preferences form section
 * Handles style selection and submission when no result exists
 */
const StudioDesignForm = ({ 
  form, 
  handleChange, 
  handleSubmit, 
  isLoading,
  result 
}) => {
  
  // Don't show if result exists (handled by sidebar)
  if (result) return null;

  return (
    <div className="space-y-4 transition-all duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
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
  );
};

export default StudioDesignForm;
