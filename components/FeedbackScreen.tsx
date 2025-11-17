import React from 'react';
import { Feedback } from '../types';
import Button from './Button';
import YouTubePlayer from './YouTubePlayer';

interface FeedbackScreenProps {
  feedback: Feedback;
  onNext: () => void;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ feedback, onNext }) => {
  const { isCorrect, correctPiece, feedbackMessage, userComposer, userTitle } = feedback;

  return (
    <div className="w-full text-center bg-slate-800/50 p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl animate-fade-in">
      <div
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto flex items-center justify-center mb-4 sm:mb-6 ${
          isCorrect ? 'bg-green-500/80' : 'bg-red-500/80'
        }`}
      >
        {isCorrect ? (
          <CheckIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        ) : (
          <XIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        )}
      </div>

      <h2
        className={`text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}
      >
        {isCorrect ? 'Correct!' : 'Not Quite!'}
      </h2>

      {/* User's Answer */}
      {(userComposer || userTitle) && (
        <div className="bg-gray-900/50 p-3 sm:p-4 rounded-lg border-l-4 border-purple-400 text-left my-4 sm:my-6">
          <h3 className="font-bold text-purple-300 mb-2 text-sm sm:text-base">Your Answer:</h3>
          <p className="text-gray-200 text-sm sm:text-base break-words">
            {userComposer} - <span className="italic">"{userTitle}"</span>
          </p>
        </div>
      )}

      {/* Correct Answer */}
      <div className="my-4 sm:my-6 text-base sm:text-lg">
        <h3 className="font-bold text-amber-300 mb-2 text-sm sm:text-base">Correct Answer:</h3>
        <p className="font-semibold text-amber-200 mt-1 text-lg sm:text-xl break-words px-2">
          {correctPiece.composer} - <span className="italic">"{correctPiece.title}"</span>
        </p>
        <div className="mt-3 sm:mt-4 max-w-md mx-auto">
          <YouTubePlayer
            youtubeId={correctPiece.youtubeId}
            youtubeStartTime={correctPiece.youtubeStartTime}
          />
        </div>
      </div>

      {correctPiece.keyPoint && (
        <div className="bg-gray-900/50 p-3 sm:p-4 rounded-lg border-l-4 border-cyan-400 text-left my-4 sm:my-6 md:my-8">
          <h3 className="font-bold text-cyan-300 mb-2 flex items-center text-sm sm:text-base">
            <InfoIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" />
            Key Point to Remember
          </h3>
          <p className="text-gray-300 italic text-xs sm:text-sm md:text-base">
            {correctPiece.keyPoint}
          </p>
        </div>
      )}

      <div className="bg-gray-900/50 p-3 sm:p-4 rounded-lg border-l-4 border-amber-400 text-left my-4 sm:my-6 md:my-8">
        <p className="text-gray-300 italic text-xs sm:text-sm md:text-base">{feedbackMessage}</p>
      </div>

      <Button onClick={onNext} className="w-full sm:w-auto text-sm sm:text-base">
        Next Piece
      </Button>
    </div>
  );
};

export default FeedbackScreen;
