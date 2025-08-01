import React from 'react';
import Navbar from '../../../components/Navbar';

/**
 * Blog Page Layout Component
 * Provides consistent layout structure for blog page
 */
const BlogPageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
};

export default BlogPageLayout;
