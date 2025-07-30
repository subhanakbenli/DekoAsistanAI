import React from 'react';

/**
 * ProfileAvatar - User avatar display component
 * Shows user's initial or default avatar with name and email
 * 
 * @param {Object} user - User object containing profile information
 * @param {string} user.first_name - User's first name
 * @param {string} user.last_name - User's last name  
 * @param {string} user.email - User's email address
 */
const ProfileAvatar = ({ user }) => (
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4">
      <span className="text-4xl">
        {user.first_name ? user.first_name.charAt(0).toUpperCase() : '👤'}
      </span>
    </div>
    
    <h2 className="text-xl font-bold text-white mb-2">
      {user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}`
        : 'İsimsiz Kullanıcı'
      }
    </h2>
    
    <p className="text-gray-400 mb-4">{user.email}</p>
  </div>
);

export default ProfileAvatar;
