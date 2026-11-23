import React, { useState } from 'react';
import ProductSuggestionSection from './ProductSuggestionSection';
import FavoriteButton from '../FavoriteButton';
import HashtagDisplay from '../HashtagDisplay';
import ShareToBlog from '../common/ShareToBlog';

/**
 * Enhanced Design Result Section with modern UI
 * Features: Modern cards, gradients, animations, better typography
 */
const DesignResultSection = ({ result, moodBoard, progress, isMoodBoardLoading }) => {
  const [showMoodBoard, setShowMoodBoard] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // Overview tab open by default

  // Mapping for progress messages
  const progressMessages = {
    'preparing_prompt': "Preparing Deko's vision concept...",
    'optimizing_prompt': 'Optimizing the design prompt...',
    'generating_image': 'AI is generating the image...',
    'processing_image': 'Processing the image...',
    'finalizing': 'Applying final touches...',
    'completed': "Deko's vision is ready!"
  };


  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🎨' },
    { id: 'moodboard', label: "Deko's Vision", icon: '🖼️' },
    { id: 'userinput', label: 'User Inputs', icon: '📝' },
    { id: 'products', label: 'Products', icon: '🛍️' }
  ];

  return (
    <div className="space-y-6">
      {result ? (
        <div className="space-y-6">
          
          {/* Tab Navigation */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-2">
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {/* Show a green dot when the mood board is ready */}
                  {tab.id === 'moodboard' && moodBoard?.image_data && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="space-y-3 animate-fadeIn">
                
                {/* Main Content Grid - Mood Board Left, Content Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  
                  {/* Left: Mood Board */}
                  <div className="order-2 lg:order-1">
                    <MoodBoardSection 
                      moodBoard={moodBoard} 
                      progress={progress} 
                      isMoodBoardLoading={isMoodBoardLoading}
                      showMoodBoard={showMoodBoard}
                      setShowMoodBoard={setShowMoodBoard}
                      progressMessages={progressMessages}
                      compact={true}
                    />
                  </div>

                  {/* Right: Design Content */}
                  <div className="order-1 lg:order-2 space-y-3">
                    
                    {/* Design Title Card */}
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
                              <span className="text-lg">🏠</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">{result.design_title}</h3>
                          </div>
                          <p className="text-gray-300 leading-relaxed">{result.design_description}</p>
                        </div>
                        {result.design_id && (
                          <div className="ml-4">
                            <FavoriteButton 
                              designId={result.design_id}
                              variant="icon"
                              size="lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Room Info Cards Grid */}
                    <div className="grid grid-cols-1 gap-2">
                      <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 backdrop-blur-sm rounded-xl p-2 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
                        <div className="flex items-center space-x-3">
                          <div className="bg-purple-500/20 p-2 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                            <span className="text-lg">🏛️</span>
                          </div>
                          <div>
                            <p className="text-purple-300 text-sm font-medium">Room Type</p>
                            <p className="text-white font-semibold">{result.room_type}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-pink-900/40 to-pink-800/40 backdrop-blur-sm rounded-xl p-2 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 group">
                        <div className="flex items-center space-x-3">
                          <div className="bg-pink-500/20 p-2 rounded-lg group-hover:bg-pink-500/30 transition-colors">
                            <span className="text-lg">🎭</span>
                          </div>
                          <div>
                            <p className="text-pink-300 text-sm font-medium">Design Style</p>
                            <p className="text-white font-semibold">{result.design_style}</p>
                          </div>
                        </div>
                      </div>

                      {(result.width || result.length || result.height) && (
                        <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/40 backdrop-blur-sm rounded-xl p-2 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group">
                          <div className="flex items-center space-x-3">
                            <div className="bg-cyan-500/20 p-2 rounded-lg group-hover:bg-cyan-500/30 transition-colors">
                              <span className="text-lg">📐</span>
                            </div>
                            <div>
                              <p className="text-cyan-300 text-sm font-medium">Dimensions</p>
                              <p className="text-white font-semibold">
                                {result.width != null && result.width !== '' && result.length != null && result.length !== '' && result.height != null && result.height !== ''
                                  ? `${result.width}×${result.length}×${result.height} cm`
                                  : [result.width, result.length, result.height].filter(val => val != null && val !== '').map(val => `${val} cm`).join(' × ')
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Hashtags Card */}
                    {result.hashtags && (
                      <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/40 backdrop-blur-sm rounded-xl p-2 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="bg-indigo-500/20 p-2 rounded-lg">
                            <span className="text-lg">#️⃣</span>
                          </div>
                          <h5 className="text-indigo-300 text-sm font-medium">Popular Tags</h5>
                        </div>
                        <HashtagDisplay 
                          hashtags={result.hashtags} 
                          previewLimit={6}
                          showAll={false}
                          copyEnabled={true}
                        />
                      </div>
                    )}

                    {/* Blog sharing */}
                    {result.design_id && (
                      <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-sm rounded-xl p-2 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
                        <ShareToBlog
                          designData={{
                            designId: result.design_id,
                            roomType: result.room_type,
                            designStyle: result.design_style,
                            width: result.width,
                            length: result.length,
                            height: result.height,
                            notes: result.notes,
                            designTitle: result.design_title,
                            designDescription: result.design_description,
                            hashtags: result.hashtags,
                            imageUrl: moodBoard ? (
                              moodBoard.image_data?.base64 
                                ? `data:image/png;base64,${moodBoard.image_data.base64}`
                                : moodBoard.image_data?.file_path 
                                  ? `http://localhost:8000/static/mood_boards/${moodBoard.image_data.file_path.split('\\').pop().split('/').pop()}`
                                  : null
                            ) : null
                          }}
                          designId={result.design_id}
                          variant="card"
                          onPublishSuccess={(publishedPost) => {
                            console.log('Design published to blog:', publishedPost);
                          }}
                          onPublishError={(error) => {
                            console.error('Failed to publish to blog:', error);
                          }}
                        />
                      </div>
                    )}
                  </div>

                </div>
                </div>
              </div>
            )}

            {/* Mood Board Tab */}
            {activeTab === 'moodboard' && (
              <div className="animate-fadeIn">
                <MoodBoardSection 
                  moodBoard={moodBoard} 
                  progress={progress} 
                  isMoodBoardLoading={isMoodBoardLoading}
                  showMoodBoard={showMoodBoard}
                  setShowMoodBoard={setShowMoodBoard}
                  progressMessages={progressMessages}
                />
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="animate-fadeIn">
                <ProductSuggestionSection result={result} />
              </div>
            )}

            {/* User Input Tab */}
            {activeTab === 'userinput' && (
              <div className="animate-fadeIn">
                <UserInputSection result={result} />
              </div>
            )}

          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">🎨</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Design Created Yet</h3>
              <p className="text-gray-500 text-sm">
                Fill in the form on the left to get your<br />
                AI-powered design suggestions
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600 text-xs">
              <span>👈</span>
              <span>Fill in the forms and see your suggestions</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Modern Mood Board Section Component
 */
const MoodBoardSection = ({ 
  moodBoard, 
  progress, 
  isMoodBoardLoading, 
  showMoodBoard, 
  setShowMoodBoard, 
  progressMessages,
  compact = false
}) => {
  return (
    <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-2 rounded-lg">
            <span className="text-lg">🎨</span>
          </div>
          <h4 className="text-lg font-semibold text-pink-300">Deko's Vision</h4>
        </div>
        
        {moodBoard && (
          <button 
            onClick={() => setShowMoodBoard(!showMoodBoard)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              showMoodBoard 
                ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-lg' 
                : 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30'
            }`}
          >
            {showMoodBoard ? 'Hide' : 'Show'}
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {(isMoodBoardLoading || progress) && !moodBoard && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-pink-300 text-sm font-medium">
              {progress ? progressMessages[progress.stage] || progress.message : "Preparing Deko's vision..."}
            </span>
            <span className="text-pink-300 text-sm font-bold">
              {progress ? `${progress.progress_percentage}%` : '0%'}
            </span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out bg-size-200 animate-gradient-x"
                style={{ width: `${progress ? progress.progress_percentage : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-pink-950/30 rounded-lg p-4 border border-pink-500/10">
            <p className="text-pink-200 text-sm italic text-center">
              ✨ AI is generating a realistic room image for your design...
            </p>
          </div>
        </div>
      )}

      {/* Mood Board Image */}
      {moodBoard && showMoodBoard && (
        <div className="space-y-6 animate-fadeIn">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl filter blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
            {(() => {
              // Multi-source support: handle different data structures
              let imageSrc = null;
              
              // 1. Nested image_data structure
              if (moodBoard.image_data?.base64) {
                imageSrc = `data:image/png;base64,${moodBoard.image_data.base64}`;
              } else if (moodBoard.image_data?.file_path) {
                const fileName = moodBoard.image_data.file_path.split('\\').pop().split('/').pop();
                imageSrc = `http://localhost:8000/static/mood_boards/${fileName}`;
              }
              // 2. Direct properties
              else if (moodBoard.base64) {
                imageSrc = `data:image/png;base64,${moodBoard.base64}`;
              } else if (moodBoard.file_path) {
                const fileName = moodBoard.file_path.split('\\').pop().split('/').pop();
                imageSrc = `http://localhost:8000/static/mood_boards/${fileName}`;
              }
              // 3. Direct image_data string
              else if (typeof moodBoard.image_data === 'string') {
                if (moodBoard.image_data.startsWith('data:')) {
                  imageSrc = moodBoard.image_data;
                } else {
                  const fileName = moodBoard.image_data.split('\\').pop().split('/').pop();
                  imageSrc = `http://localhost:8000/static/mood_boards/${fileName}`;
                }
              }
              // 4. Image URL
              else if (moodBoard.image_url) {
                imageSrc = moodBoard.image_url;
              }
              
              // If imageSrc is still undefined, check alternative sources
              if (!imageSrc) {
                // Fallback sources
                if (moodBoard.base64) {
                  imageSrc = `data:image/png;base64,${moodBoard.base64}`;
                } else if (moodBoard.file_path) {
                  const fileName = moodBoard.file_path.split('\\').pop().split('/').pop();
                  imageSrc = `http://localhost:8000/static/mood_boards/${fileName}`;
                }
              }
              
              return (
                <img 
                  src={imageSrc}
                  alt="Room visualization"
                  className="relative w-full rounded-xl shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              );
            })()}
            <div className="hidden bg-red-900/80 backdrop-blur-sm border border-red-500/30 p-6 rounded-xl text-center">
              <span className="text-red-200">❌ Deko's vision could not be loaded</span>
            </div>
          </div>
          
          {/* Mood Board Info Grid - Only show if not compact */}
          {!compact && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-pink-950/30 backdrop-blur-sm rounded-lg p-4 border border-pink-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-pink-400">📅</span>
                    <span className="text-pink-300 text-sm font-medium">Created</span>
                  </div>
                  <p className="text-white font-semibold">
                    {(() => {
                      // Debug log moodBoard structure
                      console.log('MoodBoard data structure:', moodBoard);
                      console.log('moodBoard.created_at:', moodBoard.created_at);
                      console.log('moodBoard.image_data:', moodBoard.image_data);
                      console.log('moodBoard.generation_metadata:', moodBoard.generation_metadata);
                      
                      try {
                        // Try multiple potential date sources
                        let dateValue = moodBoard.created_at || 
                                       moodBoard.image_data?.created_at || 
                                       moodBoard.generation_metadata?.generated_at;
                        
                        console.log('Using date value:', dateValue);
                        
                        if (!dateValue) {
                          return 'No date available';
                        }
                        
                        const date = new Date(dateValue);
                        // Check whether the date is valid
                        if (isNaN(date.getTime())) {
                          console.error('Invalid date:', dateValue);
                          return 'Invalid date format';
                        }
                        return date.toLocaleString('en-US');
                      } catch (error) {
                        console.error('Date parsing error:', error);
                        return 'Error while processing the date';
                      }
                    })()}
                  </p>
                </div>
                
                <div className="bg-purple-950/30 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-purple-400">🖼️</span>
                    <span className="text-purple-300 text-sm font-medium">Format</span>
                  </div>
                  <p className="text-white font-semibold">{moodBoard.image_data?.format || 'PNG'}</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error State */}
      {progress && (progress.type === 'room_visualization_error' || progress.type === 'mood_board_error') && (
        <div className="bg-red-900/40 backdrop-blur-sm border border-red-500/30 p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <span className="text-lg">❌</span>
            </div>
            <span className="text-lg font-semibold text-red-200">Deko's Vision Error</span>
          </div>
          <p className="text-red-100 mb-4">
            {progress.error || "An error occurred while generating Deko's vision."}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
          >
            🔄 Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!moodBoard && !isMoodBoardLoading && !progress && (
        <div className="text-center py-12">
          <div className="bg-pink-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎨</span>
          </div>
          <h5 className="text-pink-300 font-semibold mb-2">Waiting for Deko's Vision</h5>
          <p className="text-gray-400 text-sm">
            Once a design request is submitted,<br />
            Deko's vision will be generated automatically
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * User Input Section - shows the information the user entered
 */
const UserInputSection = ({ result }) => {
  // Use proper null/undefined checks instead of falsy checks to handle 0 values correctly
  const hasUserInput = result.notes || 
                      (result.width != null && result.width !== '') || 
                      (result.length != null && result.length !== '') || 
                      (result.height != null && result.height !== '') || 
                      result.colorPalette || 
                      result.price;

  if (!hasUserInput) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">📝</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No User Input</h3>
            <p className="text-gray-500 text-sm">
              The user did not provide any custom notes<br />
              or dimensions for this design
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-yellow-500 to-amber-500 p-3 rounded-lg">
            <span className="text-xl">📝</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">User Inputs</h3>
            <p className="text-gray-400 text-sm">Custom details provided when the design was created</p>
          </div>
        </div>

        {/* Color palette */}
        {result.colorPalette && (
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
            <div className="flex items-start space-x-3">
              <div className="bg-purple-500/20 p-2 rounded-lg flex-shrink-0 mt-1">
                <span className="text-lg">🎨</span>
              </div>
              <div className="flex-1">
                <h4 className="text-purple-300 font-semibold mb-3">Selected Color Palette</h4>
                
                {/* Check if colorPalette is an object with palette information */}
                {(() => {
                  // If result.colorPalette is an object (from form submission)
                  if (typeof result.colorPalette === 'object' && result.colorPalette !== null) {
                    
                    // Handle palette type selection
                    if (result.colorPalette.type === 'palette' && result.colorPalette.palette) {
                      const palette = result.colorPalette.palette;
                      return (
                        <div className="space-y-3">
                          {/* Palette Name and Description */}
                          <div className="bg-purple-950/30 rounded-lg p-3 border border-purple-500/20">
                            <div className="flex items-center space-x-2 mb-2">
                              <h5 className="text-white font-semibold">{palette.name}</h5>
                              {palette.isPopular && (
                                <span className="text-yellow-400 text-xs">⭐</span>
                              )}
                            </div>
                            <p className="text-purple-200 text-sm">{palette.description}</p>
                          </div>
                          
                          {/* Color Gradient Preview */}
                          <div className={`rounded-lg shadow-inner h-12 ${palette.gradient || 'bg-gradient-to-r from-purple-500 to-pink-500'}`}></div>
                          
                          {/* Color Circles */}
                          {palette.colors && palette.colors.length > 0 && (
                            <div className="flex gap-2 justify-center">
                              {palette.colors.map((color, index) => (
                                <div
                                  key={index}
                                  className="w-8 h-8 rounded-full border-2 border-purple-400/50 shadow-lg"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    // Handle custom description type
                    if (result.colorPalette.type === 'custom') {
                      return (
                        <div className="bg-purple-950/30 rounded-lg p-4 border border-purple-500/20">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-purple-300 text-sm font-medium">Custom Color Description</span>
                          </div>
                          <p className="text-white leading-relaxed">
                            {result.colorPalette.description || 'Custom color preference specified'}
                          </p>
                        </div>
                      );
                    }
                  }
                  
                  // Parse JSON string if it's from backend (design detail page)
                  if (typeof result.colorPalette === 'string') {
                    try {
                      const colorData = JSON.parse(result.colorPalette);
                      
                      if (colorData.colorName && colorData.colorPalette) {
                        return (
                          <div className="space-y-3">
                            {/* Palette Name and Description */}
                            <div className="bg-purple-950/30 rounded-lg p-3 border border-purple-500/20">
                              <div className="flex items-center space-x-2 mb-2">
                                <h5 className="text-white font-semibold">{colorData.colorName}</h5>
                              </div>
                              <p className="text-purple-200 text-sm">Selected color palette</p>
                            </div>
                            
                            {/* Color Gradient Preview - Create gradient from colors */}
                            {colorData.colorPalette && colorData.colorPalette.length > 0 && (
                              <div 
                                className="rounded-lg shadow-inner h-12 bg-gradient-to-r"
                                style={{
                                  background: `linear-gradient(to right, ${colorData.colorPalette.join(', ')})`
                                }}
                              ></div>
                            )}
                            
                            {/* Color Circles */}
                            {colorData.colorPalette && colorData.colorPalette.length > 0 && (
                              <div className="flex gap-2 justify-center">
                                {colorData.colorPalette.map((color, index) => (
                                  <div
                                    key={index}
                                    className="w-8 h-8 rounded-full border-2 border-purple-400/50 shadow-lg"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }
                    } catch (e) {
                      // If JSON parsing fails, show as text
                      console.log('Failed to parse color palette JSON:', e);
                    }
                  }
                  
                  // Fallback: If it's a string that couldn't be parsed
                  return (
                    <div className="bg-purple-950/30 rounded-lg p-4 border border-purple-500/20">
                      <p className="text-white leading-relaxed">{result.colorPalette}</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Budget info */}
        {result.price && (
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-sm rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
            <div className="flex items-start space-x-3">
              <div className="bg-green-500/20 p-2 rounded-lg flex-shrink-0 mt-1">
                <span className="text-lg">💰</span>
              </div>
              <div className="flex-1">
                <h4 className="text-green-300 font-semibold mb-3">Budget Limit</h4>
                <div className="bg-green-950/30 rounded-lg p-4 border border-green-500/20">
                  <div className="text-2xl font-bold text-white">{result.price} ₺</div>
                  <div className="text-green-300 text-sm mt-1">Maximum design budget</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User notes */}
        {result.notes && (
          <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-500/20 p-2 rounded-lg flex-shrink-0 mt-1">
                <span className="text-lg">💭</span>
              </div>
              <div className="flex-1">
                <h4 className="text-yellow-300 font-semibold mb-3">Special Notes & Requests</h4>
                <div className="bg-yellow-950/30 rounded-lg p-4 border border-yellow-500/20">
                  <p className="text-white leading-relaxed">{result.notes}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Room dimensions */}
        {((result.width != null && result.width !== '') || 
          (result.length != null && result.length !== '') || 
          (result.height != null && result.height !== '')) && (
          <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-cyan-500/20 p-2 rounded-lg">
                <span className="text-lg">📐</span>
              </div>
              <h4 className="text-cyan-300 font-semibold">Specified Room Dimensions</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(result.width != null && result.width !== '') && (
                <div className="bg-cyan-950/30 rounded-lg p-4 text-center border border-cyan-500/20">
                  <div className="text-cyan-400 text-sm font-medium mb-1">Width</div>
                  <div className="text-2xl font-bold text-white">{result.width}</div>
                  <div className="text-cyan-300 text-sm">cm</div>
                </div>
              )}
              {(result.length != null && result.length !== '') && (
                <div className="bg-cyan-950/30 rounded-lg p-4 text-center border border-cyan-500/20">
                  <div className="text-cyan-400 text-sm font-medium mb-1">Length</div>
                  <div className="text-2xl font-bold text-white">{result.length}</div>
                  <div className="text-cyan-300 text-sm">cm</div>
                </div>
              )}
              {(result.height != null && result.height !== '') && (
                <div className="bg-cyan-950/30 rounded-lg p-4 text-center border border-cyan-500/20">
                  <div className="text-cyan-400 text-sm font-medium mb-1">Height</div>
                  <div className="text-2xl font-bold text-white">{result.height}</div>
                  <div className="text-cyan-300 text-sm">cm</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional info */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/20">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <h4 className="text-indigo-300 font-semibold mb-2">Design Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-indigo-400">Room Type:</span>
                  <span className="text-white ml-2 font-medium">{result.room_type}</span>
                </div>
                <div>
                  <span className="text-indigo-400">Design Style:</span>
                  <span className="text-white ml-2 font-medium">{result.design_style}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignResultSection;
