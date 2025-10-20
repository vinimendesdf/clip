
import React from 'react';
import { VideoClapperIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-800">
      <div className="container mx-auto px-4 py-3 max-w-4xl">
        <div className="flex items-center gap-3">
            <VideoClapperIcon className="w-8 h-8 text-purple-400"/>
          <h1 className="text-xl font-bold text-white">
            AI Viral Clip Finder
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
