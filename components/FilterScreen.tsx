'use client';

import React, { useState } from 'react';
import Button from './Button';
import { WEEKS, MUSIC_LIST } from '../constants';
import type { MusicPiece } from '../types';
import { QuizMode } from '../types';

interface FilterScreenProps {
  onStartQuiz: (selectedSongs: MusicPiece[], quizMode: QuizMode) => void;
}

const FilterScreen: React.FC<FilterScreenProps> = ({ onStartQuiz }) => {
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>(WEEKS);
  const [selectedSongIds, setSelectedSongIds] = useState<Set<string>>(
    new Set(MUSIC_LIST.map(song => `${song.composer}|${song.title}`))
  );
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
  const [quizMode, setQuizMode] = useState<QuizMode>(QuizMode.Write);

  const getSongId = (song: MusicPiece) => `${song.composer}|${song.title}`;

  const handleToggleWeek = (week: string) => {
    const songs = getSongsForWeek(week);
    const isWeekSelected = selectedWeeks.includes(week);

    if (isWeekSelected) {
      // Deselect week and all its songs
      setSelectedWeeks(prev => prev.filter(w => w !== week));
      setSelectedSongIds(prev => {
        const newSet = new Set(prev);
        songs.forEach(song => newSet.delete(getSongId(song)));
        return newSet;
      });
    } else {
      // Select week and all its songs
      setSelectedWeeks(prev => [...prev, week]);
      setSelectedSongIds(prev => {
        const newSet = new Set(prev);
        songs.forEach(song => newSet.add(getSongId(song)));
        return newSet;
      });
    }
  };

  const handleToggleSong = (song: MusicPiece) => {
    const songId = getSongId(song);
    setSelectedSongIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(songId)) {
        newSet.delete(songId);
      } else {
        newSet.add(songId);
      }

      // Update week selection based on songs
      const songsInWeek = getSongsForWeek(song.week);
      const allSongsInWeekSelected = songsInWeek.every(s => newSet.has(getSongId(s)));
      const noSongsInWeekSelected = songsInWeek.every(s => !newSet.has(getSongId(s)));

      if (allSongsInWeekSelected && !selectedWeeks.includes(song.week)) {
        setSelectedWeeks(prev => [...prev, song.week]);
      } else if (noSongsInWeekSelected && selectedWeeks.includes(song.week)) {
        setSelectedWeeks(prev => prev.filter(w => w !== song.week));
      } else if (!allSongsInWeekSelected && selectedWeeks.includes(song.week)) {
        setSelectedWeeks(prev => prev.filter(w => w !== song.week));
      }

      return newSet;
    });
  };

  const toggleExpandWeek = (week: string) => {
    setExpandedWeek(prev => (prev === week ? null : week));
  };

  const getSongsForWeek = (week: string) => {
    return MUSIC_LIST.filter(piece => piece.week === week);
  };

  const handleSelectAll = () => {
    setSelectedWeeks(WEEKS);
    setSelectedSongIds(new Set(MUSIC_LIST.map(song => getSongId(song))));
  };

  const handleDeselectAll = () => {
    setSelectedWeeks([]);
    setSelectedSongIds(new Set());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSongs = MUSIC_LIST.filter(song => selectedSongIds.has(getSongId(song)));
    if (selectedSongs.length > 0) {
      onStartQuiz(selectedSongs, quizMode);
    }
  };

  const getSelectedSongsCount = () => selectedSongIds.size;

  return (
    <div className="w-full max-w-2xl bg-slate-800/50 p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl animate-fade-in text-center">
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-amber-200">
        Select Weeks to Study
      </h2>
      <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
        Choose the weeks you want to be quizzed on.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Quiz Mode Selection */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-900/50 rounded-lg">
          <h3 className="text-sm sm:text-base font-semibold text-amber-300 mb-3">Quiz Mode:</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="quizMode"
                value={QuizMode.Write}
                checked={quizMode === QuizMode.Write}
                onChange={() => setQuizMode(QuizMode.Write)}
                className="sr-only peer"
              />
              <div className="p-3 sm:p-4 border-2 border-gray-700 rounded-lg peer-checked:border-amber-500 peer-checked:bg-amber-500/10 hover:bg-gray-800/50 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-600 peer-checked:border-amber-500 flex items-center justify-center">
                    {quizMode === QuizMode.Write && (
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    )}
                  </div>
                  <span className="font-semibold text-gray-200 text-sm sm:text-base">
                    Write Answer
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 ml-6">Type composer and title</p>
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="quizMode"
                value={QuizMode.MultipleChoice}
                checked={quizMode === QuizMode.MultipleChoice}
                onChange={() => setQuizMode(QuizMode.MultipleChoice)}
                className="sr-only peer"
              />
              <div className="p-3 sm:p-4 border-2 border-gray-700 rounded-lg peer-checked:border-amber-500 peer-checked:bg-amber-500/10 hover:bg-gray-800/50 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-600 peer-checked:border-amber-500 flex items-center justify-center">
                    {quizMode === QuizMode.MultipleChoice && (
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    )}
                  </div>
                  <span className="font-semibold text-gray-200 text-sm sm:text-base">
                    Multiple Choice
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 ml-6">Choose from 4 options</p>
              </div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:gap-3 text-left my-4 sm:my-6 max-h-[60vh] sm:max-h-96 overflow-y-auto pr-1">
          {WEEKS.map(week => {
            const songs = getSongsForWeek(week);
            const isExpanded = expandedWeek === week;
            return (
              <div key={week} className="bg-gray-900/50 rounded-lg overflow-hidden">
                <div className="flex items-center p-2 sm:p-3 hover:bg-gray-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedWeeks.includes(week)}
                    onChange={() => handleToggleWeek(week)}
                    className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-400 focus:ring-2 flex-shrink-0"
                  />
                  <button
                    type="button"
                    onClick={() => toggleExpandWeek(week)}
                    className="flex-1 flex items-center justify-between ml-2 sm:ml-3 text-left min-w-0"
                  >
                    <span className="text-sm sm:text-base text-gray-200 font-medium truncate">
                      {week}
                    </span>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">
                        {songs.length} {songs.length === 1 ? 'song' : 'songs'}
                      </span>
                      <svg
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
                {isExpanded && (
                  <div className="px-2 sm:px-3 pb-2 sm:pb-3 pt-1 space-y-1 bg-gray-900/70">
                    {songs.map((song, index) => {
                      const songId = getSongId(song);
                      const isSelected = selectedSongIds.has(songId);
                      return (
                        <label
                          key={index}
                          className="flex items-start sm:items-center text-xs sm:text-sm text-gray-300 pl-2 sm:pl-4 py-1.5 sm:py-2 hover:bg-gray-800/50 rounded cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSong(song)}
                            className="form-checkbox h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 sm:mt-0 text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-400 focus:ring-2 flex-shrink-0"
                          />
                          <div className="ml-2 sm:ml-3 flex-1 border-l-2 border-amber-500/30 pl-2 sm:pl-3 min-w-0">
                            <span className="font-medium text-amber-300 break-words">
                              {song.composer}
                            </span>
                            <span className="text-gray-400"> - </span>
                            <span className="text-gray-300 break-words">{song.title}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 my-4 sm:my-6">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSelectAll}
            className="w-full sm:w-auto"
          >
            Select All
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleDeselectAll}
            className="w-full sm:w-auto"
          >
            Deselect All
          </Button>
        </div>

        <Button
          type="submit"
          disabled={getSelectedSongsCount() === 0}
          className="w-full disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          Start Quiz ({getSelectedSongsCount()} {getSelectedSongsCount() === 1 ? 'Song' : 'Songs'})
        </Button>
      </form>
    </div>
  );
};

export default FilterScreen;
