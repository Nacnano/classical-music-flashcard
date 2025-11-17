'use client';

import React, { useState, useEffect, useRef } from 'react';

interface YouTubePlayerProps {
  youtubeId: string;
  className?: string;
  youtubeStartTime?: number;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  youtubeId,
  className,
  youtubeStartTime,
}) => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setIsVideoVisible(false);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Reduced from 2000ms to 500ms

    return () => clearTimeout(timer);
  }, [youtubeId]);

  // Set controls=1 to enable the progress bar (scrollbar) and other controls.
  let videoSrc = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&playsinline=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3`;

  if (youtubeStartTime && youtubeStartTime > 0) {
    videoSrc += `&start=${youtubeStartTime}`;
  }

  const toggleVideoVisibility = () => {
    setIsVideoVisible(prev => !prev);
  };

  // Animated audio visualizer bars with varying heights
  const AudioVisualizer = () => {
    const bars = [
      { height: 'h-8', delay: 'delay-0' },
      { height: 'h-12', delay: 'delay-75' },
      { height: 'h-6', delay: 'delay-150' },
      { height: 'h-10', delay: 'delay-100' },
      { height: 'h-7', delay: 'delay-200' },
      { height: 'h-11', delay: 'delay-50' },
      { height: 'h-9', delay: 'delay-125' },
    ];

    return (
      <div className="flex items-end space-x-1 h-12">
        {bars.map((bar, index) => (
          <div
            key={index}
            className={`w-1 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full transition-all duration-300 ${bar.delay}`}
            style={{
              animation: 'pulse 1s ease-in-out infinite',
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div
              className={`w-full ${bar.height} bg-gradient-to-t from-amber-500 to-amber-300 rounded-full`}
              style={{
                animation: 'audioWave 0.6s ease-in-out infinite alternate',
                animationDelay: `${index * 0.15}s`,
              }}
            />
          </div>
        ))}
        <style jsx>{`
          @keyframes audioWave {
            0% {
              transform: scaleY(0.3);
            }
            100% {
              transform: scaleY(1);
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {isVideoVisible ? (
        <>
          {/* Full video player */}
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg border-2 border-amber-400/50 transition-all duration-300 ease-in-out">
            <iframe
              ref={iframeRef}
              src={videoSrc}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </>
      ) : (
        <>
          {/* Audio-only mode: minimal height with black background */}
          <div className="w-full h-20 bg-gradient-to-r from-gray-900 to-slate-800 rounded-lg shadow-lg border-2 border-amber-400/50 flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <>
                  {/* Loading spinner */}
                  <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-amber-300 font-semibold">Loading...</span>
                </>
              ) : (
                <>
                  {/* Audio visualizer */}
                  <AudioVisualizer />
                  <span className="text-amber-300 font-semibold">Audio Playing...</span>
                </>
              )}
            </div>
          </div>
          {/* Hidden iframe for audio playback */}
          <div className="hidden">
            <iframe
              ref={iframeRef}
              src={videoSrc}
              title="YouTube audio player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              className="w-0 h-0"
            ></iframe>
          </div>
        </>
      )}

      {/* Toggle Button */}
      <div className="text-center mt-4">
        <button
          onClick={toggleVideoVisibility}
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-all duration-300 ease-in-out"
        >
          {isVideoVisible ? 'Hide Video' : 'Show Video'}
        </button>
      </div>
    </div>
  );
};

export default YouTubePlayer;
