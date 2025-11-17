
import React from 'react';
import Button from './Button';

interface EndScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, total, onRestart }) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="text-center bg-slate-800/50 p-8 rounded-xl shadow-2xl animate-fade-in">
      <h2 className="text-4xl font-bold mb-4 text-amber-200">Quiz Complete!</h2>
      <p className="text-2xl text-gray-300 mb-2">Your Final Score:</p>
      <p className="text-6xl font-bold text-white my-4">{score} / {total}</p>
      <p className="text-3xl font-semibold text-amber-300 mb-8">({percentage}%)</p>
      <Button onClick={onRestart}>
        Play Again
      </Button>
    </div>
  );
};

export default EndScreen;
