import React, { useState, useRef, useEffect } from 'react';
import { Clip, Caption } from '../types';
import { DownloadIcon, PlayIcon, StarIcon, PauseIcon } from './Icons';

interface ClipCardProps {
  clip: Clip;
}

// Helper to convert MM:SS to seconds
const parseTimeToSeconds = (time: string): number => {
    const parts = time.split(':').map(Number);
    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    return 0;
};

const ViralityScore: React.FC<{ score: number }> = ({ score }) => {
    const color = score > 8 ? 'text-green-400' : score > 6 ? 'text-yellow-400' : 'text-red-400';
    const bgColor = score > 8 ? 'bg-green-900/50' : score > 6 ? 'bg-yellow-900/50' : 'bg-red-900/50';
    
    return (
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${bgColor}`}>
            <StarIcon className={`w-4 h-4 ${color}`} />
            <span className={color}>{score.toFixed(1)}</span>
            <span className="text-gray-400">Virality Score</span>
        </div>
    );
};

const ClipCard: React.FC<ClipCardProps> = ({ clip }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCaption, setActiveCaption] = useState<Caption | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const clipStartSeconds = parseTimeToSeconds(clip.startTime);
  const clipEndSeconds = parseTimeToSeconds(clip.endTime);
  const duration = clipEndSeconds - clipStartSeconds;

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const currentCaption = clip.captions.find(
        (c) => currentTime >= c.startTime && currentTime <= c.endTime
      ) || null;
      setActiveCaption(currentCaption);
    }
  };
  
  const handleVideoEnd = () => {
    setIsPlaying(false);
    if(videoRef.current) {
        videoRef.current.currentTime = 0;
    }
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:border-purple-500 hover:shadow-purple-500/10">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Details */}
        <div className="p-6 flex flex-col justify-between order-2 md:order-1">
          <div>
            <div className="flex justify-between items-start mb-4">
                <div className="text-sm font-mono text-gray-400">
                    <p>{clip.startTime} - {clip.endTime}</p>
                    <p className="text-xs text-gray-500">Duration: {duration.toFixed(1)}s</p>
                </div>
                <ViralityScore score={clip.viralityScore} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">{clip.title}</h3>
            <p className="text-gray-300 mb-6">{clip.summary}</p>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-900 transition-colors duration-200">
            <DownloadIcon className="w-5 h-5"/>
            Download Clip
          </button>
        </div>

        {/* Right Side: Video and Dynamic Captions */}
        <div className="flex flex-col bg-gray-900 p-4 order-1 md:order-2">
            <div 
                className="relative aspect-[9/16] w-full max-w-xs mx-auto bg-black rounded-lg overflow-hidden ring-2 ring-gray-700 cursor-pointer group"
                onClick={handleTogglePlay}
            >
                <video
                    ref={videoRef}
                    src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnd}
                />
                
                {/* Play/Pause overlay */}
                <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${isPlaying && 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                        {isPlaying ? <PauseIcon className="w-8 h-8 text-white"/> : <PlayIcon className="w-8 h-8 text-white"/>}
                    </div>
                </div>

                {/* Dynamic Caption Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center items-end" style={{ height: '30%'}}>
                    {activeCaption && (
                         <p 
                            key={activeCaption.startTime}
                            className="text-white text-2xl font-bold text-center animate-fade-in"
                            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}
                        >
                            {activeCaption.text}
                        </p>
                    )}
                </div>
            </div>
        </div>
      </div>
      <style>{`
        .animate-fade-in {
            animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        `}</style>
    </div>
  );
};

export default ClipCard;
