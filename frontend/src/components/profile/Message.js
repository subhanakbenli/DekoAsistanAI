import React from 'react';

/**
 * Message - Success/Error message display component
 * Shows feedback messages with appropriate styling
 * 
 * @param {Object} message - Message object with type and text properties
 * @param {string} message.type - Message type ('success' or 'error')
 * @param {string} message.text - Message text content
 */
const Message = ({ message }) => {
  if (!message.text) return null;
  
  return (
    <div className={`mb-6 p-4 rounded-xl border ${
      message.type === 'success' 
        ? 'bg-green-900/50 border-green-700 text-green-300' 
        : 'bg-red-900/50 border-red-700 text-red-300'
    }`}>
      <div className="flex items-center space-x-2">
        <span>{message.type === 'success' ? '✅' : '❌'}</span>
        <span>{message.text}</span>
      </div>
    </div>
  );
};

export default Message;
