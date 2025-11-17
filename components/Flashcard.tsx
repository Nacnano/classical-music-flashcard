
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
  onNext: () => void;
  onPrevious: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ pieceNumber, totalPieces, youtubeId, youtubeStartTime, onSubmit, onNext, onPrevious }) => {
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
    <div className="w-full bg-slate-800/50 p-8 rounded-xl shadow-2xl animate-fade-in">
      <div className="text-right text-amber-300 font-semibold mb-4">
        Piece {pieceNumber} / {totalPieces}
      </div>
      <ProgressBar current={pieceNumber} total={totalPieces} />
      <div className="my-8">
        <YouTubePlayer youtubeId={youtubeId} youtubeStartTime={youtubeStartTime} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="composer" className="block text-sm font-medium text-gray-300 mb-2">Composer</label>
          <input
            id="composer"
            type="text"
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition duration-200"
            placeholder="e.g., Mozart"
            required
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition duration-200"
            placeholder="e.g., Eine kleine Nachtmusik, I"
            required
          />
        </div>
        <div className="pt-4 flex justify-between items-center gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onPrevious}
            disabled={pieceNumber === 1}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>
          <Button type="submit" className="flex-grow">Check Answer</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onNext}
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Flashcard;