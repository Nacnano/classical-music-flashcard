'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MusicPiece, GameState, Feedback } from './types';
import { MUSIC_LIST } from './constants';
import Flashcard from './components/Flashcard';
import FeedbackScreen from './components/FeedbackScreen';
import EndScreen from './components/EndScreen';
import Header from './components/Header';
import Loader from './components/Loader';
import FilterScreen from './components/FilterScreen';

/**
 * Calculates the Levenshtein distance between two strings.
 * This allows for fuzzy string matching, forgiving minor typos.
 * @param s1 The first string.
 * @param s2 The second string.
 * @returns The number of edits (insertions, deletions, substitutions) needed to change s1 into s2.
 */
const levenshteinDistance = (s1: string, s2: string): number => {
  const str1 = s1.toLowerCase();
  const str2 = s2.toLowerCase();
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return track[str2.length][str1.length];
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [shuffledList, setShuffledList] = useState<MusicPiece[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For checking answers

  const handleStartQuiz = (selectedSongs: MusicPiece[]) => {
    const shuffled = [...selectedSongs].sort(() => Math.random() - 0.5);

    setShuffledList(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setGameState(GameState.Playing);
  };

  const handleRestart = () => {
    setGameState(GameState.Start);
  };

  const handleSubmitAnswer = (userComposer: string, userTitle: string) => {
    setIsLoading(true);
    const currentPiece = shuffledList[currentIndex];

    const composerDistance = levenshteinDistance(userComposer.trim(), currentPiece.composer);
    const titleDistance = levenshteinDistance(userTitle.trim(), currentPiece.title);

    // Thresholds for correctness: allows for minor typos.
    const COMPOSER_THRESHOLD = 2; // e.g., "Beethovan" instead of "Beethoven" is ok.
    const TITLE_THRESHOLD = 3; // Allows for a few typos in the title.

    const isComposerCorrect = composerDistance <= COMPOSER_THRESHOLD;
    const isTitleCorrect = titleDistance <= TITLE_THRESHOLD;

    if (isComposerCorrect && isTitleCorrect) {
      setScore(prev => prev + 1);
      setFeedback({
        isCorrect: true,
        correctPiece: currentPiece,
        feedbackMessage: 'Excellent work!',
        userComposer: userComposer.trim(),
        userTitle: userTitle.trim(),
      });
    } else {
      setFeedback({
        isCorrect: false,
        correctPiece: currentPiece,
        feedbackMessage: "That wasn't quite right. The correct answer is shown above. Keep trying!",
        userComposer: userComposer.trim(),
        userTitle: userTitle.trim(),
      });
    }
    setGameState(GameState.Feedback);
    setTimeout(() => setIsLoading(false), 300); // Simulate processing time
  };

  const handleGiveUp = () => {
    setIsLoading(true);
    const currentPiece = shuffledList[currentIndex];

    setFeedback({
      isCorrect: false,
      correctPiece: currentPiece,
      feedbackMessage: "Don't worry! Here's the correct answer. Keep practicing!",
      userComposer: undefined,
      userTitle: undefined,
    });
    setGameState(GameState.Feedback);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    if (currentIndex < shuffledList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setGameState(GameState.Playing);
    } else {
      setGameState(GameState.Finished);
    }
  };

  const handlePreviousQuestion = () => {
    setFeedback(null);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setGameState(GameState.Playing);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader message="Checking your answer..." />;
    }

    switch (gameState) {
      case GameState.Start:
        return <FilterScreen onStartQuiz={handleStartQuiz} />;
      case GameState.Playing:
        if (shuffledList.length === 0) return <Loader message="Preparing quiz..." />;
        const currentPiece = shuffledList[currentIndex];
        return (
          <Flashcard
            pieceNumber={currentIndex + 1}
            totalPieces={shuffledList.length}
            youtubeId={currentPiece.youtubeId}
            youtubeStartTime={currentPiece.youtubeStartTime}
            onSubmit={handleSubmitAnswer}
            onGiveUp={handleGiveUp}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
          />
        );
      case GameState.Feedback:
        return feedback && <FeedbackScreen feedback={feedback} onNext={handleNextQuestion} />;
      case GameState.Finished:
        return <EndScreen score={score} total={shuffledList.length} onRestart={handleRestart} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-gray-200 flex flex-col items-center justify-center p-4">
      <Header />
      <main className="w-full max-w-2xl mx-auto flex-grow flex items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
