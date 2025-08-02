import React from 'react';
import PropTypes from 'prop-types';
import { RoomDimensionsSection } from '../sections';

/**
 * StudioSidebar - Enhanced sidebar with integrated sections
 * Simplified to show only room dimensions without extras
 */
const StudioSidebar = ({ 
  form, 
  result, 
  isLoading,
  handleChange, 
  handleSubmit 
}) => {
  
  // Always show compact layout in new design - Section 1 (40% width)
  return (
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
      />
    </div>
  );
};

StudioSidebar.propTypes = {
  form: PropTypes.object.isRequired,
  result: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default StudioSidebar;
