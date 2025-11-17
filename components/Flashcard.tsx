'use client';

import React, { useState, useEffect } from 'react';
import Button from './Button';
import YouTubePlayer from './YouTubePlayer';
import ProgressBar from './ProgressBar';
import { QuizMode, MusicPiece } from '../types';

interface FlashcardProps {
  pieceNumber: number;
  totalPieces: number;
  youtubeId: string;
  youtubeStartTime?: number;
  quizMode: QuizMode;
  allSongs: MusicPiece[];
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
  quizMode,
  allSongs,
  onSubmit,
  onGiveUp,
  onNext,
  onPrevious,
}) => {
  const [composer, setComposer] = useState('');
  const [title, setTitle] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [choices, setChoices] = useState<MusicPiece[]>([]);

  useEffect(() => {
    // Clear inputs when the piece changes (e.g., when skipping)
    setComposer('');
    setTitle('');
    setSelectedChoice(null);

    // Generate multiple choice options
    if (quizMode === QuizMode.MultipleChoice) {
      const currentSong = allSongs[pieceNumber - 1];
      const otherSongs = allSongs.filter((_, index) => index !== pieceNumber - 1);

      // Pick 3 random wrong answers
      const wrongChoices = otherSongs.sort(() => Math.random() - 0.5).slice(0, 3);

      // Combine and shuffle all choices
      const allChoices = [currentSong, ...wrongChoices].sort(() => Math.random() - 0.5);
      setChoices(allChoices);
    }
  }, [pieceNumber, quizMode, allSongs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (quizMode === QuizMode.Write) {
      if (composer && title) {
        onSubmit(composer, title);
      }
    } else if (quizMode === QuizMode.MultipleChoice) {
      if (selectedChoice !== null) {
        const selected = choices[selectedChoice];
        onSubmit(selected.composer, selected.title);
      }
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
        {quizMode === QuizMode.Write ? (
          <>
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
          </>
        ) : (
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3">
              Choose the correct answer:
            </label>
            <div className="space-y-2 sm:space-y-3">
              {choices.map((choice, index) => (
                <label
                  key={index}
                  className={`flex items-start p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedChoice === index
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="choice"
                    value={index}
                    checked={selectedChoice === index}
                    onChange={() => setSelectedChoice(index)}
                    className="sr-only"
                    required
                  />
                  <div className="flex items-center w-full">
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedChoice === index ? 'border-amber-500' : 'border-gray-600'
                      }`}
                    >
                      {selectedChoice === index && (
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500"></div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="text-sm sm:text-base text-gray-200 break-words">
                        <span className="font-semibold text-amber-300">{choice.composer}</span>
                        <span className="text-gray-400"> - </span>
                        <span className="italic">"{choice.title}"</span>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
        <div className="pt-2 sm:pt-4 space-y-2 sm:space-y-3">
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
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={onGiveUp}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base"
            >
              Give Up
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Flashcard;
