import React from 'react';
import PropTypes from 'prop-types';
import { RoomDimensionsSection } from '../sections';

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

StudioSidebar.propTypes = {
  form: PropTypes.object.isRequired,
  newBlock: PropTypes.object.isRequired,
  result: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleExtraChange: PropTypes.func.isRequired,
  addBlock: PropTypes.func.isRequired,
  removeBlock: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default StudioSidebar;
