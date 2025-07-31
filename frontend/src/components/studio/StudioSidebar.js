import React from 'react';
import { RoomDimensionsSection, RoomInfoSection } from '../sections';

/**
 * StudioSidebar - Enhanced sidebar with integrated sections
 * Combines room setup and design preferences efficiently
 */
const StudioSidebar = ({ 
  form, 
  newBlock, 
  result, 
  isLoading,
  handleChange, 
  handleExtraChange, 
  addBlock, 
  removeBlock, 
  handleSubmit 
}) => {
  
  if (result) {
    // Ultra-compact layout when result exists
    return (
      <div className="space-y-4 animate-fadeIn">
        {/* Combined compact sections */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-2 mb-3">
            <div className="bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
              ⚙️
            </div>
            <h3 className="text-sm font-semibold text-blue-300">Oda Kurulumu</h3>
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
      </div>
    );
  }

  // Full integrated layout when no result - all in one sidebar
  return (
    <div className="space-y-6">
      {/* Room Setup Section */}
      <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
            1
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-300">Oda Kurulumu</h3>
            <p className="text-xs text-gray-400">Mekanınızın ölçülerini belirleyin</p>
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
  );
};

/**
 * CompactSection - Compact section wrapper for when result exists
 */
const CompactSection = ({ title, number, color, children }) => {
  const colorClasses = {
    blue: 'bg-blue-600 text-blue-300',
    green: 'bg-green-600 text-green-300',
    purple: 'bg-purple-600 text-purple-300'
  };

  return (
    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 transition-all duration-500">
      <div className="flex items-center space-x-2 mb-2">
        <div className={`${colorClasses[color].split(' ')[0]} w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold`}>
          {number}
        </div>
        <h3 className={`text-xs font-semibold ${colorClasses[color].split(' ')[1]}`}>
          {title}
        </h3>
      </div>
      <div className="scale-90 origin-top">
        {children}
      </div>
    </div>
  );
};

/**
 * ExpandedSection - Full section wrapper for when no result
 */
const ExpandedSection = ({ title, subtitle, number, color, children }) => {
  const colorClasses = {
    blue: 'bg-blue-600 text-blue-300',
    green: 'bg-green-600 text-green-300',
    purple: 'bg-purple-600 text-purple-300'
  };

  return (
    <div className="space-y-4 transition-all duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`${colorClasses[color].split(' ')[0]} w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold`}>
            {number}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${colorClasses[color].split(' ')[1]}`}>
              {title}
            </h3>
            <p className="text-xs text-gray-400">{subtitle}</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default StudioSidebar;
