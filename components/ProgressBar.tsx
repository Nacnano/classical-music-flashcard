import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div
      className="w-full bg-gray-700 rounded-full h-2.5 mb-6"
      role="status"
      aria-label="Quiz progress"
    >
      <div
        className="bg-amber-400 h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      ></div>
    </div>
  );
};

export default ProgressBar;
