
import React, { useState } from 'react';
import { Clip } from './types';
import { generateClipsFromUrl } from './services/geminiService';
import Header from './components/Header';
import UrlInputForm from './components/UrlInputForm';
import LoadingSpinner from './components/LoadingSpinner';
import ClipCard from './components/ClipCard';
import { SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [clips, setClips] = useState<Clip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClips = async (url: string) => {
    if (!url) {
      setError('Please enter a YouTube URL.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setClips([]);
    try {
      const generatedClips = await generateClipsFromUrl(url);
      setClips(generatedClips);
    } catch (err) {
      setError('Failed to generate clips. Please check the URL or try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Find Viral Clips in Seconds
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Paste a YouTube link and our AI will identify potential viral moments, complete with catchy titles and captions.
          </p>
        </div>

        <UrlInputForm
          url={youtubeUrl}
          setUrl={setYoutubeUrl}
          onSubmit={handleGenerateClips}
          isLoading={isLoading}
        />

        {error && (
          <div className="mt-6 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
            <p>{error}</p>
          </div>
        )}

        {isLoading && <LoadingSpinner />}

        {!isLoading && clips.length === 0 && !error && (
          <div className="mt-12 text-center text-gray-500">
             <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                <SparklesIcon className="w-12 h-12 mb-4 text-purple-400" />
                <h3 className="text-xl font-semibold text-gray-300">Your AI-generated clips will appear here</h3>
                <p>Ready to discover the best moments from your videos?</p>
             </div>
          </div>
        )}

        {clips.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Generated Clips</h2>
            <div className="grid grid-cols-1 gap-8">
              {clips.map((clip, index) => (
                <ClipCard key={index} clip={clip} />
              ))}
            </div>
          </div>
        )}
      </main>
      <footer className="text-center py-6 text-gray-600">
        <p>Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
