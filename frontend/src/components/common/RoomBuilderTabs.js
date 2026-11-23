import React, { useState } from 'react';
import Button from '../common/Button';

const RoomBuilderTabs = ({ setRoomStructure, currentStructure }) => {
  const [activeTab, setActiveTab] = useState('standard');
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    setDimensions((prev) => ({ ...prev, [name]: numValue }));
  };

  const handleShapeSelect = (shape) => {
    setRoomStructure({ type: 'preset', shape, name: getShapeName(shape) });
  };

  const handleStandardRoom = () => {
    setRoomStructure({
      type: 'standard',
      dimensions,
      name: `${dimensions.width}x${dimensions.height} cm Rectangular Room`
    });
  };

  const handleCustomRoom = () => {
    setRoomStructure({
      type: 'custom',
      shape: 'rectangle-with-protrusion',
      dimensions,
      protrusions: [{ side: 'right', width: 50, depth: 100 }],
      name: 'Custom Room'
    });
  };

  const getShapeName = (shape) => {
    const names = {
      'L': 'L-Shaped Room',
      'T': 'T-Shaped Room',
      'U': 'U-Shaped Room',
      'rectangle': 'Rectangular Room'
    };
    return names[shape] || 'Custom Room';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      {/* Tab Buttons */}
      <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'standard' && (
        <StandardTab 
          dimensions={dimensions}
          onDimensionChange={handleDimensionChange}
          onCreateRoom={handleStandardRoom}
        />
      )}

      {activeTab === 'preset' && (
        <PresetTab onShapeSelect={handleShapeSelect} />
      )}

      {activeTab === 'custom' && (
        <CustomTab onCreateRoom={handleCustomRoom} />
      )}

      {/* Current Selection Display */}
      {currentStructure && (
        <CurrentSelection currentStructure={currentStructure} />
      )}
    </div>
  );
};

// Tab Buttons Component
const TabButtons = ({ activeTab, setActiveTab }) => {
  const TabButton = ({ tabKey, children, isActive, onClick }) => (
    <button
      onClick={() => onClick(tabKey)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-purple-600 text-white shadow-lg'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex space-x-2 mb-4">
      <TabButton tabKey="standard" isActive={activeTab === 'standard'} onClick={setActiveTab}>
        📐 Standard
      </TabButton>
      <TabButton tabKey="preset" isActive={activeTab === 'preset'} onClick={setActiveTab}>
        🏠 Preset Shapes
      </TabButton>
      <TabButton tabKey="custom" isActive={activeTab === 'custom'} onClick={setActiveTab}>
        ✏️ Custom Design
      </TabButton>
    </div>
  );
};

// Standard Tab Component
const StandardTab = ({ dimensions, onDimensionChange, onCreateRoom }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Width (cm)
        </label>
        <input
          type="number"
          name="width"
          value={dimensions.width}
          onChange={onDimensionChange}
          min="100"
          max="1000"
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Length (cm)
        </label>
        <input
          type="number"
          name="height"
          value={dimensions.height}
          onChange={onDimensionChange}
          min="100"
          max="1000"
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none text-white"
        />
      </div>
    </div>
    
    <div className="bg-gray-700 rounded-lg p-3 text-center">
      <div className="text-2xl mb-2">📏</div>
      <p className="text-sm text-gray-300">
        {dimensions.width} x {dimensions.height} cm
      </p>
      <p className="text-xs text-gray-400">
        Area: {(dimensions.width * dimensions.height / 10000).toFixed(1)} m²
      </p>
    </div>

    <Button onClick={onCreateRoom} size="small" className="w-full">
      Create Rectangular Room
    </Button>
  </div>
);

// Preset Tab Component
const PresetTab = ({ onShapeSelect }) => {
  const PresetCard = ({ shape, icon, name, description, onClick }) => (
    <div
      onClick={() => onClick(shape)}
      className="border border-gray-600 rounded-lg p-4 cursor-pointer hover:border-purple-500 hover:bg-purple-900/10 transition-all duration-200 text-center"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="text-sm font-semibold mb-1">{name}</h4>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <PresetCard
          shape="L"
          icon="📐"
          name="L-Shaped"
          description="Corner room layout"
          onClick={onShapeSelect}
        />
        <PresetCard
          shape="T"
          icon="✚"
          name="T-Shaped"
          description="Central passage area"
          onClick={onShapeSelect}
        />
        <PresetCard
          shape="U"
          icon="🔄"
          name="U-Shaped"
          description="Space open on three sides"
          onClick={onShapeSelect}
        />
        <PresetCard
          shape="rectangle"
          icon="⬜"
          name="Classic"
          description="Standard rectangle"
          onClick={onShapeSelect}
        />
      </div>
    </div>
  );
};

// Custom Tab Component
const CustomTab = ({ onCreateRoom }) => (
  <div className="space-y-4">
    <div className="text-center p-6 bg-gray-700 rounded-lg">
      <div className="text-4xl mb-3">🎨</div>
      <h4 className="text-lg font-semibold mb-2">Custom Room Design</h4>
      <p className="text-sm text-gray-400 mb-4">
        Create a room layout with protrusions and custom shapes
      </p>
      
      <div className="bg-gray-800 rounded p-3 mb-4">
        <p className="text-xs text-gray-300">
          🏗️ This option adds a 50x100 cm protrusion on the right side
        </p>
      </div>

      <Button onClick={onCreateRoom} size="small" className="w-full">
        Create Custom Room
      </Button>
    </div>
  </div>
);

// Current Selection Display Component
const CurrentSelection = ({ currentStructure }) => (
  <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500 rounded-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-purple-300">Selected Room Layout:</p>
        <p className="text-xs text-gray-300">{currentStructure.name}</p>
      </div>
      <div className="text-purple-400">✓</div>
    </div>
  </div>
);

export default RoomBuilderTabs;
