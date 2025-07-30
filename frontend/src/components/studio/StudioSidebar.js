import React from 'react';
import { RoomDimensionsSection, RoomInfoSection } from '../sections';

/**
 * StudioSidebar - Sidebar component containing form sections
 * Handles different layouts based on whether result exists
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
    // Compact layout when result exists
    return (
      <div className="transition-all duration-700 ease-in-out lg:col-span-1">
        <div className="space-y-4 animate-fadeIn">
          {/* Section 1 - Ultra Compact */}
          <CompactSection
            title="Oda Kurulumu"
            number={1}
            color="blue"
          >
            <RoomDimensionsSection
              form={form}
              handleChange={handleChange}
              newBlock={newBlock}
              handleExtraChange={handleExtraChange}
              addBlock={addBlock}
              removeBlock={removeBlock}
            />
          </CompactSection>

          {/* Section 2 - Ultra Compact */}
          <CompactSection
            title="Tasarım Tercihleri"
            number={2}
            color="green"
          >
            <RoomInfoSection
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </CompactSection>
        </div>
      </div>
    );
  }

  // Full layout when no result
  return (
    <div className="space-y-4">
      {/* SECTION 1 - Room Dimensions & Visualization */}
      <ExpandedSection
        title="Oda Kurulumu"
        subtitle="Mekanınızın ölçülerini belirleyin"
        number={1}
        color="blue"
      >
        <RoomDimensionsSection
          form={form}
          handleChange={handleChange}
          newBlock={newBlock}
          handleExtraChange={handleExtraChange}
          addBlock={addBlock}
          removeBlock={removeBlock}
        />
      </ExpandedSection>
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
