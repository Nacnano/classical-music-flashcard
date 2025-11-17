'use client';

import React, { useState, useEffect } from 'react';
import Button from './Button';
import YouTubePlayer from './YouTubePlayer';
import ProgressBar from './ProgressBar';

interface FlashcardProps {
  pieceNumber: number;
  totalPieces: number;
  youtubeId: string;
  youtubeStartTime?: number;
  onSubmit: (composer: string, title: string) => void;
  onGiveUp: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({
  pieceNumber,
  totalPieces,
  youtubeId,
  youtubeStartTime,
  onSubmit,
  onGiveUp,
  onNext,
  onPrevious,
}) => {
  const [composer, setComposer] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    // Clear inputs when the piece changes (e.g., when skipping)
    setComposer('');
    setTitle('');
  }, [pieceNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (composer && title) {
      onSubmit(composer, title);
    }
  };

  return (
    <div className="w-full bg-slate-800/50 p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl animate-fade-in">
      <div className="text-right text-amber-300 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
        Piece {pieceNumber} / {totalPieces}
      </div>
      <ProgressBar current={pieceNumber} total={totalPieces} />
      <div className="my-4 sm:my-6 md:my-8">
        <YouTubePlayer youtubeId={youtubeId} youtubeStartTime={youtubeStartTime} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label
            htmlFor="composer"
            className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2"
          >
            Composer
          </label>
          <input
            id="composer"
            type="text"
            value={composer}
            onChange={e => setComposer(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition duration-200"
            placeholder={pieceNumber === 1 ? 'e.g., Mozart' : ''}
            required
          />
        </div>
        <div>
          <label
            htmlFor="title"
            className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition duration-200"
            placeholder={pieceNumber === 1 ? 'e.g., Eine kleine Nachtmusik, I' : ''}
            required
          />
        </div>
        <div className="pt-2 sm:pt-4 space-y-2 sm:space-y-3">
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={onGiveUp}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base"
            >
              Give Up
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onPrevious}
              disabled={pieceNumber === 1}
              className="disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base order-1 sm:order-none"
            >
              Previous
            </Button>
            <Button type="submit" className="flex-grow text-sm sm:text-base order-2 sm:order-none">
              Check Answer
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onNext}
              className="text-sm sm:text-base order-3 sm:order-none"
            >
              Next
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Flashcard;
