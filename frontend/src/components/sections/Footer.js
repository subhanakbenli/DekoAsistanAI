import React from 'react';

const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-gray-800 border-t border-gray-700">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Deko Asistan
          </h3>
          <p className="text-gray-400 mt-2">
            BTK Akademi Hackathon 2025 • Google Gemini Destekli
          </p>
        </div>
        
        <div className="flex justify-center space-x-8 text-sm text-gray-400">
          <span>🏆 E-ticaret Kategorisi</span>
          <span>🤖 AI/ML Teknolojisi</span>
          <span>⚡ KISS Prensibi</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
