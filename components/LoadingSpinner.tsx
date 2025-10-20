
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-12">
      <div className="w-16 h-16 border-4 border-t-purple-500 border-gray-700 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-400">AI is analyzing the video...</p>
    </div>
  );
};

export default LoadingSpinner;
