
import React, { useState } from 'react';
import Button from './Button';
import { WEEKS } from '../constants';

interface FilterScreenProps {
  onStartQuiz: (selectedWeeks: string[]) => void;
}

const FilterScreen: React.FC<FilterScreenProps> = ({ onStartQuiz }) => {
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>(WEEKS);

  const handleToggleWeek = (week: string) => {
    setSelectedWeeks(prev =>
      prev.includes(week)
        ? prev.filter(w => w !== week)
        : [...prev, week]
    );
  };

  const handleSelectAll = () => setSelectedWeeks(WEEKS);
  const handleDeselectAll = () => setSelectedWeeks([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWeeks.length > 0) {
      onStartQuiz(selectedWeeks);
    }
  };

  return (
    <div className="w-full max-w-lg bg-slate-800/50 p-8 rounded-xl shadow-2xl animate-fade-in text-center">
      <h2 className="text-3xl font-bold mb-4 text-amber-200">Select Weeks to Study</h2>
      <p className="text-gray-400 mb-6">Choose the weeks you want to be quizzed on.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left my-6">
          {WEEKS.map(week => (
            <label key={week} className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
              <input
                type="checkbox"
                checked={selectedWeeks.includes(week)}
                onChange={() => handleToggleWeek(week)}
                className="form-checkbox h-5 w-5 text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-400 focus:ring-2"
              />
              <span className="text-gray-200">{week}</span>
            </label>
          ))}
        </div>
        
        <div className="flex justify-center gap-4 my-6">
          <Button type="button" variant="secondary" onClick={handleSelectAll}>Select All</Button>
          <Button type="button" variant="secondary" onClick={handleDeselectAll}>Deselect All</Button>
        </div>
        
        <Button
          type="submit"
          disabled={selectedWeeks.length === 0}
          className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Quiz ({selectedWeeks.length} {selectedWeeks.length === 1 ? 'Week' : 'Weeks'})
        </Button>
      </form>
    </div>
  );
};

export default FilterScreen;