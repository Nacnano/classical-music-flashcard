import React, { useState } from 'react';

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

  // Set controls=1 to enable the progress bar (scrollbar) and other controls.
  let videoSrc = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&playsinline=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3`;

  if (youtubeStartTime && youtubeStartTime > 0) {
    videoSrc += `&start=${youtubeStartTime}`;
  }

  const toggleVideoVisibility = () => {
    setIsVideoVisible(prev => !prev);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Container for the iframe, its height will change */}
      <div
        className={`w-full bg-black rounded-lg overflow-hidden shadow-lg border-2 border-amber-400/50 transition-all duration-300 ease-in-out ${
          isVideoVisible ? 'aspect-video' : 'h-20'
        }`}
      >
        <iframe
          src={videoSrc}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>

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
